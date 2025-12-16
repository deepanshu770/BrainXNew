/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Root from './src/routes/Root.route';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AudioEngine } from './src/services/AudioEngine';
import BootSplash from 'react-native-bootsplash'


Ionicons.loadFont();



function App(): React.JSX.Element {
  const onReady = () => {
    BootSplash.hide({ fade: true });
    AudioEngine.initialize();
  }
  return (
    <GestureHandlerRootView>
      <NavigationContainer onReady={onReady}>
        <Root />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}


export default App;
