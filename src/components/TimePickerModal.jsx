import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faClock, faTimes} from '@fortawesome/free-solid-svg-icons';

export default function TimePickerModal({visible, onClose, onSchedule}) {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [amPm, setAmPm] = useState('AM');

  const handleNumericInput = (text, setter) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    setter(cleanedText);
  };

  const handleSchedule = () => {
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
      onSchedule(Math.floor(timeout / 1000));
      onClose();
    } else {
      Alert.alert('Invalid Time', 'The scheduled time must be in the future.');
    }
  };

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-[--transition-hexa-blue]">
        <View className="bg-white p-4 rounded-xl w-80">
          <View className="flex-row justify-between items-center mb-4">
            <View className="items-center flex-row">
              <FontAwesomeIcon icon={faClock} size={20} />
              <Text className="text-lg font-semibold text-gray-800 ml-3">
                Schedule Off
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <FontAwesomeIcon icon={faTimes} size={20} color="#4A5568" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between mb-4">
            <TextInput
              className="flex-1 border border-gray-200 rounded-lg p-2 mr-2 text-center text-gray-800"
              placeholder="HH"
              keyboardType="numeric"
              value={hours}
              onChangeText={text => handleNumericInput(text, setHours)}
              maxLength={2}
              placeholderTextColor="#DDD"
            />
            <TextInput
              className="flex-1 border border-gray-200 rounded-lg p-2 mx-2 text-center text-gray-800"
              placeholder="MM"
              keyboardType="numeric"
              value={minutes}
              onChangeText={text => handleNumericInput(text, setMinutes)}
              maxLength={2}
              placeholderTextColor="#DDD"
            />
            <TouchableOpacity
              className="bg-[#84c3e0] p-2 rounded-lg justify-center"
              onPress={() => setAmPm(prev => (prev === 'AM' ? 'PM' : 'AM'))}>
              <Text className="text-white font-semibold">{amPm}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="bg-[#84c3e0] p-3 rounded-lg items-center"
            onPress={handleSchedule}>
            <Text className="text-white font-semibold">Start Scheduling</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
