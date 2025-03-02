import React, {useEffect} from 'react';
import {View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, {Circle, Path, Defs, LinearGradient, Stop} from 'react-native-svg';

export default function RadarLoader() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${rotation.value}deg`}],
    };
  });

  return (
    <View className="flex items-center justify-center h-40 w-40 relative">
      <Svg height="150" width="150" viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="rgba(100, 149, 237, 0.8)" />
            <Stop offset="100%" stopColor="rgba(100, 149, 237, 0)" />
          </LinearGradient>
        </Defs>
        <Circle
          cx="50"
          cy="50"
          r="40"
          stroke="#A0C4FF"
          strokeWidth="1"
          fill="transparent"
        />
        <Circle
          cx="50"
          cy="50"
          r="30"
          stroke="#A0C4FF"
          strokeWidth="2"
          fill="transparent"
        />
        <Circle
          cx="50"
          cy="50"
          r="20"
          stroke="#A0C4FF"
          strokeWidth="2"
          fill="transparent"
        />
      </Svg>
      <Animated.View style={[animatedStyle, {position: 'absolute'}]}>
        <Svg height="150" width="150" viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="sweepGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="rgba(100, 149, 237, 0.8)" />
              <Stop offset="100%" stopColor="rgba(100, 149, 237, 0)" />
            </LinearGradient>
          </Defs>
          <Path
            d="M50,50 L90,50 A40,40 0 0,1 50,90 Z"
            fill="url(#sweepGradient)"
            opacity="0.8"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
