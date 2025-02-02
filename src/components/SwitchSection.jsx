import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faToggleOn,faTrash, faToggleOff, faEdit } from '@fortawesome/free-solid-svg-icons';
import { addDevice, removeDevice, updateDevice, updateCardName } from '../redux/slices/switchSlice';
import DeviceDetectorLoader from './DeviceDetectorLoader';
import Animated, { FadeIn, SlideInRight, ZoomIn } from 'react-native-reanimated';

export default function SwitchSection() {
  const dispatch = useDispatch();
  const activeDevices = useSelector((state) => state.switches.activeDevices);
  const cardNames = useSelector((state) => state.switches.cardNames);
  const [isRotating, setIsRotating] = useState(false);
  const [manualSwitches] = useState([
    { id: 1, type: '3-channel', switches: [false, false, false], regulators: [0] },
    { id: 2, type: '5-channel', switches: [false, false, false], regulators: [0, 0] },
  ]);


  const handleAddChannel = () => {
    setIsRotating(true);
  };

  const handleAddManualSwitch = (switchItem) => {
    dispatch(addDevice(switchItem));
  };

  const handleRemoveDevice = (deviceId) => {
    dispatch(removeDevice(deviceId));
  };

  const handleToggleSwitch = (deviceId, switchIndex) => {
    const updatedDevices = activeDevices.map((device) =>
      device.id === deviceId
        ? {
            ...device,
            switches: device.switches.map((sw, idx) =>
              idx === switchIndex ? !sw : sw
            ),
          }
        : device
    );
    dispatch(updateDevice({ id: deviceId, switches: updatedDevices.find((d) => d.id === deviceId).switches }));
  };

  const handleUpdateCardName = (deviceId, name) => {
    dispatch(updateCardName({ id: deviceId, name }));
  };

  return (
    <View>
      {/* Add Channel Button */}
      <Animated.View entering={FadeIn.duration(400)}>
        <TouchableOpacity
          className="bg-[#ff8625] p-4 rounded-2xl items-center shadow-xl flex-row justify-center space-x-3"
          onPress={handleAddChannel}
          activeOpacity={0.8}
        >
          <FontAwesomeIcon icon={faPlus} size={20} color="white" />
          <Text className="text-white font-bold text-lg">Add Channel</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Device Detector Loader */}
      {isRotating && (
        <Animated.View entering={FadeIn} className="mt-8 items-center">
          <Text className="text-lg font-bold text-[#1a365d] mb-4">Scanning for Devices...</Text>
          <DeviceDetectorLoader />
        </Animated.View>
      )}

      {/* Active Devices Grid */}
      {activeDevices.length > 0 && (
        <View className="mt-8">
          <Text className="text-2xl font-bold text-[#1a365d] mb-6">Active Devices</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {activeDevices.map((device) => {
              const cardName = cardNames.find((card) => card.id === device.id)?.name || `Switch ${device.id}`;
              return (
                <Animated.View
                  key={device.id}
                  entering={SlideInRight.delay(200)}
                  className="bg-white rounded-2xl p-5 m-2 shadow-xl w-72"
                >
                   {/* X Button to Remove Card */}
                   <TouchableOpacity
                    className="absolute top-2 right-2 p-2"
                    onPress={() => handleRemoveDevice(device.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} size={20} color="red" />
                  </TouchableOpacity>

                  {/* Editable Card Name */}
                  <View className="flex-row items-center space-x-2 mb-4">
                    <FontAwesomeIcon icon={faEdit} size={16} color="#3B82F6" />
                    <TextInput
                      className="font-bold text-xl text-blue-900 flex-1"
                      defaultValue={cardName}
                      onChangeText={(text) => handleUpdateCardName(device.id, text)}
                      placeholder="Enter Name"
                    />
                  </View>

                  {/* Switches */}
                  {device.switches.map((sw, idx) => (
                    <TouchableOpacity
                      key={`${device.id}-switch-${idx}`}
                      className="flex-row items-center mt-3"
                      onPress={() => handleToggleSwitch(device.id, idx)}
                    >
                      <FontAwesomeIcon
                        icon={sw ? faToggleOn : faToggleOff}
                        size={24}
                        color={sw ? '#10B981' : '#EF4444'}
                      />
                      <Text className="ml-3 text-blue-900 text-lg">Switch {idx + 1}</Text>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Manual Switches Section */}
      <View className="mt-8">
        <Text className="text-2xl font-bold text-[#1a365d] mb-6">Manual Setup</Text>
        {manualSwitches.map((switchItem) => (
          <Animated.View
            key={switchItem.id}
            entering={ZoomIn.delay(100)}
            className="mb-4"
          >
            <TouchableOpacity
              className="bg-white rounded-2xl p-5 shadow-xl flex-row justify-between items-center"
              onPress={() => handleAddManualSwitch(switchItem)}
              activeOpacity={0.8}
            >
              <View>
                <Text className="text-[#ff8625] font-bold text-lg">{switchItem.type}</Text>
                <Text className="text-[#1a365d] mt-1">
                  {switchItem.switches.length} switches • {switchItem.regulators?.length || 0} regulators
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