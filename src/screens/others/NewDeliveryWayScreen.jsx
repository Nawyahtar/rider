import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform, BackHandler } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import TimelineRowComponent from '../../components/time/TimeLineRowComponent';
import CustomConfirmModal from '../../components/modals/CustomConfirmModal';
import CustomSnackBar from '../../components/sanckbar/CustomSnackBar';
import Geolocation from '@react-native-community/geolocation';


import Colors from '../../styles/Color';
import { Font } from '../../styles/Font';
import { Bike, Utensils, User, InfoIcon } from 'lucide-react-native';
import { Screen } from '../../constant/Screen';
import OrderStatus from '../../utils/OrderStatus';
import { OrderContext } from '../../context/OrderContext';
import { getDistance } from 'geolib';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBCQktakyeMA8A1kI80UjSxIpngXUOeXk8';
const BASE_FARE = 500;
const RATE_PER_KM = 800;

const NewDeliveryWayScreen = ({ navigation, route }) => {
  const { order } = route.params || {};
  const { setCurrentOrder } = useContext(OrderContext);

  const {
    restaurantLocation,
    receiverLocation,
    restaurantName,
    receiverName,
    status,
  } = order || {};

  const [currentBikerLocation, setCurrentBikerLocation] = useState();
  const mapRef = useRef(null);
  const watchId = useRef(null);

  const [pickUpTime, setPickUpTime] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState(0);
  const [pickDistance, setPickDistance] = useState(0);
  const [deliverDistance, setDeliverDistance] = useState(0);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackType, setSnackType] = useState('success');
  const [snackMessage, setSnackMessage] = useState('');

  const [mapReady, setMapReady] = useState(false);


  const totalDistance = (pickDistance + deliverDistance).toFixed(2);
  const deliveryCost = Math.floor((BASE_FARE + totalDistance * RATE_PER_KM) / 100) * 100;
  const getRegionWithDelta = (location, latitudeDelta = 0.005, longitudeDelta = 0.005) => ({
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: latitudeDelta,
    longitudeDelta: longitudeDelta,
  });
  const [currentDelta, setCurrentDelta] = useState({
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });


  useEffect(() => {
    const startLocationUpdates = async () => {
      watchId.current = Geolocation.watchPosition(
        (position) => {
          console.log('Current biker location:', position.coords);
          const { latitude, longitude } = position.coords;
          setCurrentBikerLocation({ latitude, longitude });
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 5000,
          fastestInterval: 3000,
          timeout: 10000,
        }
      );
    };

    startLocationUpdates();

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, []);


  useEffect(() => {
    if (status === OrderStatus.ORDER_RECEIVED) {
      const timeout = setTimeout(() => {
        showSnackbar(`Order picked up. Start going to customer's address`, 'warn');
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [status]);
  useEffect(() => {
    if (
      status === OrderStatus.ONGOING &&
      currentBikerLocation &&
      restaurantLocation
    ) {
      const distance = getDistance(currentBikerLocation, restaurantLocation);

      if (distance < 50) {
        updateOrderStatus(OrderStatus.ARRIVED_TO_RESTAURANT);
      }
    }

    if (
      status === OrderStatus.ONGOINGCustomer &&
      currentBikerLocation &&
      receiverLocation
    ) {
      const distance = getDistance(currentBikerLocation, receiverLocation);

      if (distance < 50) {
        updateOrderStatus(OrderStatus.ARRIVED_TO_CUSTOMER);
      }
    }
  }, [currentBikerLocation, status]);


  useEffect(() => {
    if (mapReady && currentBikerLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentBikerLocation.latitude,
        longitude: currentBikerLocation.longitude,
        latitudeDelta: currentDelta.latitudeDelta,
        longitudeDelta: currentDelta.longitudeDelta,
      }, 1000);
    }
  }, [mapReady, currentBikerLocation]);


  const updateOrderStatus = (newStatus) => {
    const updatedOrder = { ...order, status: newStatus };
    navigation.setParams({ order: updatedOrder });
    return updatedOrder;
  };

  const handleReject = () => navigation.goBack();
  const handleAccept = () => setConfirmVisible(true);
  const handleCancel = () => setConfirmVisible(false);

  const handleConfirm = () => {
    if (status === OrderStatus.ARRIVED_TO_CUSTOMER) {
      const updatedOrder = { ...order, status: OrderStatus.CONFIRM_ORDER };
      setCurrentOrder(null);
      navigation.replace(Screen.Other.OrderDetail, { order: updatedOrder, source: 'statusAction' });
    } else {
      updateOrderStatus(OrderStatus.ACCEPTED);
      if (!order?.exactTime) {
        setCurrentOrder(order);
      }
      setConfirmVisible(false);
    }
  };

  const handleStartGo = () => {
    updateOrderStatus(OrderStatus.ONGOING);
    showSnackbar(`Please start riding now to the ${restaurantName}`, 'success');
  };

  const handleStartDeliveryGo = () => {
    updateOrderStatus(OrderStatus.ONGOINGCustomer);
    showSnackbar(`Start riding now to the ${receiverName}`, 'success');
  };

  const showSnackbar = (msg, type = 'info') => {
    setSnackMessage(msg);
    setSnackType(type);
    setSnackVisible(true);
  };

  const handleDismissSnackbar = useCallback(() => setSnackVisible(false), []);

  const renderMarker = (coordinate, icon, title) => (
    <Marker coordinate={coordinate} title={title}>
      <View style={styles.circleIcon}>
        <View style={styles.iconWrapper}>{icon}</View>
        <View style={styles.triangle} />
      </View>
    </Marker>
  );

  const renderActionButtons = () => {
    if (status === OrderStatus.PENDING) {
      return (
        <View style={styles.buttonContainer}>
          <ButtonComponent title="Reject" onPress={handleReject} buttonStyle={[styles.buttonStyle, styles.rejectBtn]} textStyle={styles.rejectText} />
          <ButtonComponent title="Accept" onPress={handleAccept} buttonStyle={[styles.buttonStyle, styles.acceptBtn]} />
        </View>
      );
    } else if (status === OrderStatus.ARRIVED_TO_RESTAURANT) {
      return (
        <ButtonComponent title="Arrived and pick up order" onPress={() => navigation.replace(Screen.Other.OrderDetail, { order, source: 'statusAction' })} buttonStyle={styles.goButton} />
      );
    } else if (status === OrderStatus.ORDER_RECEIVED) {
      return <ButtonComponent title="Start going to delivery address" onPress={handleStartDeliveryGo} buttonStyle={styles.goButton} />;
    } else if (status === OrderStatus.ACCEPTED) {
      if (order?.exactTime) {
        return (
          <View style={{ gap: 8, backgroundColor: 'white', margin: 16, padding: 16, borderRadius: 10, flexDirection: 'row' }}>
            <InfoIcon size={20} color={Colors.pendigColor} />
            <Text style={{ textAlign: 'center', fontFamily: Font.Bold }}>Pick up {order?.exactTime} today!</Text>
          </View>
        );
      }
      return <ButtonComponent title="Start going now" onPress={handleStartGo} buttonStyle={styles.goButton} />;
    } else if (status === OrderStatus.ARRIVED_TO_CUSTOMER) {
      return <ButtonComponent title="Arrived at delivery address" onPress={handleAccept} buttonStyle={styles.goButton} />;
    } else if (status === OrderStatus.CONFIRM_ORDER) {
      return <ButtonComponent title="Confirm Delivery" onPress={() => navigation.replace(Screen.Other.OrderDetail, { order, source: 'statusAction' })} buttonStyle={styles.goButton} />;
    } else {
      return <ButtonComponent title="Going..." buttonStyle={styles.goButton} disabled />;
    }
  };

  return (
    <BaseContainer contentStyle={styles.container}>
      <HeaderTitleComponent navigation={navigation} title="New Delivery Way" paddingTop={5} />

      <MapView
        ref={mapRef}
        style={styles.map}
        onMapReady={() => setMapReady(true)}
        initialRegion={getRegionWithDelta(currentBikerLocation || { latitude: 0, longitude: 0 })}
        onRegionChangeComplete={(region) => {
          console.log('Region changed:', region);
          setCurrentDelta({
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
          });
        }}
      >
        {currentBikerLocation?.latitude && renderMarker(currentBikerLocation, <Bike size={20} color="#fff" />, 'Biker')}
        {restaurantLocation?.latitude && ![OrderStatus.ORDER_RECEIVED, OrderStatus.ARRIVED_TO_CUSTOMER, OrderStatus.CONFIRM_ORDER, OrderStatus.ONGOINGCustomer].includes(status) &&
          renderMarker(restaurantLocation, <Utensils size={20} color="#fff" />, 'Restaurant')}
        {receiverLocation?.latitude && renderMarker(receiverLocation, <User size={20} color="#fff" />, 'Receiver')}

        {currentBikerLocation?.latitude && restaurantLocation?.latitude && ![OrderStatus.ORDER_RECEIVED, OrderStatus.ARRIVED_TO_CUSTOMER, OrderStatus.CONFIRM_ORDER, OrderStatus.ONGOINGCustomer].includes(status) && (
          <MapViewDirections
            origin={currentBikerLocation}
            destination={restaurantLocation}
            apikey={GOOGLE_MAPS_APIKEY}
            mode="WALKING"
            strokeWidth={5}
            strokeColor={Colors.pickUpColor}
            onReady={(result) => {
              setPickUpTime(Math.round(result.duration));
              setPickDistance(result.distance);
            }}
            resetOnChange={false}
          />
        )}

        {restaurantLocation?.latitude && receiverLocation?.latitude && ![OrderStatus.ORDER_RECEIVED, OrderStatus.ARRIVED_TO_CUSTOMER, OrderStatus.CONFIRM_ORDER, OrderStatus.ONGOINGCustomer].includes(status) && (
          <MapViewDirections
            origin={restaurantLocation}
            destination={receiverLocation}
            apikey={GOOGLE_MAPS_APIKEY}
            mode="WALKING"
            strokeWidth={5}
            strokeColor={Colors.deliverColor}
            onReady={(result) => {
              setDeliveryTime(Math.round(result.duration));
              setDeliverDistance(result.distance);
            }}
          />
        )}

        {currentBikerLocation?.latitude && receiverLocation?.latitude && [OrderStatus.ORDER_RECEIVED, OrderStatus.ARRIVED_TO_CUSTOMER, OrderStatus.CONFIRM_ORDER, OrderStatus.ONGOINGCustomer].includes(status) && (
          <MapViewDirections
            origin={currentBikerLocation}
            destination={receiverLocation}
            apikey={GOOGLE_MAPS_APIKEY}
            mode="WALKING"
            strokeWidth={5}
            strokeColor={Colors.deliverColor}
            onReady={(result) => {
              setDeliveryTime(Math.round(result.duration));
              setDeliverDistance(result.distance);
            }}
            resetOnChange={false}
          />
        )}

      </MapView>

      <TimelineRowComponent
        fromBikeToRestaurant={pickUpTime}
        fromRestaurantToReceiver={deliveryTime}
        receiverName={receiverName || 'Receiver'}
        restaurantName={restaurantName || 'Restaurant'}
      />

      <View style={styles.infoCard}>
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={styles.label}>Total Distance:</Text>
            <Text style={styles.label}>Est. Earnings:</Text>
          </View>
          <View style={styles.centerColumn}>
            <Text style={styles.value}>{totalDistance} km</Text>
            <Text style={[styles.value, styles.bold]}>{deliveryCost} Ks</Text>
          </View>
          <TouchableOpacity style={styles.detailsColumn} onPress={() => navigation.replace(Screen.Other.OrderDetail, { order, source: 'viewDetails' })}>
            <Text style={styles.viewDetails}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderActionButtons()}

      <CustomConfirmModal
        visible={confirmVisible}
        titleShow={false}
        message={
          <Text style={styles.messageStyle}>
            <Text style={styles.modalText}>Are you sure to accept to pick up{'\n'}</Text>
            <Text style={styles.modalBold}>the order at {restaurantName}?</Text>
          </Text>
        }
        onConfirmText="Yes I'm Sure"
        onConfirm={handleConfirm}
        onCancelText="No"
        onCancel={handleCancel}
        confirmButtonStyle={styles.confirmButton}
        cancelButtonStyle={styles.cancelButton}
      />

      <CustomSnackBar visible={snackVisible} message={snackMessage} type={snackType} onDismiss={handleDismissSnackbar} />
    </BaseContainer>
  );
};

export default NewDeliveryWayScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.screenBackground,
  },
  map: {
    flex: 1,
  },
  circleIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    backgroundColor: Colors.iconGray,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
    borderTopColor: Colors.iconGray,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    flex: 1.2,
    gap: 10,
  },
  centerColumn: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 10,
  },
  detailsColumn: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  label: {
    fontFamily: Font.Regular,
    fontSize: 14,
    fontWeight: '400',
  },
  value: {
    fontSize: 14,
    color: '#111',
  },
  bold: {
    fontWeight: 'bold',
  },
  viewDetails: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
    fontFamily: Font.Bold,
  },
  buttonContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginTop: 20,
  },
  buttonStyle: {
    height: 44,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  rejectBtn: {
    backgroundColor: '#f1f1f1',
    marginRight: 25,
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  rejectText: {
    color: Colors.text,
  },
  messageStyle: {
    textAlign: 'center',
    fontSize: 16,
  },
  modalText: {
    color: Colors.secondaryText,
    fontFamily: Font.Regular,
  },
  modalBold: {
    fontFamily: Font.Bold,
    lineHeight: 22,
    flexWrap: 'wrap'
  },
  confirmButton: {
    borderRadius: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 13,
  },
  cancelButton: {
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 13,
    backgroundColor: Colors.screenBackground,
    alignItems: 'center',
  },
  goButton: {
    marginHorizontal: 16,
    height: 50
  }
});  