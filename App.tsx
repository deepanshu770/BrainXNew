
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Root from './src/routes/Root.route';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AudioEngine } from './src/services/AudioEngine';
import BootSplash from 'react-native-bootsplash'
import { useEffect } from 'react';


Ionicons.loadFont();

function App(): React.JSX.Element {
 
  useEffect(()=>{
     BootSplash.hide({ fade: true })
      .then(() => console.log("BootSplash hidden"))
      .catch((e) => console.error("BootSplash hide error", e))
      .finally(() => {
        AudioEngine.initialize();
      });
  },[])
  
  return (
    <NavigationContainer >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Root />
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}


export default App;
