import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme} from 'styled-components';
// Screens
import Login from './Login';
import Signup from './Signup';
import Welcome from './Welcome';
import {useTranslation} from 'react-i18next';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const theme = useTheme();
  const {t} = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.blue,
        },
        headerTintColor: theme.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      initialRouteName="Welcome">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Welcome"
        component={Welcome}
      />
      <Stack.Screen
        options={{
          title: t('misc.login'),
        }}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        options={{
          title: t('misc.register'),
        }}
        name="Signup"
        component={Signup}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
