import { View, Text, Button } from 'react-native'
import React, { useState } from 'react'
import notifee, { AndroidNotificationSetting, TimestampTrigger, TriggerType } from '@notifee/react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Notification = () => {
    const [id, setid] = useState('');
    async function onDisplayNotification() {
        // Request permissions (required for iOS)
        await notifee.requestPermission()

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            description:'for all application core notifications'
        });
        setid(channelId);
        // Display a notification
        await notifee.displayNotification({
            title: 'Notification Title',
            body: 'Main body content of the notification',
            android: {
                channelId,
                    timestamp:Date.now()-20000


            }
        });
    }

    async function onCreateTriggerNotification() {
        const settings = await notifee.getNotificationSettings();
        if (settings.android.alarm == AndroidNotificationSetting.ENABLED) {
            //Create timestamp trigger
        } else {
            // Show some user information to educate them on what exact alarm permission is,
            // and why it is necessary for your app functionality, then send them to system preferences:
            await notifee.openAlarmPermissionSettings();
        }
      

        // Create a time-based trigger
        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: Date.now() + 5000,
            alarmManager: {
                allowWhileIdle: true,
            },
        };
 const channelId = await notifee.createChannel({
            id: 'timers',
            name: 'Scheduled',
        });
        setid(channelId);
        // Create a trigger notification
        await notifee.createTriggerNotification(
            {
                title: 'Oye Mote',
                body: 'Pdh be le',

                android: {
                    channelId,
                },

            },
            trigger,
        );
    }
    return (
        <SafeAreaView>
            <Button title="Display Notification" onPress={() => onDisplayNotification()} />
            <Button title="Display Trigger Notification" onPress={() => onCreateTriggerNotification()} />
            <Text style={{color:'black'}}>{id}</Text>
        </SafeAreaView>
    );
}

export default Notification

