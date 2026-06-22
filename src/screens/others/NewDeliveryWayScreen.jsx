import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import TimelineRowComponent from '../../components/time/TimeLineRowComponent';
import CustomConfirmModal from '../../components/modals/CustomConfirmModal';
import CustomSnackBar from '../../components/sanckbar/CustomSnackBar';
import Geolocation from '@react-native-community/geolocation';


import Colors from '../../styles/Color';
import { Font } from '../../styles/Font';
import { Utensils, User, InfoIcon } from 'lucide-react-native';
import { Screen } from '../../constant/Screen';
import OrderStatus from '../../utils/OrderStatus';
import { OrderContext } from '../../context/OrderContext';
import { getDistance } from 'geolib';
import { LanguageContext } from '../../context/LanguageContext';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBCQktakyeMA8A1kI80UjSxIpngXUOeXk8';
const BASE_FARE = 500;
const RATE_PER_KM = 800;

const isValidCoordinate = (coordinate) => (
  coordinate &&
  Number.isFinite(coordinate.latitude) &&
  Number.isFinite(coordinate.longitude)
);

const getLocationSeed = (id = 'sample') => (
  String(id)
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0)
);

const getNearbyOffsets = (id) => {
  const seed = getLocationSeed(id);
  const direction = seed % 2 === 0 ? 1 : -1;

  return {
    restaurant: {
      latitude: 0.0025 + (seed % 4) * 0.00035,
      longitude: direction * (0.0018 + (seed % 3) * 0.00035),
    },
    receiver: {
      latitude: 0.0048 + (seed % 5) * 0.0004,
      longitude: direction * (0.0035 + (seed % 4) * 0.00045),
    },
  };
};

const getNearbyCoordinate = (baseCoordinate, offset) => {
  if (!isValidCoordinate(baseCoordinate)) {
    return null;
  }

  return {
    latitude: baseCoordinate.latitude + offset.latitude,
    longitude: baseCoordinate.longitude + offset.longitude,
  };
};

const toRadians = (degree) => degree * (Math.PI / 180);
const toDegrees = (radian) => radian * (180 / Math.PI);

const getBearing = (start, end) => {
  if (!isValidCoordinate(start) || !isValidCoordinate(end)) {
    return 0;
  }

  const startLatitude = toRadians(start.latitude);
  const endLatitude = toRadians(end.latitude);
  const longitudeDifference = toRadians(end.longitude - start.longitude);
  const y = Math.sin(longitudeDifference) * Math.cos(endLatitude);
  const x =
    Math.cos(startLatitude) * Math.sin(endLatitude) -
    Math.sin(startLatitude) *
      Math.cos(endLatitude) *
      Math.cos(longitudeDifference);

  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
};

const getValidRouteCoordinates = (coordinates = []) => (
  coordinates.filter(isValidCoordinate)
);

const getClosestRouteIndex = (coordinate, routeCoordinates = []) => {
  if (!isValidCoordinate(coordinate) || routeCoordinates.length === 0) {
    return -1;
  }

  return routeCoordinates.reduce((closestIndex, routeCoordinate, index) => {
    const closestDistance = getDistance(coordinate, routeCoordinates[closestIndex]);
    const routeDistance = getDistance(coordinate, routeCoordinate);

    return routeDistance < closestDistance ? index : closestIndex;
  }, 0);
};

const getRouteMarkerState = (coordinate, routeCoordinates, fallbackDestination) => {
  if (!isValidCoordinate(coordinate)) {
    return { coordinate: null, bearing: 0 };
  }

  const validRouteCoordinates = getValidRouteCoordinates(routeCoordinates);
  const closestRouteIndex = getClosestRouteIndex(coordinate, validRouteCoordinates);

  if (closestRouteIndex === -1) {
    return {
      coordinate,
      bearing: getBearing(coordinate, fallbackDestination),
    };
  }

  const snappedCoordinate = validRouteCoordinates[closestRouteIndex];
  const nextRouteCoordinate =
    validRouteCoordinates[closestRouteIndex + 1] ||
    validRouteCoordinates[closestRouteIndex + 2] ||
    fallbackDestination;

  return {
    coordinate: snappedCoordinate,
    bearing: getBearing(snappedCoordinate, nextRouteCoordinate),
  };
};

const requestLocationPermission = async () => {
  if (Platform.OS !== 'android') {
    Geolocation.requestAuthorization?.();
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

const OverviewBicycleIcon = () => (
  <View style={styles.bicycleMarker}>
    <Svg width={32} height={56} viewBox="0 0 64 112">
      <Ellipse cx={32} cy={14} rx={7} ry={13} fill="#111827" />
      <Ellipse cx={32} cy={98} rx={7} ry={13} fill="#111827" />
      <Rect x={28} y={18} width={8} height={76} rx={4} fill="#1E40AF" />
      <Rect x={25} y={22} width={14} height={17} rx={5} fill="#2563EB" />
      <Rect x={25} y={73} width={14} height={17} rx={5} fill="#2563EB" />
      <Path d="M18 35C22.5 31.5 27.5 30 32 30C36.5 30 41.5 31.5 46 35" stroke="#93C5FD" strokeWidth={5} strokeLinecap="round" />
      <Circle cx={17} cy={36} r={5.5} fill="#F2B48F" />
      <Circle cx={47} cy={36} r={5.5} fill="#F2B48F" />
      <Path d="M22 43C18 50 17 58 19 65C21 74 26 80 32 80C38 80 43 74 45 65C47 58 46 50 42 43" fill="#2563EB" />
      <Path d="M22 43C19 51 18 58 20 66" stroke="#1D4ED8" strokeWidth={6} strokeLinecap="round" />
      <Path d="M42 43C45 51 46 58 44 66" stroke="#1D4ED8" strokeWidth={6} strokeLinecap="round" />
      <Circle cx={32} cy={52} r={12} fill="#A8552F" />
      <Path d="M24 51C25 43 30 38 37 41C43 44 44 52 40 58C35 55 30 54 24 51Z" fill="#7C2D12" />
      <Rect x={23} y={78} width={7} height={22} rx={4} rotation={12} originX={23} originY={78} fill="#312E81" />
      <Rect x={34} y={78} width={7} height={22} rx={4} rotation={-12} originX={34} originY={78} fill="#312E81" />
      <Circle cx={32} cy={39} r={4} fill="#60A5FA" />
    </Svg>
  </View>
);

const NewDeliveryWayScreen = ({ navigation, route }) => {
  const { t } = useContext(LanguageContext);
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
  const [activeBikerRouteCoordinates, setActiveBikerRouteCoordinates] = useState([]);

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

  const nearbyOffsets = useMemo(
    () => getNearbyOffsets(order?.id),
    [order?.id]
  );

  const dynamicRestaurantLocation = useMemo(() => {
    if (isValidCoordinate(restaurantLocation)) {
      return restaurantLocation;
    }

    return getNearbyCoordinate(currentBikerLocation, nearbyOffsets.restaurant);
  }, [currentBikerLocation, nearbyOffsets.restaurant, restaurantLocation]);

  const dynamicReceiverLocation = useMemo(() => {
    if (isValidCoordinate(receiverLocation)) {
      return receiverLocation;
    }

    return getNearbyCoordinate(currentBikerLocation, nearbyOffsets.receiver);
  }, [currentBikerLocation, nearbyOffsets.receiver, receiverLocation]);

  const orderWithLocations = useMemo(() => ({
    ...order,
    restaurantLocation: dynamicRestaurantLocation,
    receiverLocation: dynamicReceiverLocation,
  }), [dynamicReceiverLocation, dynamicRestaurantLocation, order]);

  const bikerDestination = useMemo(() => {
    if (
      [OrderStatus.ORDER_RECEIVED, OrderStatus.ARRIVED_TO_CUSTOMER, OrderStatus.CONFIRM_ORDER, OrderStatus.ONGOINGCustomer].includes(status)
    ) {
      return dynamicReceiverLocation;
    }

    return dynamicRestaurantLocation;
  }, [dynamicReceiverLocation, dynamicRestaurantLocation, status]);

  const bikerMarkerState = useMemo(
    () => getRouteMarkerState(
      currentBikerLocation,
      activeBikerRouteCoordinates,
      bikerDestination
    ),
    [activeBikerRouteCoordinates, bikerDestination, currentBikerLocation]
  );
  const bikerRotation = useMemo(
    () => bikerMarkerState.bearing,
    [bikerMarkerState.bearing]
  );

  const updateOrderStatus = useCallback((newStatus) => {
    const updatedOrder = { ...orderWithLocations, status: newStatus };
    navigation.setParams({ order: updatedOrder });
    return updatedOrder;
  }, [navigation, orderWithLocations]);

  useEffect(() => {
    const startLocationUpdates = async () => {
      const hasLocationPermission = await requestLocationPermission();

      if (!hasLocationPermission) {
        showSnackbar(t('delivery.locationPermissionRequired'), 'warn');
        return;
      }

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
  }, [t]);


  useEffect(() => {
    if (status === OrderStatus.ORDER_RECEIVED) {
      const timeout = setTimeout(() => {
        showSnackbar(t('delivery.orderPickedUp'), 'warn');
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [status, t]);
  useEffect(() => {
    if (
      status === OrderStatus.ONGOING &&
      currentBikerLocation &&
      dynamicRestaurantLocation
    ) {
      const distance = getDistance(currentBikerLocation, dynamicRestaurantLocation);

      if (distance < 50) {
        updateOrderStatus(OrderStatus.ARRIVED_TO_RESTAURANT);
      }
    }

    if (
      status === OrderStatus.ONGOINGCustomer &&
      currentBikerLocation &&
      dynamicReceiverLocation
    ) {
      const distance = getDistance(currentBikerLocation, dynamicReceiverLocation);

      if (distance < 50) {
        updateOrderStatus(OrderStatus.ARRIVED_TO_CUSTOMER);
      }
    }
  }, [currentBikerLocation, dynamicReceiverLocation, dynamicRestaurantLocation, status, updateOrderStatus]);


  useEffect(() => {
    if (mapReady && currentBikerLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentBikerLocation.latitude,
        longitude: currentBikerLocation.longitude,
        latitudeDelta: currentDelta.latitudeDelta,
        longitudeDelta: currentDelta.longitudeDelta,
      }, 1000);
    }
  }, [currentDelta.latitudeDelta, currentDelta.longitudeDelta, currentBikerLocation, mapReady]);

  const handleReject = () => navigation.goBack();
  const handleAccept = () => setConfirmVisible(true);
  const handleCancel = () => setConfirmVisible(false);

  const handleConfirm = () => {
    if (status === OrderStatus.ARRIVED_TO_CUSTOMER) {
      const updatedOrder = { ...orderWithLocations, status: OrderStatus.CONFIRM_ORDER };
      setCurrentOrder(null);
      navigation.replace(Screen.Other.OrderDetail, { order: updatedOrder, source: 'statusAction' });
    } else {
      updateOrderStatus(OrderStatus.ACCEPTED);
      if (!order?.exactTime) {
        setCurrentOrder(orderWithLocations);
      }
      setConfirmVisible(false);
    }
  };

  const handleStartGo = () => {
    updateOrderStatus(OrderStatus.ONGOING);
    showSnackbar(t('delivery.startRidingTo', { name: restaurantName }), 'success');
  };

  const handleStartDeliveryGo = () => {
    updateOrderStatus(OrderStatus.ONGOINGCustomer);
    showSnackbar(t('delivery.startRidingTo', { name: receiverName }), 'success');
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

  const renderBikerMarker = (coordinate) => (
    <Marker
      coordinate={coordinate}
      title={t('delivery.biker')}
      anchor={{ x: 0.5, y: 0.06 }}
      rotation={bikerRotation}
      flat
    >
      <OverviewBicycleIcon />
    </Marker>
  );

  const renderActionButtons = () => {
    if (status === OrderStatus.PENDING) {
      return (
        <View style={styles.buttonContainer}>
          <ButtonComponent title={t('delivery.reject')} onPress={handleReject} buttonStyle={[styles.buttonStyle, styles.rejectBtn]} textStyle={styles.rejectText} />
          <ButtonComponent title={t('delivery.accept')} onPress={handleAccept} buttonStyle={[styles.buttonStyle, styles.acceptBtn]} />
        </View>
      );
    } else if (status === OrderStatus.ARRIVED_TO_RESTAURANT) {
      return (
        <ButtonComponent title={t('delivery.arrivedAndPickup')} onPress={() => navigation.replace(Screen.Other.OrderDetail, { order: orderWithLocations, source: 'statusAction' })} buttonStyle={styles.goButton} />
      );
    } else if (status === OrderStatus.ORDER_RECEIVED) {
      return <ButtonComponent title={t('delivery.startToDeliveryAddress')} onPress={handleStartDeliveryGo} buttonStyle={styles.goButton} />;
    } else if (status === OrderStatus.ACCEPTED) {
      if (order?.exactTime) {
        return (
          <View style={{ gap: 8, backgroundColor: 'white', margin: 16, padding: 16, borderRadius: 10, flexDirection: 'row' }}>
            <InfoIcon size={20} color={Colors.pendigColor} />
            <Text style={{ textAlign: 'center', fontFamily: Font.Bold }}>{t('delivery.pickupToday', { time: order?.exactTime })}</Text>
          </View>
        );
      }
      return <ButtonComponent title={t('delivery.startGoingNow')} onPress={handleStartGo} buttonStyle={styles.goButton} />;
    } else if (status === OrderStatus.ARRIVED_TO_CUSTOMER) {
      return <ButtonComponent title={t('delivery.arrivedAtDeliveryAddress')} onPress={handleAccept} buttonStyle={styles.goButton} />;
    } else if (status === OrderStatus.CONFIRM_ORDER) {
      return <ButtonComponent title={t('delivery.confirmDelivery')} onPress={() => navigation.replace(Screen.Other.OrderDetail, { order: orderWithLocations, source: 'statusAction' })} buttonStyle={styles.goButton} />;
    } else {
      return <ButtonComponent title={t('delivery.going')} buttonStyle={styles.goButton} disabled />;
    }
  };

  return (
    <BaseContainer contentStyle={styles.container}>
      <HeaderTitleComponent navigation={navigation} title={t('delivery.title')} paddingTop={5} />

      <View style={styles.mapContainer}>
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
          {bikerMarkerState.coordinate && renderBikerMarker(bikerMarkerState.coordinate)}
          {dynamicRestaurantLocation?.latitude && ![OrderStatus.ORDER_RECEIVED, OrderStatus.ARRIVED_TO_CUSTOMER, OrderStatus.CONFIRM_ORDER, OrderStatus.ONGOINGCustomer].includes(status) &&
            renderMarker(dynamicRestaurantLocation, <Utensils size={20} color="#fff" />, t('delivery.restaurant'))}
          {dynamicReceiverLocation?.latitude && renderMarker(dynamicReceiverLocation, <User size={20} color="#fff" />, t('delivery.receiver'))}

          {currentBikerLocation?.latitude && dynamicRestaurantLocation?.latitude && ![OrderStatus.ORDER_RECEIVED, OrderStatus.ARRIVED_TO_CUSTOMER, OrderStatus.CONFIRM_ORDER, OrderStatus.ONGOINGCustomer].includes(status) && (
            <MapViewDirections
              origin={currentBikerLocation}
              destination={dynamicRestaurantLocation}
              apikey={GOOGLE_MAPS_APIKEY}
              mode="WALKING"
              strokeWidth={5}
              strokeColor={Colors.pickUpColor}
              onReady={(result) => {
                setPickUpTime(Math.round(result.duration));
                setPickDistance(result.distance);
                setActiveBikerRouteCoordinates(result.coordinates);
              }}
              resetOnChange={false}
            />
          )}

          {dynamicRestaurantLocation?.latitude && dynamicReceiverLocation?.latitude && ![OrderStatus.ORDER_RECEIVED, OrderStatus.ARRIVED_TO_CUSTOMER, OrderStatus.CONFIRM_ORDER, OrderStatus.ONGOINGCustomer].includes(status) && (
            <MapViewDirections
              origin={dynamicRestaurantLocation}
              destination={dynamicReceiverLocation}
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

          {currentBikerLocation?.latitude && dynamicReceiverLocation?.latitude && [OrderStatus.ORDER_RECEIVED, OrderStatus.ARRIVED_TO_CUSTOMER, OrderStatus.CONFIRM_ORDER, OrderStatus.ONGOINGCustomer].includes(status) && (
            <MapViewDirections
              origin={currentBikerLocation}
              destination={dynamicReceiverLocation}
              apikey={GOOGLE_MAPS_APIKEY}
              mode="WALKING"
              strokeWidth={5}
              strokeColor={Colors.deliverColor}
              onReady={(result) => {
                setDeliveryTime(Math.round(result.duration));
                setDeliverDistance(result.distance);
                setActiveBikerRouteCoordinates(result.coordinates);
              }}
              resetOnChange={false}
            />
          )}
        </MapView>

        {!mapReady && (
          <View style={styles.mapLoadingOverlay} pointerEvents="none">
            <View style={styles.mapLoadingCard}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.mapLoadingText}>{t('delivery.preparingMap')}</Text>
            </View>
          </View>
        )}
      </View>

      <TimelineRowComponent
        fromBikeToRestaurant={pickUpTime}
        fromRestaurantToReceiver={deliveryTime}
        receiverName={receiverName || 'Receiver'}
        restaurantName={restaurantName || 'Restaurant'}
      />

      <View style={styles.infoCard}>
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={styles.label}>{t('delivery.totalDistance')}</Text>
            <Text style={styles.label}>{t('delivery.estimatedEarnings')}</Text>
          </View>
          <View style={styles.centerColumn}>
            <Text style={styles.value}>{totalDistance} km</Text>
            <Text style={[styles.value, styles.bold]}>{deliveryCost} Ks</Text>
          </View>
          <TouchableOpacity style={styles.detailsColumn} onPress={() => navigation.replace(Screen.Other.OrderDetail, { order, source: 'viewDetails' })}>
            <Text style={styles.viewDetails}>{t('delivery.viewDetails')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderActionButtons()}

      <CustomConfirmModal
        visible={confirmVisible}
        titleShow={false}
        message={t('dialogs.acceptPickup', { name: restaurantName })}
        onConfirmText={t('common.yesSure')}
        onConfirm={handleConfirm}
        onCancelText={t('common.no')}
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(236, 236, 236, 0.72)',
  },
  mapLoadingCard: {
    minWidth: 150,
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  mapLoadingText: {
    color: Colors.text,
    fontFamily: Font.Bold,
    fontSize: 14,
  },
  bicycleMarker: {
    width: 32,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
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
