import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import styled from 'styled-components/native';
// Stacks
import UserStack from '../screens/User/UserStack';
import AuthStack from '../screens/Auth/AuthStack';
import {useAuth} from '../contexts/authContext';

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

  return (
    <GlobalSafeArea>
      <NavigationContainer theme={theme}>
        {currentUser ? <UserStack /> : <AuthStack />}
      </NavigationContainer>
    </GlobalSafeArea>
  );
};

const GlobalSafeArea = styled.SafeAreaView`
  flex: 1;

  background-color: ${({theme}) => theme.background};
`;
