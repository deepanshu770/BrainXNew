import React, { useEffect, useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoard from '../screens/OnBoard';
import Home from '../screens/Home';
import { KEYS, storage } from '../utils/Storage';
import Player from '../screens/Player';
import { useMMKVBoolean } from 'react-native-mmkv';
import { AudioEngine } from '../services/AudioEngine';

const RootStack = createNativeStackNavigator();
const Root = () => {
  const [oldUser] = useMMKVBoolean(KEYS.OLD_USER, storage);
  console.log("oldUser " +oldUser)
  return (oldUser ?
    <RootStack.Navigator
    
      screenOptions={{
        headerShown: false,
      }}>
      <RootStack.Screen name="Home" component={Home} />
      <RootStack.Screen
        name="Player"
        component={Player}
        options={{
          animation: 'fade_from_bottom',
        }}
      />
    </RootStack.Navigator>
    :
    <OnBoard />
  );
};

export default Root;
