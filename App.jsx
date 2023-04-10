import React, {useState} from 'react';
import {AuthProvider} from './src/contexts/authContext';
import {MainRoutes} from './src/config/MainRoutes';
import {ThemeProvider} from 'styled-components';
import {darkTheme, lightTheme} from './src/config/theme';
import notifee, {EventType} from '@notifee/react-native';
import {StatusBar, Appearance} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {SplashScreen} from './src/screens/Splash';
import {Provider, useDispatch} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './src/config/store';
import {useSelector} from 'react-redux';
import {toggleTheme} from './src/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EntryPoint = () => {
  const theme = useSelector(state => state.settings.theme);
  const dispatch = useDispatch();

  const getLocalTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (Appearance.getColorScheme() !== theme && storedTheme === null) {
        dispatch(toggleTheme());
      }
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getLocalTheme();
  });

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <AuthProvider>
        <StatusBar
          animated={true}
          barStyle="light-content"
          backgroundColor={theme === 'light' ? lightTheme.blue : darkTheme.blue}
          hidden={false}
        />
        <MainRoutes />
        <FlashMessage position="top" floating />
      </AuthProvider>
    </ThemeProvider>
  );
};

const App = () => {
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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <EntryPoint />
      </PersistGate>
    </Provider>
  );
};

export default App;
