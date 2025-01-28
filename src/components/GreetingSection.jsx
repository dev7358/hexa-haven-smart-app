import {View, Text, Image} from 'react-native';

export function GreetingSection() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Noon";
    if (hour >= 17 && hour < 20) return "Good Evening";
    return "Good Night";
  };
  return (
    <>
      <View className="m-3 flex-row justify-between items-center">
        <Image
          source={require('../assets/images/hexa-haven-logo.png')}
          className="w-1/3 h-full"
        />

        <Image
          source={require('../assets/images/dummy-login.png')}
          className="w-12 h-12 rounded-full border-2 border-gray-300"
        />
      </View>
      <View className="m-4 mt-0 mb-8">
        <Text className="text-3xl font-extrabold text-gray-800 font-mono">
          {getGreeting()},
        </Text>
        <Text className="text-2xl text-[#ff8625]">Evan</Text>
      </View>
    </>
  );
}
