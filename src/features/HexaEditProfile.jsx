import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../redux/slices/profileSlice";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEdit, faSave, faCamera } from "@fortawesome/free-solid-svg-icons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";

export default function HexaEditProfile() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  // Animation styles
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const fadeInStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  // Handle text input changes
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Function to handle image selection from Gallery or Camera
  const handleImageUpload = () => {
    Alert.alert("Upload Photo", "Choose an option", [
      { text: "Take Photo", onPress: () => openCamera() },
      { text: "Choose from Gallery", onPress: () => openGallery() },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // Open Camera
  const openCamera = () => {
    launchCamera({ mediaType: "photo", cameraType: "front" }, (response) => {
      if (!response.didCancel && response.assets?.length > 0) {
        setFormData({ ...formData, avatar: response.assets[0].uri });
      }
    });
  };

  // Open Gallery
  const openGallery = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && response.assets?.length > 0) {
        setFormData({ ...formData, avatar: response.assets[0].uri });
      }
    });
  };

  // Save changes to Redux
  const handleSave = () => {
    dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  // Handle button press animation
  const handlePress = () => {
    scale.value = withSpring(0.9, { damping: 5, stiffness: 150 }, () => {
      scale.value = withSpring(1);
    });
    setIsEditing((prev) => !prev);
  };

  return (
    <Animated.View className="p-4" style={fadeInStyle}>
      {/* Profile Picture */}
      <View className="items-center mb-4 relative">
        <Animated.Image
          source={{ uri: formData.avatar }}
          className="w-24 h-24 rounded-full border-2 border-gray-300"
          style={animatedStyle}
          onLoad={() => {
            opacity.value = withTiming(1, { duration: 500 });
          }}
        />
        
        {/* Edit Icon */}
        {isEditing && (
          <TouchableOpacity
            onPress={handleImageUpload}
            className="absolute bottom-0 right-0 bg-gray-200 p-2 rounded-full"
          >
            <FontAwesomeIcon icon={faCamera} size={16} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Fields */}
      {[
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phone" },
        { label: "Date of Birth", key: "dob" },
      ].map(({ label, key }) => (
        <View key={key} className="mb-2">
          <Text className="text-gray-500 font-bold">{label}:</Text>
          {isEditing ? (
            <TextInput
              className="border p-2 rounded-md mt-1"
              numberOfLines={1}
              value={formData[key]}
              onChangeText={(text) => handleChange(key, text)}
            />
          ) : (
            <Text className="text-lg">{formData[key]}</Text>
          )}
        </View>
      ))}

      {/* Edit / Save Button */}
      <TouchableOpacity
        className="mt-4 bg-blue-500 py-2 rounded-md flex-row items-center justify-center"
        onPress={handlePress}
      >
        <Animated.View style={animatedStyle}>
          <FontAwesomeIcon icon={isEditing ? faSave : faEdit} size={20} color="white" className="mr-2" />
        </Animated.View>
        <Text className="text-white font-bold">
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}