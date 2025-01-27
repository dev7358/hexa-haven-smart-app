import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Alert } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faThermometerHalf, faTint } from "@fortawesome/free-solid-svg-icons";
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const WEATHER_API_KEY = "60d3edac42903c48e11867d5b0e797f8";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

export function WeatherSection() {
  const [locationPermission, setLocationPermission] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if location permission is granted
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (permissionStatus === RESULTS.GRANTED) {
        setLocationPermission(true);
        fetchLocation();
      } else {
        setLocationPermission(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const permissionStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (permissionStatus === RESULTS.GRANTED) {
        setLocationPermission(true);
        fetchLocation();
      } else {
        Alert.alert("Location permission is required to fetch weather data.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLocation = () => {
    setLoading(true);

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      (error) => {
        setLoading(false);
        Alert.alert("Error", "Unable to fetch location.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await axios.get(WEATHER_API_URL, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: WEATHER_API_KEY,
          units: "metric",
        },
      });

      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Unable to fetch weather data.");
    }
  };

  if (loading) {
    return (
      <View className="flex-row justify-between bg-white rounded-2xl p-6 mb-8" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 3 }}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  if (locationPermission === false) {
    return (
      <View className="flex-col items-center bg-white rounded-2xl p-6 mb-8" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 3 }}>
        <Text className="text-gray-800 text-lg font-semibold">Location permission is required</Text>
        <Button title="Allow Permission" onPress={requestLocationPermission} />
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View className="flex-row justify-center bg-white rounded-2xl p-6 mb-8" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 3 }}>
        <Text className="text-gray-800 text-lg font-semibold">Unable to fetch weather data</Text>
      </View>
    );
  }

  return (
    <View className="flex-row justify-between bg-white rounded-2xl p-6 mb-8" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 3 }}>
      <View className="flex-row items-center space-x-2">
        <FontAwesomeIcon icon={faThermometerHalf} size={20} color="gray" />
        <Text className="text-gray-800 text-lg font-semibold">{weatherData.main.temp}°C</Text>
      </View>
      <View className="flex-row items-center space-x-2">
        <FontAwesomeIcon icon={faTint} size={20} color="gray" />
        <Text className="text-gray-800 text-lg font-semibold">{weatherData.main.humidity}%</Text>
      </View>
    </View>
  );
}
