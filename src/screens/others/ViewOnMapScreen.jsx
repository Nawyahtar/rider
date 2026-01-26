import React, { useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Phone, MapPin, Utensils } from 'lucide-react-native';
import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import Colors from '../../styles/Color';
import InfoCardComponent from '../../components/card/InfoCardComponent';

const ViewOnMapScreen = ({ navigation, route }) => {
  const { name, phone, address } = route?.params.info;

  const infoRows = useMemo(
    () => [
      {
        key: 'phone',
        icon: <Phone size={18} color={Colors.primary} />,
        value: phone,
      },
      {
        key: 'address',
        icon: <MapPin size={18} color={Colors.primary} />,
        value: address,
      },
    ],
    [],
  );

  const LATITUDE = 16.8409;
  const LONGITUDE = 96.1735;

  return (
    <BaseContainer contentStyle={styles.container}>
      <HeaderTitleComponent
        navigation={navigation}
        title="Map View"
        paddingTop={0}
      />

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: LATITUDE, longitude: LONGITUDE }}
          title={name}
          description="No. 123 Main Street, Yangon"
        >
          <View style={styles.markerIcon}>
            <Utensils size={16} color="#fff" />
          </View>
        </Marker>
      </MapView>

      <InfoCardComponent
        title="Pizza Company – Dagon Center 1"
        rows={infoRows}
      />
    </BaseContainer>
  );
};

export default ViewOnMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screenBackground,
  },
  map: {
    flex: 1,
  },
  markerIcon: {
    backgroundColor: '#444',
    padding: 6,
    borderRadius: 20,
  },
});

 
           
