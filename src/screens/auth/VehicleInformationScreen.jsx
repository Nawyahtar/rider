import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useState } from 'react';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import TextInputComponent from '../../components/textInputs/TextInputComponent';
import { RegisterContext } from '../../context/RegisterContext';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import BaseContainer from '../../components/BaseContainer';
import { Screen } from '../../constant/Screen';
import DropdownComponent from '../../components/dropdown/DropDownComponent';
const vehicleTypeOptions = [
  { label: 'Bicycle', value: 'Bicycle' },
  { label: 'Tricycle', value: 'Tricycle' },
  { label: 'Motor Cycle', value: 'Motor Cycle' },
  { label: 'Car', value: 'Car' },
  { label: 'Other', value: 'Other' },
];

const VehicleInformationScreen = ({ navigation }) => {
  const { registerData, updateStepData } = useContext(RegisterContext);
  const [errors, setErrors] = useState({});

  const step2 = registerData.step2 || {};

  const onNext = () => {
    const isValid = validateFields();
    if (!isValid) {
      return;
    }
    console.log('Step 1 & 2 Combined:', {
      ...registerData.info,
      ...registerData.step2,
    });
    navigation.navigate(Screen.Auth.Document);
  };
  const isValidDateFormat = dateStr => {
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    return datePattern.test(dateStr);
  };

  const validateFields = () => {
    const newErrors = {};

    if (!step2.vehicleType?.trim()) newErrors.vehicleType = 'Required';
    if (!step2.licensePlate?.trim()) newErrors.licensePlate = 'Required';
    if (!step2.expiryDate?.trim()) {
      newErrors.expiryDate = 'Required';
    } else if (!isValidDateFormat(step2.expiryDate)) {
      newErrors.expiryDate = 'Invalid date format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <BaseContainer scroll={true} keyboardOffset={20}>
      <HeaderTitleComponent
        title={'Vehicle Information'}
        navigation={navigation}
      />
      <View style={{ flex: 1, padding: 20 }}>
        <DropdownComponent
          title="Vehicle Type"
          value={step2.vehicleType}
          data={vehicleTypeOptions}
          placeholder="Select vehicle type"
          onChange={item =>
            updateStepData('step2', { ...step2, vehicleType: item.value })
          }
          error={errors?.vehicleType}
        />

        <TextInputComponent
          title="License Plate"
          placeholder="Enter license plate"
          value={step2.licensePlate || ''}
          onChangeText={text =>
            updateStepData('step2', { ...step2, licensePlate: text })
          }
          contentContainerStyle={{ marginBottom: 5 }}
          error={errors?.licensePlate}
        />

        <TextInputComponent
          title="Insurance Provider (Optional)"
          placeholder="Enter insurance provider"
          value={step2.insuranceProvider || ''}
          onChangeText={text =>
            updateStepData('step2', { ...step2, insuranceProvider: text })
          }
          contentContainerStyle={{ marginBottom: 5 }}
          error={errors?.insuranceProvider}
        />

        <TextInputComponent
          title="Expiration Date"
          placeholder="DD/MM/YYYY"
          value={step2.expiryDate}
          onChangeText={(masked, unmasked) => {
            updateStepData('step2', {
              ...step2,
              expiryDate: masked,
            });
          }}
          isDateMask={true}
          error={errors?.expiryDate}
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

export default VehicleInformationScreen;

const styles = StyleSheet.create({});
