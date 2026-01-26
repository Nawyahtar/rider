import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock4, MapPin, ArrowRight, Utensils } from 'lucide-react-native';
import Colors from '../../styles/Color';
import { Screen } from '../../constant/Screen';

const OrderCard = ({ item, showNew = true, navigation }) => {
  console.log('order card');
  return (
    <TouchableOpacity style={styles.card} onPress={() => {
      if (item.completed) return;
      navigation.navigate(Screen.Other.NewDeliveryWay, {
        order: item
      })
    }}>
      <View style={styles.rowTop}>
        {/* Icon Left */}
        <View style={styles.iconCircle}>
          <Utensils size={18} color="#000" />
        </View>

        {/* Title & Meta */}
        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
            height: 75,
            justifyContent: 'space-between',
          }}
        >
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.metaRow}>
            <Clock4 size={14} color="#666" />
            <Text style={styles.metaText}>{item.time}</Text>
            <MapPin size={14} color="#666" style={{ marginLeft: 12 }} />
            <Text style={styles.metaText}>{item.distance}</Text>
          </View>
          <Text style={styles.price}>{item.price}</Text>
        </View>

        {/* New tag & arrow */}
        <View style={[styles.rightColumn, { justifyContent: (showNew || item.exactTime) ? "space-between" : 'flex-end' }]}>
          {showNew && (<Text style={styles.newTag}>New</Text>)}
          {item.exactTime && (<Text style={[styles.newTag, { color: Colors.text, backgroundColor: Colors.pendigColor }]}>{item.exactTime}</Text>)}
          <ArrowRight size={18} color={Colors.primary} />
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />
    </TouchableOpacity>
  );
};

export default memo(OrderCard);

const styles = StyleSheet.create({
  card: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  price: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '600',
  },
  rightColumn: {
    alignItems: 'flex-end',
    height: 75,
  },
  newTag: {
    fontSize: 11,
    backgroundColor: Colors.newTextBackground,
    color: '#fff',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 12,
  },
});
