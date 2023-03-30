import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme} from 'styled-components';
// Screens
import Login from './Login';
import Signup from './Signup';
import Welcome from './Welcome';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const theme = useTheme();
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
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        options={{
          title: "S'inscrire",
        }}
        name="Signup"
        component={Signup}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
