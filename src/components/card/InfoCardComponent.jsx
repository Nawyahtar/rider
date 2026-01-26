import React,{memo} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Font } from '../../styles/Font';

const InfoCardComponent = ({ title, rows = [] }) => {
    console.log("info card")
  return (
    <View style={styles.infoCard}>
      <Text style={styles.name}>{title}</Text>
      {rows.map((row, index) => (
        <View key={row.key || index} style={styles.row}>
          <View style={styles.iconWrapper}>{row.icon}</View>
          <Text style={styles.text}>{row.value}</Text>
          {row.extra}
        </View>
      ))}
    </View>
  );
};

export default memo(InfoCardComponent);

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  name: {
    fontFamily: Font.Bold,
    fontSize: 17,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0efff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontFamily: Font.Regular,
    flexShrink: 1,
  },
});
