import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { Screen } from '../../constant/Screen';
import BaseContainer from '../../components/BaseContainer';
import Colors from '../../styles/Color';
import SwitchToggle from 'react-native-switch-toggle';
import OrderCard from '../../components/card/OrderCard';
import amico from '../../assets/images/amico.png';
import WelcomeModal from '../../components/modals/WelcomeModal';
import { Font } from '../../styles/Font';
import { OrderContext } from '../../context/OrderContext';

const HomeScreen = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const userName = 'John Doe';

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = useCallback(() => {
    setIsEnabled(prev => {
      const newValue = !prev;
      console.log('toggleSwitch', newValue);
      return newValue;
    });
  }, []);

  const onApply = useCallback(() => {
    navigation.navigate(Screen.BottomTab.NearyBy);
  }, [navigation]);

  const sampleOrders = useMemo(
    () => [
      {
        id: '2',
        title: 'Order #B456',
        time: 'Today, 12:00 PM',
        price: '5,500 MMK',
        totalPrice: 5500,
        restaurantName: 'Golden Palace',
        receiverName: 'Myo Myo',
        bikerLocation: { latitude: 16.8382, longitude: 96.1684 },
        restaurantLocation: { latitude: 16.775742551536613, longitude: 96.22572621308551 },
        receiverLocation: { latitude: 16.775995132611854, longitude: 96.22775908999306 },
        completed: false,
        status: 'Pending',
        statusStep: 'Restaurant',
        destination: 'Golden Palace',
        statusText: 'Rider is picking up the order',
        exactTime: '3:00 PM',

      },
      {
        id: '3',
        title: 'Order #C789',
        time: 'Today, 2:15 PM',
        price: '3,800 MMK',
        totalPrice: 3800,
        restaurantName: 'BBQ House',
        receiverName: 'Hnin Ei Ei',
        bikerLocation: { latitude: 16.8390, longitude: 96.1710 },
        restaurantLocation: { latitude: 16.870815792808227, longitude: 96.25456102526461 },
        receiverLocation: { latitude: 16.890858905888688, longitude: 96.24180828293596 },
        completed: false,
        status: 'Pending',
        statusStep: 'Delivered',
        destination: 'Hnin Ei Ei',
        statusText: 'Rider is on the way to receiver',
      },
      {
        id: '4',
        title: 'Order #D321',
        time: 'Today, 3:30 PM',
        price: '6,000 MMK',
        totalPrice: 6000,
        restaurantName: 'Pasta & Co.',
        receiverName: 'Nyein Chan',
        bikerLocation: { latitude: 16.8370, longitude: 96.1650 },
        restaurantLocation: { latitude: 13.9132123, longitude: 100.5549853 },
        receiverLocation: { latitude: 13.9138525, longitude: 100.5511072 },
        completed: false,
        status: 'Pending',
        statusStep: 'Delivered',
        destination: 'Nyein Chan',
        statusText: 'Order delivered',
      },
      {
        id: '5',
        title: 'Order #E222',
        time: 'Today, 5:00 PM',
        price: '3,500 MMK',
        totalPrice: 3500,
        restaurantName: 'Noodle King',
        receiverName: 'Aye Aye',
        bikerLocation: { latitude: 16.8360, longitude: 96.1690 },
        restaurantLocation: { latitude: 16.774450091371726, longitude: 96.2265714215086 },
        receiverLocation: { latitude: 16.77464260282961, longitude: 96.22647531320055 },
        completed: false,
        status: 'Pending',
        statusStep: 'Restaurant',
        destination: 'Noodle King',
        statusText: 'Biker heading to restaurant',
      },
    ],
    []
  );

  const ListHeader = useMemo(() => {
    return (
      <View style={styles.orderListHeader}>
        <Text style={styles.orderListTitle}>Upcoming Orders</Text>
        <TouchableOpacity onPress={() => navigation.navigate(Screen.BottomTab.Ride)}>
          <Text style={styles.orderListViewAll}>View All</Text>
        </TouchableOpacity>
      </View>
    );
  });

  return (
    <BaseContainer contentStyle={styles.background}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* Earnings Section */}
      <View style={styles.headerContainer}>
        <View style={styles.rowContainer}>
          <View style={styles.leftBlock}>
            <Text style={styles.header}>Home</Text>
            <Text style={styles.label}>Today's Earnings</Text>
            <Text style={styles.amount}>
              120,000,000 MMK{'\n'}
              <Text style={styles.subText}>Total earned today</Text>
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate(Screen.Other.Detail)}
            >
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.imageWrapper}>
            <Image source={amico} style={styles.image} resizeMode="contain" />
          </View>
        </View>
        <View style={styles.onlineContainer}>
          <View>
            <Text style={styles.statusTitle}>Status</Text>
            <Text style={styles.statusSubtitle}>
              Online: Open to any delivery
            </Text>
          </View>
          <SwitchToggle
            switchOn={isEnabled}
            onPress={toggleSwitch}
            containerStyle={styles.switchContainer}
            circleStyle={styles.switchThumb}
            backgroundColorOn={Colors.primary}
            backgroundColorOff="#ccc"
            circleColorOn="#ffffff"
            circleColorOff="#ffffff"
          />
        </View>
      </View>

      {!isEnabled ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          You are currently offline. Please {'\n'}switch online to view available orders.
        </Text>) :
        sampleOrders.length === 0 ? (
          <WelcomeModal userName={userName} onApply={onApply} />
        ) : (
          <View style={styles.orderListContainer}>
            <FlatList
              data={sampleOrders}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={ListHeader}
              renderItem={({ item }) => <OrderCard item={item} navigation={navigation} />}
            />
          </View>
        )}
    </BaseContainer >
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.screenBackground,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 220,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerContainer: {
    backgroundColor: 'white',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: 10,
  },
  leftBlock: {
    marginLeft: 16,
    height: '100%',
    justifyContent: 'space-evenly',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: Font.Medium,
  },
  label: {
    fontSize: 12,
    color: '#555',
    fontFamily: Font.Regular,
  },
  amount: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: Font.ExtraBold,
    color: Colors.primary,
    marginTop: 4,
  },
  subText: {
    fontFamily: Font.Regular,
    fontWeight: '400',
    fontSize: 8,
    color: Colors.subtleText,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: Colors.background,
    fontWeight: '700',
    fontFamily: Font.Bold,
    fontSize: 10,
  },
  imageWrapper: {
    flex: 1.1,
    alignItems: 'flex-end',
  },
  image: {
    width: '100%',
    height: 184,
    aspectRatio: 1.2,
  },
  onlineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.screenBackground,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 10,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Font.Bold,
    color: Colors.text,
  },
  statusSubtitle: {
    fontSize: 12,
    color: Colors.subtleText,
    fontWeight: '400',
    fontFamily: Font.Regular,
    marginTop: 4,
  },
  switchContainer: {
    width: 50,
    height: 33,
    borderRadius: 25,
    padding: 3,
    justifyContent: 'flex-start',
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  orderListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: 10,
    marginBottom: 8,
  },
  orderListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderListViewAll: {
    fontSize: 13,
    fontWeight: '500',
    color: '#168aff',
  },
  orderListContainer: {
    backgroundColor: 'white',
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 5,
  },
});
