import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import { OtpInput } from 'react-native-otp-entry';
import { Screen } from '../../constant/Screen';
import CustomConfirmModal from '../../components/modals/CustomConfirmModal';

const ResetPasswordScreen = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [alertModal, setAlertModal] = useState({ visible: false, message: '' });

  const handleContinue = () => {
    Keyboard.dismiss();

    if (code.length !== 6) {
      setAlertModal({visible:true,message:"You need to fill 6 digit"})
      return
    }
    navigation.navigate(Screen.Auth.CreatenewPassword)
  };

  return (
    <BaseContainer>
      <HeaderTitleComponent navigation={navigation} title="Reset password" />

      <View style={styles.container}>
        <Text style={styles.title}>Enter the code</Text>
        <Text style={styles.subtitle}>
          We sent a code to your email. Enter it below to continue.
        </Text>

        <OtpInput
          numberOfDigits={6}
          autoFocus={false}
          focusColor="#007BFF"
          hideStick={true}
          type="numeric"
          secureTextEntry={false}
          onTextChange={setCode}
          onFilled={text => console.log(`OTP is ${text}`)}
          textInputProps={{
            accessibilityLabel: 'One-Time Password',
          }}
          textProps={{
            accessibilityRole: 'text',
            accessibilityLabel: 'OTP digit',
            allowFontScaling: false,
          }}
          theme={{
            containerStyle: styles.otpContainer,
            pinCodeContainerStyle: styles.otpInputContainer,
            pinCodeTextStyle: styles.otpInput,
            focusStickStyle: styles.focusStick,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
            filledPinCodeContainerStyle: styles.filledPinCodeContainer,
            disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
            placeholderTextStyle: styles.placeholderText,
          }}
        />

        <TouchableOpacity>
          <Text style={styles.resend}>Resend code</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <ButtonComponent title="Continue" onPress={handleContinue} />
      </View>
      <CustomConfirmModal
        visible={alertModal.visible}
        title="Alert"
        message={alertModal.message}
        onConfirm={() => setAlertModal({ visible: false, message: '' })}
      />
    </BaseContainer>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  resend: {
    fontSize: 13,
    color: '#999',
    marginTop: 10,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  // Otp theme styles
  otpContainer: {
    justifyContent: 'center',
    marginBottom: 16,
  },
  otpInputContainer: {
    width: 45,
    height: 55,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007BFF',
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  activePinCodeContainer: {
    borderColor: '#007BFF',
  },
  filledPinCodeContainer: {
    borderColor: '#007BFF',
  },
  disabledPinCodeContainer: {
    backgroundColor: '#e0e0e0',
    borderColor: '#ccc',
  },
  otpInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  focusStick: {
    width: 0,
    height: 0,
  },
  placeholderText: {
    color: '#999',
  },
});
