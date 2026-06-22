import React, {
  useContext,
  useState,
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
import { Screen } from '../../constant/Screen';
import BaseContainer from '../../components/BaseContainer';
import Colors from '../../styles/Color';
import SwitchToggle from 'react-native-switch-toggle';
import OrderCard from '../../components/card/OrderCard';
import amico from '../../assets/images/amico.png';
import WelcomeModal from '../../components/modals/WelcomeModal';
import { Font } from '../../styles/Font';
import { LanguageContext } from '../../context/LanguageContext';

const HomeScreen = ({ navigation }) => {
  const { t } = useContext(LanguageContext);
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
        <Text style={styles.orderListTitle}>{t('home.upcomingOrders')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate(Screen.BottomTab.Ride)}>
          <Text style={styles.orderListViewAll}>{t('home.viewAll')}</Text>
        </TouchableOpacity>
      </View>
    );
  }, [navigation, t]);

  return (
    <BaseContainer contentStyle={styles.background}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* Earnings Section */}
      <View style={styles.headerContainer}>
        <View style={styles.rowContainer}>
          <View style={styles.leftBlock}>
            <Text style={styles.header}>{t('home.title')}</Text>
            <Text style={styles.label}>{t('home.todaysEarnings')}</Text>
            <Text style={styles.amount}>
              120,000,000 MMK{'\n'}
              <Text style={styles.subText}>{t('home.totalEarnedToday')}</Text>
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate(Screen.Other.Detail)}
            >
              <Text style={styles.buttonText}>{t('home.viewDetails')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.imageWrapper}>
            <Image source={amico} style={styles.image} resizeMode="contain" />
          </View>
        </View>
        <View style={styles.onlineContainer}>
          <View>
            <Text style={styles.statusTitle}>{t('home.status')}</Text>
            <Text style={styles.statusSubtitle}>
              {t('home.onlineDescription')}
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
        <Text style={styles.offlineText}>{t('home.offlineMessage')}</Text>) :
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
  offlineText: {
    marginTop: 20,
    paddingHorizontal: 24,
    color: Colors.text,
    fontFamily: Font.Regular,
    textAlign: 'center',
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
