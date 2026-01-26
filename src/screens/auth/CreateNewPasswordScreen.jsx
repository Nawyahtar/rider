import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import TextInputComponent from '../../components/textInputs/TextInputComponent';
import { Screen } from '../../constant/Screen';

const CreateNewPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({
    passwordError: '',
    confirmPasswordError: '',
  });

  const handleResetPassword = () => {
    let hasError = false;
    let passwordError = '';
    let confirmPasswordError = '';

    if (!password) {
      passwordError = 'Please enter new password';
      hasError = true;
    }

    if (!confirmPassword) {
      confirmPasswordError = 'Please confirm your password';
      hasError = true;
    } else if (password && confirmPassword !== password) {
      passwordError = 'Passwords do not match';
      confirmPasswordError = 'Passwords do not match';
      hasError = true;
    }

    if (hasError) {
      setError({ passwordError, confirmPasswordError });
      return;
    }
    setError({ passwordError: '', confirmPasswordError: '' });

    navigation.reset({
      index: 0,
      routes: [
        {
          name: Screen.Auth.Success,
          params: {
            screenTitle: 'Reset Password',
            title: 'Reset Password Successful!',
            message:
              'Your password has been successfully reset. You can now log in to start managing your deliveries.',
            buttonText: 'Go to Login',
            redirectTo: Screen.Auth.Login,
          },
        },
      ],
    });
  };

  return (
    <BaseContainer>
      <HeaderTitleComponent
        title="Create new password"
        navigation={navigation}
      />

      <View style={styles.content}>
        <Text style={styles.description}>
          Your new password must be different from previously used passwords.
        </Text>

        <TextInputComponent
          placeholder="New password"
          value={password}
          onChangeText={setPassword}
          isSecureShow={true}
          error={error.passwordError}
        />

        <TextInputComponent
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isSecureShow={true}
          error={error.confirmPasswordError}
        />

        <ButtonComponent
          title="Reset password"
          onPress={handleResetPassword}
          contentContainer={{ flex: 1, justifyContent: 'flex-end' }}
        />
      </View>
    </BaseContainer>
  );
};

export default CreateNewPasswordScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
  },
});
