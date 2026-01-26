import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  BackHandler,
} from 'react-native';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import BaseContainer from '../../components/BaseContainer';
import DeliveryComplete from '../../assets/images/deliveryComplete.png';
import { Font } from '../../styles/Font';
import Colors from '../../styles/Color';

const DeliveryCompleteScreen = ({ navigation }) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  const handleNewDelivery = () => {
    navigation.pop(2); // Go back 2 screens (adjust as needed)
  };

  return (
    <BaseContainer contentStyle={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={DeliveryComplete} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.content}>
        <Text style={styles.mainText}>You've completed the delivery</Text>
        <Text style={styles.subText}>
          You've successfully delivered the order to the customer. Your earnings have been added to {"\n"}your account.
        </Text>
      </View>
      <ButtonComponent
        title="Start a new delivery"
        onPress={handleNewDelivery}
        buttonStyle={styles.button}
      />
    </BaseContainer>
  );
};

export default DeliveryCompleteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    alignItems: 'center',
    paddingTop: 20,
  },
  image: {
    width: "95%",
    height: 537,
    marginTop: 25,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  mainText: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: Font.Bold,
    marginBottom: 8,
    textAlign: 'center',
    color: '#000',
  },
  subText: {
    fontSize: 16,
    fontFamily: Font.Regular,
    color: Colors.radioText,
    textAlign: 'center',
    marginBottom: 24,
  },
});
