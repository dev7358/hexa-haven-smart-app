import {useNavigation, useRoute} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import {useEffect, useState} from 'react';
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
import {updateDevice} from '../redux/slices/switchSlice';

export default function HexaDevices() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const selectedDevice = useSelector(state =>
    state.switches.activeDevices.find(
      device => device.id === Number(route.params.deviceId),
    ),
  );

  const [mainToggle, setMainToggle] = useState(false);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [amPm, setAmPm] = useState('AM');
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [switchStates, setSwitchStates] = useState(
    selectedDevice?.switches || [],
  );
  const [checkedStates, setCheckedStates] = useState(
    selectedDevice?.switches.map(() => false) || [],
  );
  const [fanSpeeds, setFanSpeeds] = useState(
    selectedDevice?.regulators.map(() => 0) || [],
  );

  // Pre-allocate Hooks for up to 6 regulators
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
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timeLeft === 0 && timer) {
      // Timer hits zero, turn off all toggles
      setMainToggle(false);
      setSwitchStates(switchStates.map(() => false));
      setCheckedStates(checkedStates.map(() => false));
      setFanSpeeds(fanSpeeds.map(() => 0));
      fanRotations.forEach(rotation => {
        rotation.value = withTiming(0, {duration: 500, easing: Easing.linear});
      });
      setTimer(null);
    }
  }, [timeLeft]);

  const handleToggleMain = () => {
    setMainToggle(!mainToggle);
  };

  const handleToggleSwitch = index => {
    const newSwitchStates = [...switchStates];
    newSwitchStates[index] = !newSwitchStates[index];
    setSwitchStates(newSwitchStates);

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

  const handleStartScheduling = () => {
    const hrs = parseInt(hours, 10);
    const mins = parseInt(minutes, 10);

    if (
      isNaN(hrs) ||
      isNaN(mins) ||
      hrs < 1 ||
      hrs > 12 ||
      mins < 0 ||
      mins > 59
    ) {
      Alert.alert(
        'Invalid Time',
        'Please enter valid hours (1-12) and minutes (0-59).',
      );
      return;
    }

    let scheduledHours = hrs;
    if (amPm === 'PM' && hrs !== 12) scheduledHours += 12;
    if (amPm === 'AM' && hrs === 12) scheduledHours = 0;

    const now = new Date();
    const scheduledDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      scheduledHours,
      mins,
    );

    const timeout = scheduledDate.getTime() - now.getTime();
    if (timeout > 0) {
      setTimeLeft(Math.floor(timeout / 1000));
      setTimer(timeout);
    } else {
      Alert.alert('Invalid Time', 'The scheduled time must be in the future.');
    }
  };

  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNumericInput = (text, setter) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    setter(cleanedText);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Main Toggle */}
      <View className="flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-4">
        <Text className="text-lg font-semibold text-gray-800">
          Main Control
        </Text>
        <TouchableOpacity
          onPress={handleToggleMain}
          className="p-2 rounded-full bg-gray-100">
          <FontAwesomeIcon
            icon={mainToggle ? faToggleOn : faToggleOff}
            size={30}
            color={mainToggle ? '#84c3e0' : '#ff8625'}
          />
        </TouchableOpacity>
      </View>

      {/* Schedule Time */}
      <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <View className="flex-row items-center mb-4">
          <FontAwesomeIcon icon={faClock} size={20} color="#4A5568" />
          <Text className="text-lg font-semibold text-gray-800 ml-2">
            Schedule Off
          </Text>
        </View>
        <View className="flex-row justify-between mb-4">
          <TextInput
            className="flex-1 border border-gray-200 rounded-lg p-2 mr-2 text-center text-gray-800"
            placeholder="HH"
            keyboardType="numeric"
            value={hours}
            onChangeText={text => handleNumericInput(text, setHours)}
            maxLength={2}
          />
          <TextInput
            className="flex-1 border border-gray-200 rounded-lg p-2 mx-2 text-center text-gray-800"
            placeholder="MM"
            keyboardType="numeric"
            value={minutes}
            onChangeText={text => handleNumericInput(text, setMinutes)}
            maxLength={2}
          />
          <TouchableOpacity
            className="bg-[#84c3e0] p-2 rounded-lg"
            onPress={() => setAmPm(prev => (prev === 'AM' ? 'PM' : 'AM'))}>
            <Text className="text-white font-semibold">{amPm}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="bg-[#84c3e0] p-3 rounded-lg items-center"
          onPress={handleStartScheduling}>
          <Text className="text-white font-semibold">Start Scheduling</Text>
        </TouchableOpacity>
        {timer !== null && (
          <View className="mt-4 items-center">
            <Text className="text-gray-800">Time Left:</Text>
            <Text className="text-2xl font-bold text-gray-800">
              {formatTime(timeLeft)}
            </Text>
          </View>
        )}
      </View>

      {/* Switch Cards */}
      <View className="flex-row flex-wrap justify-between">
        {selectedDevice?.switches.map((sw, idx) => (
          <View
            key={idx}
            className="w-[48%] bg-white p-4 rounded-xl shadow-sm mb-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">
                {selectedDevice?.regulators.length > idx
                  ? `Fan ${idx + 1}`
                  : `Switch ${idx + 1}`}
              </Text>
              <TouchableOpacity
                onPress={() => handleToggleCheckbox(idx)}
                disabled={!mainToggle}>
                <FontAwesomeIcon
                  icon={checkedStates[idx] ? faCheckSquare : faSquare}
                  size={20}
                  color={checkedStates[idx] && mainToggle ? '#84c3e0' : '#ccc'}
                />
              </TouchableOpacity>
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

            {/* Fan or Light Icon */}
            {selectedDevice?.regulators.length > idx ? (
              <View className="items-center mt-4">
                <View className="relative w-32 h-32">
                  <Animated.View
                    style={[animatedFanStyles[idx]]}
                    className="absolute flex justify-center items-center inset-0">
                    <FontAwesomeIcon
                      icon={faFan}
                      size={50}
                      color={switchStates[idx] ? '#84c3e0' : '#ccc'}
                    />
                  </Animated.View>
                  {Array.from({length: 6}, (_, i) => i + 1).map(
                    (speed, index) => {
                      const angle = index * (360 / 6) - 90;
                      const x = 40 + 50 * Math.cos((angle * Math.PI) / 180);
                      const y = 40 + 50 * Math.sin((angle * Math.PI) / 180);
                      return (
                        <TouchableOpacity
                          key={speed}
                          className="absolute"
                          style={{left: x, top: y}}
                          onPress={() => handleFanSpeedChange(idx, speed)}
                          disabled={!switchStates[idx]}>
                          <Text
                            className={`p-2 rounded-full ${
                              fanSpeeds[idx] === speed
                                ? 'bg-[#84c3e0] text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}>
                            {speed}
                          </Text>
                        </TouchableOpacity>
                      );
                    },
                  )}
                </View>
              </View>
            ) : (
              <View className="mt-4 items-center">
                <Animated.View className="flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={faLightbulb}
                    size={40}
                    color={switchStates[idx] ? '#ff8625' : '#ccc'}
                  />
                </Animated.View>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
