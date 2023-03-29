import React, {useEffect, useState} from 'react';
import {AuthProvider} from './src/contexts/authContext';
import {MainRoutes} from './src/config/MainRoutes';
import {ThemeProvider} from 'styled-components';
import {darkTheme, lightTheme} from './src/config/theme';
import notifee, {EventType} from '@notifee/react-native';
import {StatusBar, Text, useColorScheme, View} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {SplashScreen} from './src/screens/Splash';

function App() {
  // TODO: theme context
  const [theme, setTheme] = useState('light');

  const [loading, setLoading] = useState(true);

  // Bootstrap sequence function
  const bootstrap = async () => {
    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification) {
      console.log(
        'Notification caused application to open',
        initialNotification.notification,
      );
      console.log(
        'Press action used to open the app',
        initialNotification.pressAction,
      );
    }
  };

  React.useEffect(() => {
    bootstrap()
      .then(() => setLoading(false))
      .catch(console.error);
    return () => {
      notifee.onForegroundEvent(({type, detail}) => {
        switch (type) {
          case EventType.DISMISSED:
            console.log('User dismissed notification', detail.notification);
            break;
          case EventType.PRESS:
            console.log('User pressed notification', detail.notification);
            break;
        }
      });
    };
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <AuthProvider>
        <StatusBar
          animated={true}
          barStyle={theme === 'light' ? 'light-content' : 'dark-content'}
          backgroundColor={
            theme === 'light' ? lightTheme.statusBar : darkTheme.statusBar
          }
          hidden={false}
        />
        <MainRoutes />
        <FlashMessage position="top" floating />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
