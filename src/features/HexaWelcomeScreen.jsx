import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {clearUser} from '../redux/slices/authSlice';

export default function WelcomeScreen({navigation}) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(100);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleLogout = () => {
    dispatch(clearUser());
    navigation.navigate('HexaLoginScreen');
  };

  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      className="flex-1 justify-center items-center p-6">
      <Animated.View
        style={{opacity: fadeAnim, transform: [{translateY: slideAnim}]}}>
        <Image
          source={require('../assets/images/hexa-haven-logo.png')}
          className="mb-8"
        />
        <Text className="text-3xl font-bold mb-2 text-white">
          Welcome, {user?.fullName}!
        </Text>
        <Text className="text-lg text-white mb-8 text-center">
          We're glad to have you here. Start exploring and make the most out of
          our services.
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white py-3 px-6 rounded-lg shadow-md">
          <Text className="text-blue-600 text-lg font-semibold">Log In</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}
