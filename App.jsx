import HexaDashboard from './src/features/HexaDashboard';
import { Provider } from 'react-redux';
import store from './src/redux/store';
export default function App() {
  return  <Provider store={store}><HexaDashboard /></Provider>;
}
