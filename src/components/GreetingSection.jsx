import {View, Text, Image} from 'react-native';

export function GreetingSection() {
  return (
    <>
      <View className="m-3 flex-row justify-between items-center">
        <Image
          source={require('../assets/hexa-haven-logo.png')}
          className="w-1/3 h-full"
        />

        <Image
          source={require('../assets/dummy-login.png')}
          className="w-12 h-12 rounded-full border-2 border-gray-300"
        />
      </View>
      <View className="m-4 mt-0 mb-8">
        <Text className="text-3xl font-extrabold text-gray-800 font-mono">
          Good morning,
        </Text>
        <Text className="text-2xl text-orange-500">Evan</Text>
      </View>
    </>
  );
}
