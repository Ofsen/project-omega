import React from 'react';
import {Text} from 'react-native-paper';
import styled from 'styled-components';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import Lottie from 'lottie-react-native';
import animation from '../assets/animations/splash.json';

const Stack = createNativeStackNavigator();

export const SplashScreen = () => {
  return (
    <Container>
      <StatusBar hidden />
      <Lottie source={animation} autoPlay loop />
    </Container>
  );
};

const SplashStack = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="SplashScreen"
        component={SplashScreen}
      />
    </Stack.Navigator>
  );
};
export default SplashStack;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`;
