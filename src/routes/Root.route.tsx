import React, {useMemo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnBoard from '../screens/OnBoard';
import Home from '../screens/Home';
import {KEYS, storage} from '../utils/Storage';
import Player from '../screens/Player';
import SharedTransitionScreen from '../screens/SharedTransitionScreen';

const RootStack = createNativeStackNavigator();
const Root = () => {
  const newUser = false;
  //  useMemo(() => {
  //     return storage.getBoolean(KEYS.NEW_USER);
  // }, [])
  return newUser ? (
    <Home />
  ) : (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <RootStack.Screen name="Onboard" component={OnBoard} />
      <RootStack.Screen name="Home" component={Home} />
      <RootStack.Screen name="Player" component={Player} />
      <RootStack.Screen
        name="SharedTransition"
        component={SharedTransitionScreen}
        options={{
          animation: 'fade',
          presentation: 'transparentModal',
        }}
      />
    </RootStack.Navigator>
  );
};

export default Root;
