import React, { useContext, useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, Animated, Easing, TouchableOpacity } from 'react-native'
import { ArrowRight, Navigation, User, Utensils, Bike } from 'lucide-react-native'
import { Font } from '../../styles/Font'
import Colors from '../../styles/Color'
import { OrderContext } from '../../context/OrderContext'
import Geolocation from '@react-native-community/geolocation'
import { useNavigation } from '@react-navigation/native'
import { Screen } from '../../constant/Screen'

const DOT_SIZE = 15
const BIKE_SIZE = 20

const toRad = (v) => (v * Math.PI) / 180
const haversine = (a, b) => {
  if (!a || !b) return 0
  const R = 6371000
  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
const clamp01 = (x) => Math.max(0, Math.min(1, x))

const CurrentOrderBar = () => {
  const navigation = useNavigation()
  const { currentOrder } = useContext(OrderContext)
  const { restaurantLocation, receiverLocation } = currentOrder || {}

  const [trackWidth, setTrackWidth] = useState(0)
  const progress = useRef(new Animated.Value(0)).current
  const startRef = useRef(null)         // initial biker location (fixed as route start)
  const watchIdRef = useRef(null)

  // Bike X over the full path: first → last dot
  const segmentWidth = Math.max(0, trackWidth - DOT_SIZE)
  const bikeTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, segmentWidth],
  })

  // Compute progress based on current GPS against: start → restaurant → receiver
  const updateProgressFromLocation = (current) => {
    if (!restaurantLocation || !receiverLocation || !startRef.current) return

    const start = startRef.current
    const seg1Total = haversine(start, restaurantLocation)
    const seg2Total = haversine(restaurantLocation, receiverLocation)
    const total = Math.max(1, seg1Total + seg2Total)

    const distToRestaurant = haversine(current, restaurantLocation)
    const distToReceiver = haversine(current, receiverLocation)

    let completed
    if (distToRestaurant <= distToReceiver) {
      // Before pickup: completed increases as biker gets closer to the restaurant
      completed = Math.max(0, seg1Total - distToRestaurant)
    } else {
      // After pickup: completed includes seg1 plus progress on seg2
      completed = seg1Total + Math.max(0, seg2Total - distToReceiver)
    }

    const pct = clamp01(completed / total)

    Animated.timing(progress, {
      toValue: pct,                 // moves forward if closer, backward if further
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        if (!startRef.current) startRef.current = { latitude, longitude } // set once
        updateProgressFromLocation({ latitude, longitude })
        watchIdRef.current = Geolocation.watchPosition(
          (p) => {
            const { latitude: lat, longitude: lon } = p.coords
            updateProgressFromLocation({ latitude: lat, longitude: lon })
          },
          (err) => console.warn('GPS error:', err),
          {
            enableHighAccuracy: true,
            distanceFilter: 5,  // move at least 5m to trigger
            interval: 3000,
            fastestInterval: 1500,
          }
        )
      },
      (err) => console.warn('getCurrentPosition error:', err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    )

    return () => {
      if (watchIdRef.current != null) Geolocation.clearWatch(watchIdRef.current)
    }
  }, [restaurantLocation, receiverLocation])

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.text}>On the way to Su Su</Text>
          <Text style={styles.text}>Delivering within 10 mins</Text>
        </View>
        <TouchableOpacity onPress={() =>
          navigation.navigate(Screen.Other.NewDeliveryWay, { order: currentOrder })} >
          <ArrowRight size={20} color="#000" />

        </TouchableOpacity>
      </View>

      {/* Progress Line */}
      <View style={{ marginVertical: 10 }}>
        <View
          style={styles.trackContainer}
          onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        >
          {/* Base line */}
          <View style={styles.fullLine} />

          {/* Bike: starts at first dot, moves to last dot */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.bikeWrap,
              { left: DOT_SIZE / 2 - BIKE_SIZE / 2, transform: [{ translateX: bikeTranslateX }] },
            ]}
          >
            <Bike size={BIKE_SIZE} color="#3B4F64" />
          </Animated.View>

          {/* Dots */}
          <View style={styles.dotsRow}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Labels */}
        <View style={styles.labelsRow}>
          <User size={16} />
          <Utensils size={16} />
          <Navigation size={16} />
        </View>
      </View>
    </View>
  )
}

export default CurrentOrderBar

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, borderTopRightRadius: 20, borderTopLeftRadius: 20 },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 10, marginHorizontal: 20,
  },
  text: { fontFamily: Font.Bold, fontSize: 16, fontWeight: '700' },
  trackContainer: { marginHorizontal: 24, height: 32, justifyContent: 'center' },
  fullLine: {
    position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: Colors.surface,
    top: '50%', marginTop: -1,
  },
  bikeWrap: { position: 'absolute', top: '10%', marginTop: -BIKE_SIZE / 2 },
  dotsRow: { justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' },
  labelsRow: { justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 20, marginTop: 8 },
  dot: { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2, backgroundColor: '#3B4F64' },
})