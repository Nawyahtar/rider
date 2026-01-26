// src/navigation/MainStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screen } from '../constant/Screen';
import BottomTabNavigator from './BottomTabNavigator';
import DetailScreen from '../screens/others/DetailScreen';
import NearByDetailScreen from '../screens/others/NearByDetailScreen';
import ViewOnMapScreen from '../screens/others/ViewOnMapScreen';
import NewDeliveryWayScreen from '../screens/others/NewDeliveryWayScreen';
import OrderViewDetailScreen from '../screens/others/OrderViewDetailScreen';
import DeliveryCompleteScreen from '../screens/others/DeliveryCompleteScreen';
const Stack = createNativeStackNavigator();

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Screen.MainTabs} component={BottomTabNavigator} />
    <Stack.Screen name={Screen.Other.Detail} component={DetailScreen} />
    <Stack.Screen name={Screen.Other.NearByDetial} component={NearByDetailScreen} />
    <Stack.Screen name={Screen.Other.ViewOnMap} component={ViewOnMapScreen} />
    <Stack.Screen name={Screen.Other.NewDeliveryWay} component={NewDeliveryWayScreen} />
    <Stack.Screen name={Screen.Other.OrderDetail} component={OrderViewDetailScreen} />
    <Stack.Screen name={Screen.Other.DeliveryComplete} component={DeliveryCompleteScreen} />
  </Stack.Navigator>
);

export default MainStack;
