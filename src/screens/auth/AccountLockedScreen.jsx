import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import { Screen } from '../../constant/Screen';

const AccountLockedScreen = ({ navigation }) => {
  const handleRetry = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: Screen.Auth.Login }],
    });
  };
  return (
    <BaseContainer>
      <HeaderTitleComponent title="Account locked" navigation={navigation} />

      <View style={styles.content}>
        <Image
          source={require('../../assets/images/accountLocked.png')}
          style={styles.lockImage}
          resizeMode="contain"
        />

        <Text style={styles.title}>Too many failed attempts</Text>

        <Text style={styles.message}>
          Your account has been temporarily locked due to multiple incorrect
          password entries. Please try again in 24 hours.
        </Text>
        <ButtonComponent
          title="Try again later"
          onPress={handleRetry}
          contentContainer={{ flex: 1, justifyContent: 'flex-end' }}
        />
      </View>
    </BaseContainer>
  );
};

export default AccountLockedScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginHorizontal: 12,
  },
  lockImage: {
    alignSelf: 'center',
    width: 249,
    height: 249,
    marginVertical: 70,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 40,
  },
});
