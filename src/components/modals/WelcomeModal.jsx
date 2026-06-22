import React, { memo, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import welcome from '../../assets/images/welcomeShake.png';
import Colors from '../../styles/Color';
import ButtonComponent from '../buttons/ButtonComponent';
import { LanguageContext } from '../../context/LanguageContext';
import { Font } from '../../styles/Font';

const WelcomeModal = ({ userName = 'John Doe', onApply }) => {
  const { t } = useContext(LanguageContext);

  return (
    <View style={styles.container}>
      <Image source={welcome} style={styles.image} resizeMode="contain" />
      <Text style={styles.helloText}>{t('welcome.hello', { name: userName })}</Text>
      <Text style={styles.welcomeText}>{t('welcome.title')}</Text>
      <Text style={styles.subText}>{t('welcome.message')}</Text>
      <ButtonComponent
        title={t('welcome.applyNow')}
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
    fontFamily: Font.Regular,
    color: Colors.subtleText,
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 22,
    fontFamily: Font.Bold,
    color: Colors.secondaryText,
    marginBottom: 12,
  },
  subText: {
    fontSize: 10,
    fontFamily: Font.Regular,
    color: Colors.subtleText,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
});
