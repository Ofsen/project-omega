import React, {useEffect, useState} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import styled from 'styled-components/native';
// Stacks
import UserStack from '../screens/User/UserStack';
import AuthStack from '../screens/Auth/AuthStack';
import {useAuth} from '../contexts/authContext';
import SplashStack from '../screens/Splash';

// removing the background color from the navigation container
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export const MainRoutes = () => {
  const {currentUser} = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <GlobalSafeArea>
      <NavigationContainer theme={theme}>
        {loading ? (
          <SplashStack />
        ) : currentUser ? (
          <UserStack />
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </GlobalSafeArea>
  );
};

const GlobalSafeArea = styled.SafeAreaView`
  flex: 1;

  background-color: ${({theme}) => theme.background};
`;
