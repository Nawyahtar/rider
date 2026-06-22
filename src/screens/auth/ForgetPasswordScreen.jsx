import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import TextInputComponent from '../../components/textInputs/TextInputComponent';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import Colors from '../../styles/Color';
import { Screen } from '../../constant/Screen';
import CustomConfirmModal from '../../components/modals/CustomConfirmModal';
import { LanguageContext } from '../../context/LanguageContext';

const ForgetPasswordScreen = ({ navigation }) => {
  const { t } = useContext(LanguageContext);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [alertModal, setAlertModal] = useState({ visible: false, message: '' });

  const handleResetPassword = () => {
    // TODO: Handle reset password logic
    console.log('Reset password for:', emailOrPhone);
    navigation.navigate(Screen.Auth.ResetPassword);
  };

  return (
    <BaseContainer>
      <HeaderTitleComponent navigation={navigation} title="Forgot password" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Text style={styles.title}>Forgot password</Text>
        <TextInputComponent
          title="Enter the email or phone number associated with your account"
          placeholder="Email or phone number"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
          style={styles.input}
          mb={15}
          titleFontSize={16}
        />

        <ButtonComponent
          title="Reset password"
          onPress={handleResetPassword}
          contentContainer={styles.buttonContainer}
        />
      </KeyboardAvoidingView>
      <CustomConfirmModal
        visible={alertModal.visible}
        title={t('common.alert')}
        message={alertModal.message}
        onConfirm={() => setAlertModal({ visible: false, message: '' })}
      />
    </BaseContainer>
  );
};

export default ForgetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginHorizontal: 5,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
