import React, {useState} from 'react';
import {View, Text, Pressable, Animated} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCouch, faUtensils, faBath, faDoorClosed ,
  faPlus,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import AddRoomModal from './AddRoomModal';

export function RoomsSection() {
  const [controls, setControls] = useState([
    { id: 1, label: "Hall", icon: faCouch },
    { id: 2, label: "Kitchen", icon: faUtensils },
    { id: 3, label: "Dining", icon: faDoorClosed },
    { id: 4, label: "Bathroom", icon: faBath },
  ]);
  const [animations, setAnimations] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  // Function to add a new room
  const addRoom = () => {
    if (newRoomName.trim() === '') {
      alert('Please enter a valid room name!');
      return;
    }
    const newRoom = {
      id: controls.length + 1,
      label: newRoomName,
      icon: faDoorClosed,
    };
    setControls([...controls, newRoom]);
    setNewRoomName('');
    setIsModalVisible(false);
  };

  // Function to remove a card with "blast effect"
  const removeCard = id => {
    const animation = new Animated.Value(1);
    setAnimations(prev => ({...prev, [id]: animation}));

    Animated.timing(animation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setControls(prevControls =>
        prevControls.filter(control => control.id !== id),
      );
      setAnimations(prev => {
        const updatedAnimations = {...prev};
        delete updatedAnimations[id];
        return updatedAnimations;
      });
    });
  };

  return (
    <View className="flex-1 p-4">
      {controls.length > 0 ? (
        // Dynamic Grid when there are controls
        <View className="flex flex-row flex-wrap gap-3">
          {controls.map((control, index) => {
            const animation = animations[control.id] || new Animated.Value(1);
            return (
              <Animated.View
                key={control.id}
                style={{
                  opacity: animation,
                  transform: [{scale: animation}],
                }}
                className={`bg-[--hexa-blue] rounded-2xl w-[48%] h-40 flex items-center justify-around shadow-lg relative`}>
                {/* Remove Button */}
                <Pressable
                  className="absolute top-2 right-2 p-1"
                  onPress={() => removeCard(control.id)}>
                  <FontAwesomeIcon icon={faTimes} size={15} color="#ffffff" />
                </Pressable>
                {/* Icon and Label */}
                <FontAwesomeIcon
                  icon={control.icon}
                  size={32}
                  color="#ffffff"
                />
                <Text className="text-white text-base font-bold mt-2">
                  {control.label}
                </Text>
              </Animated.View>
            );
          })}
        </View>
      ) : (
        // Message when there are no controls
        <View className="flex items-center justify-center flex-1">
          <Text className="text-gray-500 text-lg font-bold text-center">
            No rooms available! 🏠{'\n'}Add some rooms to get started.
          </Text>
        </View>
      )}

      {/* Add Room Button */}
      <Pressable
        onPress={() => setIsModalVisible(true)}
        className="my-6 py-3 px-6 border-2 border-[--hexa-blue] rounded-xl flex items-center justify-center hover:bg-blue-500 transition duration-300">
        <FontAwesomeIcon icon={faPlus} size={20} color="#84c3e0" />
        <Text className="text-[--hexa-blue] font-bold ml-2">Add Room</Text>
      </Pressable>

      {/* Add Room Modal */}
      <AddRoomModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        newRoomName={newRoomName}
        setNewRoomName={setNewRoomName}
        addRoom={addRoom}
      />
    </View>
  );
}
