import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-paper';
import styled from 'styled-components';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import Lottie from 'lottie-react-native';
import animation from '../assets/animations/splash.json';
import TrackPlayer from 'react-native-track-player';

const Stack = createNativeStackNavigator();

export const SplashScreen = () => {

  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect( () => {
    const setupPlayer = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add({
      id:'1',
      url: require('../assets/sound/sound.mp3'),
      title: 'Born'
      });
    TrackPlayer.play();
    setIsPlayerReady(true);
  };
  if(!isPlayerReady)
  setupPlayer();
}, []);
  
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
