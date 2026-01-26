import React, { memo } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import welcome from '../../assets/images/welcomeShake.png';
import Colors from '../../styles/Color';
import ButtonComponent from '../buttons/ButtonComponent';

const WelcomeModal = ({ userName = 'John Doe', onApply }) => {
  return (
    <View style={styles.container}>
      <Image source={welcome} style={styles.image} resizeMode="contain" />
      <Text style={styles.helloText}>Hello, Mr. {userName}</Text>
      <Text style={styles.welcomeText}>You’re warmly welcome!</Text>
      <Text style={styles.subText}>
        Firstly, please apply the restaurants and {'\n'} shops nearby so that
        you can start{'\n'} delivering the orders.
      </Text>
      <ButtonComponent
        title="Apply Now"
        onPress={onApply}
        contentContainer={styles.button}
      />
    </View>
  );
};

export default memo(WelcomeModal);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 80,
    height: 70,
    marginBottom: 20,
  },
  helloText: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.subtleText,
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.secondaryText,
    marginBottom: 12,
  },
  subText: {
    fontSize: 10,
    fontWeight: '400',
    color: Colors.subtleText,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
});
