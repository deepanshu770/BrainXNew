import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OnBoard from '../screens/OnBoard';


const RootStack = createNativeStackNavigator();
const Root = () => {

    return (
        <RootStack.Navigator>
            <RootStack.Screen options={{ headerShown: false }} name='Onboard' component={OnBoard} />
        </RootStack.Navigator>
    )
}

export default Root