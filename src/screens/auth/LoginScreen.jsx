import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import BaseContainer from '../../components/BaseContainer';
import TextInputComponent from '../../components/textInputs/TextInputComponent';
import TextStyles from '../../styles/TextStyle';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import LoadingComponent from '../../components/loadings/LoadingComponent';
import Colors from '../../styles/Color';
import { Screen } from '../../constant/Screen';

const LoginScreen = ({ navigation }) => {
  const { signIn } = React.useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSignIn = async () => {
    const isValid = validateFields();
    if (!isValid) {
      return;
    }
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await signIn();
    } catch (error) {
      console.error('Sign-in failed:', error);
    } finally {
      setLoading(false);
    }
  };
  const validateFields = () => {
    const newErrors = {};

    if (!username?.trim()) newErrors.username = 'username is required';
    if (!password?.trim()) newErrors.password = 'password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const clearErrorOnType = (field, value) => {
    if (errors[field] && value.trim()) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <BaseContainer>
      <HeaderTitleComponent title={'Login'} showBackIcon={false} />
      <LoadingComponent visible={loading} />
      <View style={{ flex: 1, padding: 20 }}>
        <TextInputComponent
          placeholder="Username"
          value={username}
          onChangeText={text => {
            setUsername(text);
            clearErrorOnType('username', text);
          }}
          contentContainerStyle={{ marginVertical: 10 }}
          error={errors?.username}
        />
        <TextInputComponent
          placeholder="Password"
          value={password}
          onChangeText={text => {
            setPassword(text);
            clearErrorOnType('password', text);
          }}
          isSecureShow={true}
          contentContainerStyle={{ marginBottom: 10 }}
          error={errors?.password}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate(Screen.Auth.ForgetPassword)}
          >
            <Text style={TextStyles.baseText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <ButtonComponent title="Login" onPress={() => handleSignIn()} />
        <TouchableOpacity
          onPress={() => navigation.navigate(Screen.Auth.CreateAccount)}
          style={{ alignSelf: 'center' }}
        >
          <Text style={{ color: TextStyles.baseText }}>
            Create your account
          </Text>
        </TouchableOpacity>
      </View>
    </BaseContainer>
  );
};

export default LoginScreen;
