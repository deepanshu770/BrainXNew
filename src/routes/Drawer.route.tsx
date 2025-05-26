import { View, Text } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Root from './Root.route';
import DeviceInfo from '../screens/DeviceInfo';
import Notification from '../screens/Notification';
import Audio from '../screens/Audio';
// import Login from '../screens/Login';

const Drawer = createDrawerNavigator();
const DrawerRoute = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name='ROOT' component={Root} options={{title:'App'}} />
      <Drawer.Screen name='DEVICE_INFO' component={DeviceInfo} options={{title:'Device Infomation'}}/>
      <Drawer.Screen name='NOTIFICATIONS' component={Notification} options={{title:'Notification'}} />
      <Drawer.Screen name='AUDIO' component={Audio} options={{title:'Audio'}} />
 
    </Drawer.Navigator>
  )
}

export default DrawerRoute