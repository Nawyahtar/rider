import React, { useState, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CircleCheckBig,
  MapPinHouse,
} from 'lucide-react-native';

import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import Colors from '../../styles/Color';
import OrderCard from '../../components/card/OrderCard';

const RideScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const sampleOrders = useMemo(
    () => [
      {
        id: '1',
        title: 'Order #A123',
        time: 'Today, 10:30 AM',
        price: '4,000 MMK',
        totalPrice: 4000,
        restaurantName: 'Shwe Myo Taw',
        receiverName: 'Su Su',
        completed: true,
        status: 'Pending',
        statusStep: 'Requested',
        destination: 'Yangon Bakery',
        statusText: 'Waiting for rider to pick up',
      },
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

  const rideData = useMemo(() => {
    return sampleOrders.filter(order =>
      activeTab === 'upcoming' ? !order.completed : order.completed,
    );
  }, [activeTab, sampleOrders]);


  const renderTabButton = (label, icon, value) => {
    const isActive = activeTab === value;
    return (
      <TouchableOpacity
        onPress={() => setActiveTab(value)}
        style={[styles.tabItem, isActive && styles.activeTabItem]}
      >
        {icon}
        <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <BaseContainer contentStyle={{ backgroundColor: Colors.screenBackground }}>
      <HeaderTitleComponent
        title="Rides"
        showBackIcon={false}
        contentContainer={styles.headerContainer}
        paddingTop={15}
      />

      <View style={styles.tabRow}>
        {renderTabButton(
          'Upcoming',
          <MapPinHouse
            size={22}
            color={activeTab === 'upcoming' ? '#168aff' : '#999'}
          />,
          'upcoming',
        )}
        {renderTabButton(
          'Completed',
          <CircleCheckBig
            size={22}
            color={activeTab === 'completed' ? '#168aff' : '#999'}
          />,
          'completed',
        )}
      </View>
      <View style={styles.orderListContainer}>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={rideData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <OrderCard item={item} showNew={false} navigation={navigation} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </BaseContainer>
  );
};

export default RideScreen;

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: Colors.background,
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 16,
  },
  headerContainer: { backgroundColor: Colors.background },
  tabItem: {
    width: '40%',
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabItem: {
    backgroundColor: Colors.iconBackground,
    padding: 6,
    borderRadius: 8,
  },
  tabLabel: {
    fontSize: 13,
    marginTop: 4,
    color: '#999',
  },
  activeTabLabel: {
    color: Colors.primary,
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 1,
  },
  cardLeft: {
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  circleIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.iconBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCenter: {
    flex: 1,
    height: 70,
    justifyContent: 'space-between',
  },
  cardRight: {
    marginLeft: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    color: '#777',
  },
  price: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
  },
  rightColumn: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  newTag: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  orderListContainer: {
    backgroundColor: 'white',
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 5,
  },
});
