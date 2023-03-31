import React from 'react';
import {useAuth} from '../../../contexts/authContext';
import TextField from '../../../components/Forms/TextField';
import {Button} from '../../../components/Button';
import {UserLayout} from '../../../components/layout/UserLayout';
import styled from 'styled-components';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {error} from '../../../utils/notifications';
import {useDispatch, useSelector} from 'react-redux';
import {toggleTheme} from '../../../actions/theme';
import {useTranslation} from 'react-i18next';
import {RadioButton} from 'react-native-paper';
import {changeLanguage} from '../../../actions/lang';

const Profile = () => {
  const {Logout, currentUser} = useAuth();
  const {i18n} = useTranslation();

  const lang = useSelector(state => state.lang.language);
  const dispatch = useDispatch();

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
      error(err.message);
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
      error(err.message);
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
        <Button variant="red" label="Logout" pressHandler={() => Logout()} />
        <Button
          label="Notify me"
          pressHandler={() =>
            onDisplayNotification(
              'Notification Title',
              'Main body content of the notification',
            )
          }
        />
        <Button
          label="Toggle theme"
          variant="yellow"
          pressHandler={() => dispatch(toggleTheme())}
        />
        <Button
          label="Change language to French"
          variant="black"
          pressHandler={() => i18n.changeLanguage('fr')}
        />

        <Button
          label="Change language to English"
          variant="black"
          pressHandler={() => i18n.changeLanguage('en')}
        />
        <RadioButton.Group
          onValueChange={value => dispatch(changeLanguage(value))}
          value={lang}>
          <RadioButton.Item
            labelStyle={{color: 'black'}}
            color="black"
            uncheckedColor="black"
            label="English"
            value="en"
          />
          <RadioButton.Item
            labelStyle={{color: 'black'}}
            color="black"
            uncheckedColor="black"
            label="French"
            value="fr"
          />
        </RadioButton.Group>
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
