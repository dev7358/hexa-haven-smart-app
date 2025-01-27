import React, {useState, useRef} from 'react';
import {View, Text, TouchableOpacity, Animated} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCog,
  faUtensils,
  faBed,
  faBath,
} from '@fortawesome/free-solid-svg-icons';

export function SideNav() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const animatedValue = useRef(new Animated.Value(-60)).current;

  const rooms = [
    {name: 'Settings', icon: faCog},
    {name: 'Kitchen', icon: faUtensils},
    {name: 'Bedroom', icon: faBed},
    {name: 'Bathroom', icon: faBath},
  ];

  const handlePress = index => {
    setSelectedIndex(index);

    Animated.timing(animatedValue, {
      toValue: -60 + index * 135,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View className="h-screen rounded-tr-[20px] w-15 bg-slate-800">
      <View className="flex items-center gap-y-10 h-4/6 relative">
        <Animated.View
          style={{
            position: 'absolute',
            zIndex: 2,
            top: animatedValue,
            left: 0,
            height: 100,
            width: 6,
            backgroundColor: '#84c3e0',
            borderRadius: 50,
            marginVertical: 60,
          }}
        />

        {rooms.map((room, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(index)}
            className={`w-full flex justify-center items-center gap-y-5 text-sm  pb-5`}
            style={{
              height: 100,
            }}>
            <View className="-rotate-90">
              <FontAwesomeIcon
                icon={room.icon}
                size={20}
                color={index === selectedIndex ? '#84c3e0' : '#fff'}
              />
            </View>
            <Text
              className={`${
                index === selectedIndex
                  ? 'text-[--hexa-blue] font-bold'
                  : 'text-white'
              }  mt-2 -rotate-90 font-mono`}>
              {room.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
