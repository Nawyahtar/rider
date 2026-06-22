import React, {
  useEffect,
  useReducer,
  useMemo,
  useState,
  useContext,
  useRef,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

import SplashScreen from './src/screens/others/SplashScreen';
import GetStartedScreen from './src/screens/auth/GetStartedScreen';
import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';
import { AuthContext } from './src/context/AuthContext';
import { setAuthStore } from './src/api/axiosInstance';
import { RegisterProvider } from './src/context/RegisterContext';
import { OrderProvider, OrderContext } from './src/context/OrderContext';
import CurrentOrderBar from './src/components/modals/CurrentOrderBar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Screen } from './src/constant/Screen';
import { LanguageProvider } from './src/context/LanguageContext';
import { translations } from './src/localization/translations';

const initialState = {
  isLoading: true,
  userToken: null,
};

const authReducer = (prevState, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return { ...prevState, userToken: action.token, isLoading: false };
    case 'SIGN_IN':
      return { ...prevState, userToken: action.token };
    case 'SIGN_OUT':
      return { ...prevState, userToken: null };
    default:
      return prevState;
  }
};

export default function App() {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [showGetStarted, setShowGetStarted] = useState(true);
  const [currentRouteName, setCurrentRouteName] = useState('');
  const navigationRef = useRef();

  const requestLocationPermission = async () => {
    const savedLanguage = await AsyncStorage.getItem('appLanguage');
    const localizedText = translations[savedLanguage] ?? translations.en;

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: localizedText.dialogs.locationPermissionTitle,
            message: localizedText.dialogs.locationPermissionMessage,
            buttonNeutral: localizedText.dialogs.askLater,
            buttonNegative: localizedText.common.cancel,
            buttonPositive: localizedText.common.ok,
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            localizedText.common.permissionDenied,
            localizedText.dialogs.locationPermissionDenied
          );
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      Geolocation.requestAuthorization(); // iOS permission prompt
    }
  };

  const authContext = useMemo(
    () => ({
      signIn: async () => {
        const token = 'demo-auth-token';
        await AsyncStorage.setItem('userToken', token);
        dispatch({ type: 'SIGN_IN', token });

        await requestLocationPermission();

      },
      signOut: async () => {
        await AsyncStorage.removeItem('userToken');
        dispatch({ type: 'SIGN_OUT' });
      },
      userToken: state.userToken,
    }),
    [state.userToken],
  );

  useEffect(() => {
    setAuthStore(authContext);
  }, [authContext]);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        dispatch({ type: 'RESTORE_TOKEN', token });
      } catch (e) {
        dispatch({ type: 'RESTORE_TOKEN', token: null });
      }
    };

    bootstrapAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <AuthContext.Provider value={authContext}>
          <OrderProvider>
            <NavigationContainer
              ref={navigationRef}
              onReady={() =>
                setCurrentRouteName(navigationRef.current.getCurrentRoute().name)
              }
              onStateChange={() => {
                const currentRoute = navigationRef.current.getCurrentRoute();
                setCurrentRouteName(currentRoute.name);
              }}
            >
              <AppWithOverlay
                isLoading={state.isLoading}
                showGetStarted={showGetStarted}
                userToken={state.userToken}
                currentRouteName={currentRouteName}
                onContinue={async () => {
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  setShowGetStarted(false);
                }}
              />
            </NavigationContainer>
          </OrderProvider>
        </AuthContext.Provider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}

const AppWithOverlay = ({
  isLoading,
  showGetStarted,
  userToken,
  onContinue,
  currentRouteName,
}) => {
  const { currentOrder } = useContext(OrderContext);

  const isBottomTabScreen = [
    Screen.BottomTab.Home,
    Screen.BottomTab.NearyBy,
    Screen.BottomTab.Ride,
    Screen.BottomTab.Notification,
    Screen.BottomTab.Account,
  ].includes(currentRouteName);

  if (isLoading) return <SplashScreen />;
  if (showGetStarted) return <GetStartedScreen onContinue={onContinue} />;

  return (
    <View style={{ flex: 1 }}>
      {userToken ? (
        <>
          <MainStack />

          {currentOrder && isBottomTabScreen && (
            <View style={styles.overlayWrapper} pointerEvents="box-none">
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => { }}
                style={styles.touchBlockMain}
              />
              <View style={styles.currentOrderBar}>
                <CurrentOrderBar />
              </View>
            </View>
          )}
        </>
      ) : (
        <RegisterProvider>
          <AuthStack />
        </RegisterProvider>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlayWrapper: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    marginBottom: 70,
  },
  touchBlockMain: {
    flex: 1,
  },
  currentOrderBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingBottom: 8,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
});
