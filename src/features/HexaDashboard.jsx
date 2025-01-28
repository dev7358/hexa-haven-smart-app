import {View, ScrollView} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {SideNav} from '../components/SideNav';
import {GreetingSection} from '../components/GreetingSection';
import {WeatherSection} from '../components/WeatherSection';
import {RoomsSection} from '../components/RoomsSection';

export default function HexaDashboard() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-[#f4f6f7]">
        <GreetingSection />
        <View className="flex-row flex-1">
          <SideNav />
          <ScrollView className="flex-1 p-6">
            <WeatherSection />
            <RoomsSection />
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
