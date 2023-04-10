import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icons from 'react-native-vector-icons/Ionicons';
import {useTheme} from 'styled-components';
import {Provider as PaperProvider} from 'react-native-paper';
// Screens
import Profile from './Profile';
import HomeStack from './Home/HomeStack';
import Favorites from './Favorites';
import {useTranslation} from 'react-i18next';
import Velibs from './Velibs';

const Tab = createMaterialBottomTabNavigator();

const UserStack = () => {
  const theme = useTheme();
  const {t} = useTranslation();

  return (
    <PaperProvider
      theme={{
        colors: {
          secondaryContainer: 'transparent',
        },
      }}>
      <Tab.Navigator
        shifting={true}
        inactiveColor={theme.background}
        activeColor={theme.background}
        safeAreaInsets={{bottom: -10}}
        barStyle={{
          backgroundColor: theme.blue,
        }}
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Velib':
                iconName = focused ? 'bicycle' : 'bicycle-outline';
                break;
              case 'Favorites':
                iconName = focused ? 'ios-heart' : 'ios-heart-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
              default:
                break;
            }

            return <Icons name={iconName} size={24} color={color} />;
          },
          headerShown: false,
          tabBarShowLabel: false,
        })}>
        <Tab.Screen
          options={{
            tabBarLabel: t('screen.events.eventsTitle'),
          }}
          name="Home"
          component={HomeStack}
        />
        <Tab.Screen name="Velib" component={Velibs} />
        <Tab.Screen
          options={{
            tabBarLabel: t('misc.favorites'),
          }}
          name="Favorites"
          component={Favorites}
        />
        <Tab.Screen
          options={{
            tabBarLabel: t('misc.profile'),
          }}
          name="Profile"
          component={Profile}
        />
      </Tab.Navigator>
    </PaperProvider>
  );
};

export default UserStack;
