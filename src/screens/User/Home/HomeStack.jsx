import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme} from 'styled-components';
// Screens
import EventList from './EventList';
import EventSingle from './EventSingle';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator initialRouteName="EventList">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="EventList"
        component={EventList}
      />
      <Stack.Screen
        options={({route}) => ({
          title: route.params.title,
          headerStyle: {
            backgroundColor: theme.blue,
          },
          headerTintColor: theme.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
        name="EventSingle"
        component={EventSingle}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
