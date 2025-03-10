import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import {Picker} from '@react-native-picker/picker';

export default function DelayTimerModal({visible, onClose, onSelectDelay}) {
  const [selectedDelay, setSelectedDelay] = useState(30);

  const delays = [
    {label: '30 Seconds', value: 30},
    {label: '60 Seconds', value: 60},
    {label: '90 Seconds', value: 90},
  ];

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View className="flex-1 justify-center items-center bg-[--transition-hexa-blue]">
        <View className="w-[80%] bg-white rounded-2xl p-5 shadow-lg">
          <Text className="text-xl font-bold text-gray-800 text-center mb-5">
            Select Delay Time
          </Text>
          <View className="border border-blue-300 rounded-xl overflow-hidden mb-5">
            <Picker
              selectedValue={selectedDelay}
              onValueChange={value => setSelectedDelay(value)}
              className="w-full bg-gray-100"
              dropdownIconColor="#84c3e0"
              mode="dropdown">
              {delays.map((delay, index) => (
                <Picker.Item
                  key={index}
                  label={delay.label}
                  value={delay.value}
                  className="text-base text-gray-800"
                />
              ))}
            </Picker>
          </View>
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-gray-200 py-3 rounded-xl mr-2 items-center">
              <Text className="text-base font-bold text-gray-800">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onSelectDelay(selectedDelay)}
              className="flex-1 bg-[#84c3e0] py-3 rounded-xl items-center">
              <Text className="text-base font-bold text-white">Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
