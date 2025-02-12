import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, Text, View, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import LinearGradient from "react-native-linear-gradient";
import * as Components from "../imports/imports";
import Animated, { SlideInUp } from "react-native-reanimated";

const Stack = createNativeStackNavigator();

const CustomBackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }}
      className="py-1"
    >
        <FontAwesomeIcon icon={faChevronLeft} size={22} color="#fff" />
    </TouchableOpacity>
  );
};

const CustomHeader = ({ title, showBackButton }) => {
  return (
    <>
      <StatusBar backgroundColor="#84c3e0" barStyle="light-content" />
      <LinearGradient
        colors={["#84c3e0", "#bedcea"]}
        style={{borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50}}
        className="h-[70px] flex-row items-start px-5 pb-10 pt-4"
      >
        {showBackButton && (
            <CustomBackButton />
        )}
        <Animated.View entering={SlideInUp.delay(150)} className="flex-1">
        <Text className="text-white text-2xl font-bold text-center">
          {title}
        </Text>
        </Animated.View>
      </LinearGradient>
    </>
  );
};

export default function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "transparent",
          elevation: 0,
          shadowOpacity: 0,
          height: 70,
        },
        headerTitleAlign: "center",
        animation: "slide_from_right",
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
    {/* Create route here */}
      <Stack.Screen
        name="HexaDashboard"
        component={Components.HexaDashboard}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="HexaDevices"
        component={Components.HexaDevices}
        options={({ route }) => ({
          header: () => (
            <CustomHeader title={route.params?.title || route.name} showBackButton={true}  />
          ),
        })}
        initialParams={{ deviceId: null }}
      />
    </Stack.Navigator>
  );
}
