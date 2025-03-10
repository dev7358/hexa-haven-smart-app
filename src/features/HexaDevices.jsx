import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faFan,
  faCheckSquare,
  faSquare,
  faToggleOn,
  faToggleOff,
  faClock,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import TimePickerModal from '../components/TimePickerModal';
import DelayTimerModal from '../components/DelayTimerModal';
import {
  updateDevice,
  setTimer,
  decrementTimer,
  resetTimer,
  setMainToggleTimer,
  decrementMainToggleTimer,
  resetMainToggleTimer,
} from '../redux/slices/switchSlice';

export default function HexaDevices() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const selectedDevice = useSelector(state =>
    state.switches.activeDevices.find(
      device => device.id === Number(route.params.deviceId),
    ),
  );

  const timers = useSelector(
    state => state.switches.timers[selectedDevice?.id] || {},
  );

  const mainToggleTimer = useSelector(state => state.switches.mainToggleTimer);

  const [mainToggle, setMainToggle] = useState(false);
  const [switchStates, setSwitchStates] = useState(
    selectedDevice?.switches || [],
  );
  const [checkedStates, setCheckedStates] = useState(
    selectedDevice?.switches.map(() => false) || [],
  );
  const [fanSpeeds, setFanSpeeds] = useState(
    selectedDevice?.regulators.map(() => 0) || [],
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSwitchIndex, setSelectedSwitchIndex] = useState(null);
  const [delayModalVisible, setDelayModalVisible] = useState(false);

  const fanRotations = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  const animatedFanStyles = fanRotations.map(rotation =>
    useAnimatedStyle(() => ({
      transform: [{rotate: `${rotation.value}deg`}],
    })),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (mainToggleTimer > 0) {
        dispatch(decrementMainToggleTimer());
      } else if (mainToggleTimer === 0) {
        handleMainToggleTimerEnd();
        dispatch(resetMainToggleTimer());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [mainToggleTimer]);

  useEffect(() => {
    const interval = setInterval(() => {
      Object.keys(timers).forEach(switchIndex => {
        if (timers[switchIndex] > 0) {
          dispatch(decrementTimer({deviceId: selectedDevice.id, switchIndex}));
        } else if (timers[switchIndex] === 0) {
          handleTimerEnd(Number(switchIndex));
          dispatch(resetTimer({deviceId: selectedDevice.id, switchIndex}));
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timers, selectedDevice?.id]);

  const handleMainToggleTimerEnd = () => {
    setMainToggle(false);
    const newSwitchStates = [...switchStates];
    const newCheckedStates = [...checkedStates];
    checkedStates.forEach((isChecked, index) => {
      if (isChecked) {
        newSwitchStates[index] = false;
        newCheckedStates[index] = false;
        if (selectedDevice?.regulators.length > index) {
          const newFanSpeeds = [...fanSpeeds];
          newFanSpeeds[index] = 0;
          setFanSpeeds(newFanSpeeds);
          fanRotations[index].value = withTiming(0, {
            duration: 500,
            easing: Easing.linear,
          });
        }
      }
    });

    setSwitchStates(newSwitchStates);
    setCheckedStates(newCheckedStates);
    dispatch(updateDevice({id: selectedDevice.id, switches: newSwitchStates}));
  };

  const handleTimerEnd = switchIndex => {
    const newSwitchStates = [...switchStates];
    newSwitchStates[switchIndex] = false;
    setSwitchStates(newSwitchStates);

    if (selectedDevice?.regulators.length > switchIndex) {
      const newFanSpeeds = [...fanSpeeds];
      newFanSpeeds[switchIndex] = 0;
      setFanSpeeds(newFanSpeeds);
      fanRotations[switchIndex].value = withTiming(0, {
        duration: 500,
        easing: Easing.linear,
      });
    }

    dispatch(updateDevice({id: selectedDevice.id, switches: newSwitchStates}));
  };

  const handleScheduleTimer = (switchIndex, timeLeft) => {
    dispatch(setTimer({deviceId: selectedDevice.id, switchIndex, timeLeft}));
  };

  const handleOpenModal = index => {
    setSelectedSwitchIndex(index);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSelectDelay = delay => {
    setDelayModalVisible(false);
    if (delay) {
      dispatch(setMainToggleTimer(delay));
      setMainToggle(true);
    }
  };

  const handleToggleSwitch = index => {
    const newSwitchStates = [...switchStates];
    newSwitchStates[index] = !newSwitchStates[index];
    setSwitchStates(newSwitchStates);

    if (!newSwitchStates[index]) {
      dispatch(resetTimer({deviceId: selectedDevice.id, switchIndex: index}));
    }

    if (selectedDevice?.regulators.length > index && !newSwitchStates[index]) {
      const newFanSpeeds = [...fanSpeeds];
      newFanSpeeds[index] = 0;
      setFanSpeeds(newFanSpeeds);
      fanRotations[index].value = withTiming(0, {
        duration: 500,
        easing: Easing.linear,
      });
    }

    dispatch(updateDevice({id: selectedDevice.id, switches: newSwitchStates}));
  };

  const handleToggleCheckbox = index => {
    if (!mainToggle) return;
    const newCheckedStates = [...checkedStates];
    newCheckedStates[index] = !newCheckedStates[index];
    setCheckedStates(newCheckedStates);

    if (newCheckedStates[index]) {
      const newSwitchStates = [...switchStates];
      newSwitchStates[index] = true;
      setSwitchStates(newSwitchStates);
      dispatch(
        updateDevice({id: selectedDevice.id, switches: newSwitchStates}),
      );
    }
  };

  const handleFanSpeedChange = (fanIndex, speed) => {
    if (!switchStates[fanIndex]) return;
    const newFanSpeeds = [...fanSpeeds];
    newFanSpeeds[fanIndex] = speed;
    setFanSpeeds(newFanSpeeds);
    fanRotations[fanIndex].value = withTiming(speed * 360, {
      duration: 1000,
      easing: Easing.linear,
    });

    dispatch(updateDevice({id: selectedDevice.id, regulators: newFanSpeeds}));
  };

  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView className="flex-1 p-4 mb-2">
      <View className="flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-4">
        <Text className="text-lg font-semibold text-gray-800">
          Main Control
        </Text>
        <TouchableOpacity
          onPress={() => setDelayModalVisible(true)}
          className="p-2 rounded-full bg-gray-100">
          <FontAwesomeIcon
            icon={mainToggle ? faToggleOn : faToggleOff}
            size={30}
            color={mainToggle ? '#84c3e0' : '#ff8625'}
          />
        </TouchableOpacity>
      </View>

      <DelayTimerModal
        visible={delayModalVisible}
        onClose={() => setDelayModalVisible(false)}
        onSelectDelay={handleSelectDelay}
      />

      <View className="flex-row flex-wrap justify-between">
        {selectedDevice?.switches.map((sw, idx) => (
          <View
            key={idx}
            className="w-[100%] bg-white p-4 rounded-xl shadow-sm mb-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">
                {selectedDevice?.regulators.length > idx
                  ? `Fan ${idx + 1}`
                  : `Switch ${idx + 1}`}
              </Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => handleOpenModal(idx)}
                  disabled={!switchStates[idx]}
                  className="mr-2">
                  <FontAwesomeIcon
                    icon={faClock}
                    size={20}
                    color={switchStates[idx] ? '#4A5568' : '#ccc'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleToggleCheckbox(idx)}
                  disabled={!mainToggle}>
                  <FontAwesomeIcon
                    icon={checkedStates[idx] ? faCheckSquare : faSquare}
                    size={20}
                    color={
                      checkedStates[idx] && mainToggle ? '#84c3e0' : '#ccc'
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleToggleSwitch(idx)}
              className="mt-2">
              <FontAwesomeIcon
                icon={switchStates[idx] ? faToggleOn : faToggleOff}
                size={30}
                color={switchStates[idx] ? '#84c3e0' : '#ff8625'}
              />
            </TouchableOpacity>

            {selectedDevice?.regulators.length > idx ? (
              <View className="items-center">
                <Animated.View
                  style={[animatedFanStyles[idx]]}
                  className="flex justify-center items-center w-32 mb-2">
                  <FontAwesomeIcon
                    icon={faFan}
                    size={50}
                    color={switchStates[idx] ? '#84c3e0' : '#ccc'}
                  />
                </Animated.View>
                <Slider
                  style={{width: '100%', height: 40}}
                  minimumValue={0}
                  maximumValue={6}
                  step={1}
                  value={fanSpeeds[idx]}
                  onValueChange={value => handleFanSpeedChange(idx, value)}
                  disabled={!switchStates[idx]}
                  minimumTrackTintColor="#84c3e0"
                  maximumTrackTintColor="#ccc"
                />
              </View>
            ) : (
              <View className="mt-4 items-center">
                <Animated.View className="flex justify-center items-center mb-3">
                  <FontAwesomeIcon
                    icon={faLightbulb}
                    size={40}
                    color={switchStates[idx] ? '#ff8625' : '#ccc'}
                  />
                </Animated.View>
              </View>
            )}

            {timers[idx] > 0 && (
              <View className="mt-4 items-center">
                <Text className="text-gray-800">Time Left:</Text>
                <Text className="text-2xl font-bold text-gray-800">
                  {formatTime(timers[idx])}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <TimePickerModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSchedule={timeLeft =>
          handleScheduleTimer(selectedSwitchIndex, timeLeft)
        }
      />
    </ScrollView>
  );
}
