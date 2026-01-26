import React, { useMemo, useState, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MapPin, Utensils, MapIcon, CircleCheckBig } from 'lucide-react-native';

import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import Colors from '../../styles/Color';
import { Screen } from '../../constant/Screen';

const NearByScreen = ({ navigation }) => {
  const imageList = useMemo(
    () => [
      require('../../assets/images/sampleImage.png'),
      require('../../assets/images/delivery.png'),
      require('../../assets/images/sampleImage.png'),
    ],
    [],
  );

  const RESTAURANT_DETAILS = useMemo(
    () => ({
      name: 'Pizza Company – Dagon Center 1',
      phone: '09986425654',
      address: 'No. 123 Main Street, Yangon',
      hours: {
        Monday: '11 AM - 10 PM',
        Tuesday: '11 AM - 10 PM',
        Wednesday: '11 AM - 10 PM',
        Thursday: '11 AM - 10 PM',
        Friday: '11 AM - 10 PM',
        Saturday: 'Closed',
        Sunday: 'Closed',
      },
      image: imageList,
    }),
    [imageList],
  );

  const [activeTab, setActiveTab] = useState('new');

  const allRestaurants = useMemo(
    () => [
      {
        id: '1',
        name: 'Pizza Company',
        distance: '1.2 miles',
        status: 'Pending',
      },
      { id: '2', name: 'Taco Bell', distance: '0.8 miles', status: 'Pending' },
      {
        id: '3',
        name: 'KFC',
        distance: '2.5 miles',
        status: 'Not Yet Applied',
      },
      {
        id: '11',
        name: 'Oishi Sushi',
        distance: '1.6 miles',
        status: 'Applied',
      },
      { id: '12', name: 'YKKO', distance: '2.2 miles', status: 'Applied' },
    ],
    [],
  );

  const filteredRestaurants = useMemo(() => {
    return activeTab === 'new'
      ? allRestaurants.filter(r => r.status !== 'Applied')
      : allRestaurants.filter(r => r.status === 'Applied');
  }, [activeTab, allRestaurants]);

  const handleNavigate = useCallback(
    status => {
      navigation.navigate(Screen.Other.NearByDetial, {
        restaurant: {
          ...RESTAURANT_DETAILS,
          status:
            status === 'Applied'
              ? 'success'
              : status === 'Pending'
                ? 'pending'
                : 'other',
        },
      });
    },
    [RESTAURANT_DETAILS, navigation],
  );

  const renderRestaurantCard = ({ item }) => {
    const isCardPressable =
      item.status === 'Pending' || item.status === 'Applied';

    const cardBody = (
      <View style={styles.cardContent}>
        <View style={styles.circleIconWrapper}>
          <Utensils size={20} color="#168aff" />
        </View>

        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.distanceRow}>
            <MapPin size={14} color="#888" style={{ marginRight: 4 }} />
            <Text style={styles.distance}>{item.distance}</Text>
          </View>
        </View>

        {item.status === 'Pending' && (
          <Text style={styles.pendingText}>Pending</Text>
        )}

        {item.status === 'Not Yet Applied' && (
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => handleNavigate(item.status)}
          >
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        )}
      </View>
    );

    return isCardPressable ? (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleNavigate(item.status)}
      >
        {cardBody}
      </TouchableOpacity>
    ) : (
      <View style={styles.card}>{cardBody}</View>
    );
  };

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
        title="Nearby"
        showBackIcon={false}
        contentContainer={styles.headerContainer}
        paddingTop={15}
      />

      <View style={styles.tabRow}>
        {renderTabButton(
          'New',
          <MapIcon
            size={22}
            color={activeTab === 'new' ? '#168aff' : '#999'}
          />,
          'new',
        )}
        {renderTabButton(
          'Applied',
          <CircleCheckBig
            size={22}
            color={activeTab === 'applied' ? '#168aff' : '#999'}
          />,
          'applied',
        )}
      </View>

      <FlatList
        data={filteredRestaurants}
        keyExtractor={item => item.id}
        renderItem={renderRestaurantCard}
        showsVerticalScrollIndicator={false}
      />
    </BaseContainer>
  );
};

export default NearByScreen;

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
    color: '#168aff',
    fontWeight: '600',
  },
  card: {
    height: 74,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  circleIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.iconBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
    height: 50,
    justifyContent: 'space-around',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 12,
    color: '#888',
  },
  applyButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  applyText: {
    color: '#168aff',
    fontSize: 14,
    fontWeight: '600',
  },
  pendingText: {
    color: '#FFA500',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
