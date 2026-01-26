// src/screens/auth/SuccessScreen.jsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import { Screen } from '../../constant/Screen';

const { height } = Dimensions.get('window');

const SuccessScreen = ({ navigation, route }) => {
  const {
    screenTitle = 'Success',
    title = 'Success!',
    message = 'Operation completed successfully.',
    buttonText = 'Continue',
    animation = require('../../assets/animation/success.json'),
    redirectTo = Screen.Auth.Login, 
  } = route.params || {};

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  const onContinue = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: redirectTo }],
    });
  };

  return (
    <BaseContainer>
      <HeaderTitleComponent title={screenTitle} showBackIcon={false} />

      <View style={styles.container}>
        <LottieView
          source={animation}
          autoPlay
          loop={false}
          style={styles.animation}
        />

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.message}>{message}</Text>

        <View style={styles.footer}>
          <ButtonComponent title={buttonText} onPress={onContinue} />
        </View>
      </View>
    </BaseContainer>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    marginHorizontal: 10,
    lineHeight: 22,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    paddingBottom: 30,
  },
});
