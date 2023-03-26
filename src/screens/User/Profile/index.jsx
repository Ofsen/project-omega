import React from 'react';
import {useAuth} from '../../../contexts/authContext';
import TextField from '../../../components/Forms/TextField';
import {Button} from '../../../components/Button';
import {UserLayout} from '../../../components/layout/UserLayout';
import styled from 'styled-components';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const Profile = () => {
  const {Logout, currentUser} = useAuth();

  const initNotification = async () => {
    try {
      // Register the device with FCM
      await messaging().registerDeviceForRemoteMessages();

      // Get the token
      const token = await messaging().getToken();

      // Save the token
      await AsyncStorage.setItem('fcm_token', JSON.stringify(token));

      // required for iOS
      await notifee.requestPermission();

      // required for Android
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  React.useEffect(() => {
    initNotification();
  }, []);

  const onDisplayNotification = async (title, body) => {
    try {
      // Display a notification
      await notifee.displayNotification({
        title: title,
        body: body,
        android: {
          channelId: 'default',
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  messaging().onMessage(remoteMessage =>
    onDisplayNotification(
      remoteMessage.notification.title,
      remoteMessage.notification.body,
    ),
  );
  messaging().setBackgroundMessageHandler(remoteMessage =>
    onDisplayNotification(
      remoteMessage.notification.title,
      remoteMessage.notification.body,
    ),
  );

  return (
    <UserLayout title="Profile">
      <ContentContainer>
        <TextField label="Email" value={currentUser.email} disabled />
        <Button variant="tint" label="Logout" pressHandler={() => Logout()} />
        <Button
          label="Notify me"
          pressHandler={() =>
            onDisplayNotification(
              'Notification Title',
              'Main body content of the notification',
            )
          }
        />
      </ContentContainer>
    </UserLayout>
  );
};

export default Profile;

const ContentContainer = styled.View`
  flex: 1;
  padding: 0 16px;
  gap: 16px;
`;
