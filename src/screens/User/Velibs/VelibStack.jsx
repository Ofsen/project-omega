import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme} from 'styled-components';
// Screens
import VelibList from './VelibList';
import VelibMap from './VelibMap';

const Stack = createNativeStackNavigator();

export default function VelibStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator initialRouteName="VelibList">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="VelibList"
        component={VelibList}
      />
      <Stack.Screen
        options={({route}) => ({
          title: route.params.fields.name,
          headerStyle: {
            backgroundColor: theme.blue,
          },
          headerTintColor: theme.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
        name="VelibMap"
        component={VelibMap}
      />
    </Stack.Navigator>
  );
}
