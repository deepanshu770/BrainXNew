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


Ionicons.loadFont();



function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <GestureHandlerRootView>
        <Root/>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}


export default App;
