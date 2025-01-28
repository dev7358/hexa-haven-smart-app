import React from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const AddRoomModal = ({
  isModalVisible,
  setIsModalVisible,
  newRoomName,
  setNewRoomName,
  addRoom,
}) => {
  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-[--transition-hexa-blue]">
        <View className="w-3/4 bg-white rounded-2xl p-6 shadow-lg">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">Add New Room</Text>
            <Pressable
              onPress={() => setIsModalVisible(false)}
              className="p-2 bg-gray-200 rounded-full"
            >
              <FontAwesomeIcon icon={faTimes} size={16} color="#333" />
            </Pressable>
          </View>
          {/* Input Field */}
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            placeholder="Enter room name"
            value={newRoomName}
            onChangeText={setNewRoomName}
          />
          {/* Add Button */}
          <Pressable
            className="py-3 bg-[--hexa-blue] rounded-lg flex items-center justify-center hover:bg-green-600 transition duration-300"
            onPress={addRoom}
          >
            <Text className="text-white font-bold">Add Room</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default AddRoomModal;
