import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, BackHandler } from 'react-native';
import { RegisterContext } from '../../context/RegisterContext';
import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import TextInputComponent from '../../components/textInputs/TextInputComponent';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import Colors from '../../styles/Color';
import { Screen } from '../../constant/Screen';
import { useFocusEffect } from '@react-navigation/native';

const CreateAccountScreen = ({ navigation }) => {
  const { registerData, updateStepData, resetRegisterData } =
    useContext(RegisterContext);
  const [errors, setErrors] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        resetRegisterData();
        return false;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, []),
  );

  const onNext = () => {
    const isValid = validateFields();

    if (!isValid) {
      return;
    }

    console.log('Step 1 Data:', registerData.info);
    navigation.navigate(Screen.Auth.VehicleInformation);
  };

  const info = registerData.info || {};

  const isValidEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateFields = () => {
    const newErrors = {};

    if (!info.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!info.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!info.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(info.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!info.phoneNo?.trim()) newErrors.phoneNo = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const clearErrorOnType = (field, value) => {
    if (errors[field] && value.trim()) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <BaseContainer scroll={true} keyboardOffset={20}>
      <HeaderTitleComponent
        title={'Welcome'}
        navigation={navigation}
        onBackPress={() => {
          resetRegisterData();
          navigation.goBack();
        }}
      />
      <View style={{ flex: 1, padding: 20 }}>
        <View style={styles.paginationContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <Text style={styles.titleText}>Create your account</Text>

        <TextInputComponent
          placeholder="First Name"
          value={info.firstName || ''}
          onChangeText={text => {
            updateStepData('info', { ...info, firstName: text });
            clearErrorOnType('firstName', text);
          }}
          contentContainerStyle={{ marginBottom: 5 }}
          error={errors?.firstName}
        />

        <TextInputComponent
          placeholder="Last Name"
          value={info.lastName || ''}
          onChangeText={text => {
            updateStepData('info', { ...info, lastName: text });
            clearErrorOnType('lastName', text);
          }}
          contentContainerStyle={{ marginVertical: 5 }}
          error={errors?.lastName}
        />

        <TextInputComponent
          placeholder="Email"
          value={info.email || ''}
          onChangeText={text => {
            updateStepData('info', { ...info, email: text });
            clearErrorOnType('email', text);
          }}
          contentContainerStyle={{ marginVertical: 5 }}
          error={errors?.email}
          keyboardType="email-address"
        />

        <TextInputComponent
          placeholder="Phone Number"
          value={info.phoneNo || ''}
          onChangeText={text => {
            updateStepData('info', { ...info, phoneNo: text });
            clearErrorOnType('phoneNo', text);
          }}
          error={errors?.phoneNo}
          keyboardType="phone-pad"
        />

        <ButtonComponent
          title="Next"
          onPress={onNext}
          contentContainer={{ flex: 1, justifyContent: 'flex-end' }}
        />
      </View>
    </BaseContainer>
  );
};

export default CreateAccountScreen;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: '#000',
  },

});
