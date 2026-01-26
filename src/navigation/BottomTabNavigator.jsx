// src/navigation/BottomTabNavigator.jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Bike, Map, Bell, CircleUser } from 'lucide-react-native'; // ✅ Lucide icons

import HomeScreen from '../screens/bottomTab/HomeScreen';
import NearByScreen from '../screens/bottomTab/NearByScreen';
import RideScreen from '../screens/bottomTab/RideScreen';
import NotificationScreen from '../screens/bottomTab/NotificationScreen';
import AccountScreen from '../screens/bottomTab/AccountScreen';
import { Screen } from '../constant/Screen';
import Colors from '../styles/Color';
import { StatusBar } from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 8,
        },
        tabBarActiveTintColor: Colors.text,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarIcon: ({ focused, color }) => {
          const size = 22;
          const iconProps = {
            color,
            size,
            strokeWidth: focused ? 2.5 : 1.5,
          };

          switch (route.name) {
            case Screen.BottomTab.Home:
              return <Home {...iconProps} />;
            case Screen.BottomTab.Ride:
              return <Bike {...iconProps} />;
            case Screen.BottomTab.NearyBy:
              return <Map {...iconProps} />;
            case Screen.BottomTab.Notification:
              return <Bell {...iconProps} />;
            case Screen.BottomTab.Account:
              return <CircleUser {...iconProps} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name={Screen.BottomTab.Home} component={HomeScreen} />
      <Tab.Screen name={Screen.BottomTab.NearyBy} component={NearByScreen} />
      <Tab.Screen name={Screen.BottomTab.Ride} component={RideScreen} />
      <Tab.Screen
        name={Screen.BottomTab.Notification}
        component={NotificationScreen}
      />
      <Tab.Screen name={Screen.BottomTab.Account} component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
