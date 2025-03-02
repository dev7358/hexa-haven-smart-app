import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Button,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPlus,
  faToggleOn,
  faXmark,
  faToggleOff,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import {
  addDevice,
  removeDevice,
  updateDevice,
  updateCardName,
} from '../redux/slices/switchSlice';
import DeviceDetectorLoader from './DeviceDetectorLoader';
import Animated, {FadeIn, SlideInRight, ZoomIn} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';

export default function SwitchSection() {
  const dispatch = useDispatch();
  const activeDevices = useSelector(state => state.switches.activeDevices);
  const cardNames = useSelector(state => state.switches.cardNames);
  const [isRotating, setIsRotating] = useState(false);
  const [manualSwitches] = useState([
    {
      id: 1,
      type: '3-channel',
      switches: [false, false, false],
      regulators: [0],
    },
    {
      id: 2,
      type: '5-channel',
      switches: [false, false, false],
      regulators: [0, 0],
    },
  ]);
  const navigation = useNavigation();

  const handleAddChannel = () => {
    setIsRotating(true);
  };

  const handleAddManualSwitch = switchItem => {
    dispatch(addDevice(switchItem));
  };

  const handleRemoveDevice = deviceId => {
    dispatch(removeDevice(deviceId));
  };

  const handleToggleSwitch = (deviceId, switchIndex) => {
    const updatedDevices = activeDevices.map(device =>
      device.id === deviceId
        ? {
            ...device,
            switches: device.switches.map((sw, idx) =>
              idx === switchIndex ? !sw : sw,
            ),
          }
        : device,
    );
    dispatch(
      updateDevice({
        id: deviceId,
        switches: updatedDevices.find(d => d.id === deviceId).switches,
      }),
    );
  };

  const handleUpdateCardName = (deviceId, name) => {
    dispatch(updateCardName({id: deviceId, name}));
  };

  return (
    <View>
      {/* Add Channel Button */}
      <Animated.View entering={FadeIn.duration(400)}>
        <TouchableOpacity
          className="bg-[#ff8625] p-4 rounded-2xl items-center shadow-xl flex-row justify-center space-x-3"
          onPress={handleAddChannel}
          activeOpacity={0.8}>
          <FontAwesomeIcon icon={faPlus} size={20} color="white" />
          <Text className="text-white font-bold text-lg">Add Channel</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Device Detector Loader */}
      {isRotating && (
        <Animated.View entering={FadeIn} className="mt-8 items-center">
          <Text className="text-lg font-bold text-[#1a365d] mb-4">
            Scanning for Devices...
          </Text>
          <DeviceDetectorLoader />
        </Animated.View>
      )}

      {/* Active Devices Grid */}
      {activeDevices.length > 0 && (
        <View className="mt-8">
          <Text className="text-2xl font-bold text-[#1a365d] mb-6">
            Active Devices
          </Text>
          <View className="flex flex-wrap flex-row justify-between gap-2">
            {activeDevices.map(device => {
              const cardName =
                cardNames.find(card => card.id === device.id)?.name;
              return (
                <Animated.View
                  key={device.id}
                  entering={SlideInRight.delay(200)}
                  className="w-[48%] mb-2">
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('HexaDevices', {title: cardName, deviceId: device.id })
                    }
                    activeOpacity={0.8}
                    className="bg-white rounded-xl shadow-xl pb-3">

                    {/* X Button to Remove Card */}
                    <TouchableOpacity
                      className="absolute -top-2 -right-2 p-1 bg-[#ff8625] rounded-full"
                      onPress={() => handleRemoveDevice(device.id)}>
                      <FontAwesomeIcon icon={faXmark} size={15} color="#fff" />
                    </TouchableOpacity>

                    {/* Editable Card Name */}
                      <TextInput
                        className="font-bold text-xl text-blue-900 mx-3 pt-2"
                        numberOfLines={1}
                        defaultValue={cardName}
                        onChangeText={text =>
                          handleUpdateCardName(device.id, text)
                        }
                      />

                    {/* Switches */}
                    {device.switches.map((sw, idx) => (
                      <TouchableOpacity
                        key={`${device.id}-switch-${idx}`}
                        className="flex-row items-center mt-2 px-4 pb-2"
                        onPress={() => handleToggleSwitch(device.id, idx)}>
                        <FontAwesomeIcon
                          icon={sw ? faToggleOn : faToggleOff}
                          size={24}
                          color={sw ? '#10B981' : '#ff8625'}
                        />
                        <Text className="ml-3 text-blue-900 text-lg">
                          Switch {idx + 1}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>
      )}

      {/* Manual Switches Section */}
      <View className="my-8">
        <Text className="text-2xl font-bold text-[#1a365d] mb-6">
          Manual Setup
        </Text>
        {manualSwitches.map(switchItem => (
          <Animated.View
            key={switchItem.id}
            entering={ZoomIn.delay(100)}
            className="mb-4">
            <TouchableOpacity
              className="bg-white rounded-2xl p-5 shadow-xl flex-row justify-between items-center"
              onPress={() => handleAddManualSwitch(switchItem)}
              activeOpacity={0.8}>
              <View>
                <Text className="text-[#ff8625] font-bold text-lg">
                  {switchItem.type}
                </Text>
                <Text className="text-[#1a365d] mt-1">
                  {switchItem.switches.length} switches •{' '}
                  {switchItem.regulators?.length || 0} regulators
                </Text>
              </View>
              <FontAwesomeIcon icon={faPlus} size={20} color="#84c3e0" />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
