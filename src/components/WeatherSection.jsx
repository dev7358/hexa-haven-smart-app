import React, {useState, useEffect} from 'react';
import {View, Text, Button, PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faThermometerHalf, faTint} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export function WeatherSection() {
  const [location, setLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location to provide weather updates.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionGranted(true);
        getCurrentLocation();
      } else {
        setPermissionGranted(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
        fetchWeatherData(latitude, longitude);
      },
      error => console.error(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const API_KEY = '60d3edac42903c48e11867d5b0e797f8';
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`,
      );
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      requestLocationPermission();
    }, 1000);
  }, []);

  return (
    <View
      className={`flex-row bg-white rounded-2xl p-6 mb-8 ${
        !permissionGranted ? 'justify-center' : 'justify-between'
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 3,
      }}>
      {!permissionGranted ? (
        <Button title="Allow Permission" onPress={requestLocationPermission} />
      ) : loading ? (
        <>
          <View className="flex flex-row justify-between bg-[--transition-hexa-blue] rounded-2xl p-6 w-full">
            <View className="flex-row items-center gap-2 space-x-2">
              <View className="bg-[--hexa-blue] w-6 h-6 rounded-full" />
              <View className="bg-[--hexa-blue] w-20 h-6 rounded-md" />
            </View>
            <View className="flex-row items-center gap-2 space-x-2">
              <View className="bg-[--hexa-blue] w-6 h-6 rounded-full" />
              <View className="bg-[--hexa-blue] w-20 h-6 rounded-md" />
            </View>
          </View>
        </>
      ) : weatherData ? (
        <>
          <View className="flex-row items-center gap-2 space-x-2">
            <FontAwesomeIcon
              icon={faThermometerHalf}
              size={25}
              color="#ff8625"
            />
            <View>
              <Text className="text-xs text-slate-900">Temperature</Text>
              <Text className="text-gray-800 text-lg font-semibold">
                {weatherData.main.temp}°C
              </Text>
            </View>
          </View>
          <View className="border-r-2 border-gray-400"></View>
          <View className="flex-row items-center gap-2 space-x-2">
            <FontAwesomeIcon icon={faTint} size={25} color="#84c3e0" />
            <View>
              <Text className="text-xs text-slate-900">Humidity</Text>
              <Text className="text-gray-800 text-lg font-semibold">
                {weatherData.main.humidity}%
              </Text>
            </View>
          </View>
        </>
      ) : (
        <Text className="text-gray-800 text-lg font-semibold">
          Error loading weather data
        </Text>
      )}
    </View>
  );
}
