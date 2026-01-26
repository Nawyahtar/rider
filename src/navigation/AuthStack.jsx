// src/navigation/AuthStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import CreateAccountScreen from '../screens/auth/CreateAccountScreen';
import VehicleInformationScreen from '../screens/auth/VehicleInformationScreen';
import DocumentScreen from '../screens/auth/DocumentScreen';
import { Screen } from '../constant/Screen';
import ForgetPasswordScreen from '../screens/auth/ForgetPasswordScreen';
import SuccessScreen from '../screens/auth/SuccessScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import AccountLockedScreen from '../screens/auth/AccountLockedScreen';
import CreateNewPasswordScreen from '../screens/auth/CreateNewPasswordScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false,animation:'ios_from_right' }}>
    <Stack.Screen name={Screen.Auth.Login} component={LoginScreen} />
    <Stack.Screen name={Screen.Auth.CreateAccount} component={CreateAccountScreen} />
    <Stack.Screen name={Screen.Auth.VehicleInformation} component={VehicleInformationScreen} />
    <Stack.Screen name={Screen.Auth.Document} component={DocumentScreen} />
    <Stack.Screen name={Screen.Auth.Success} component={SuccessScreen} />
    <Stack.Screen name={Screen.Auth.ForgetPassword} component={ForgetPasswordScreen} />
    <Stack.Screen name={Screen.Auth.ResetPassword} component={ResetPasswordScreen} />
    <Stack.Screen name={Screen.Auth.CreatenewPassword} component={CreateNewPasswordScreen}/>
    <Stack.Screen name={Screen.Auth.AccountLocked} component={AccountLockedScreen} />
  </Stack.Navigator>
);

export default AuthStack;
