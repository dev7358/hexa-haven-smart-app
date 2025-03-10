import {ScrollView} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {GreetingSection} from '../components/GreetingSection';
import {WeatherSection} from '../components/WeatherSection';
import SwitchSection from '../components/SwitchSection';
import {LinearGradient} from 'react-native-linear-gradient';

export default function HexaDashboard() {
  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={['#bedcea', '#ffffff']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={{flex: 1}}>
        <SafeAreaView className="flex-1">
          <GreetingSection />
          <ScrollView className="flex-1 p-6">
            <WeatherSection />
            <SwitchSection />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
