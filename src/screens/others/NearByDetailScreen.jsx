import React, { useCallback, useContext, useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Phone, MapPin } from 'lucide-react-native';

import Colors from '../../styles/Color';
import BaseContainer from '../../components/BaseContainer';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import { Font } from '../../styles/Font';
import CustomConfirmModal from '../../components/modals/CustomConfirmModal';
import CustomSnackbar from '../../components/sanckbar/CustomSnackBar';
import ImageCarousel from '../../components/carousel/ImageCarousel';
import { Screen } from '../../constant/Screen';
import InfoCardComponent from '../../components/card/InfoCardComponent';
import { LanguageContext } from '../../context/LanguageContext';

const LEFT_DAYS = ['Monday', 'Wednesday', 'Friday', 'Sunday'];
const RIGHT_DAYS = ['Tuesday', 'Thursday', 'Saturday'];

const NearByDetailScreen = ({ navigation }) => {
  const { t } = useContext(LanguageContext);
  const { params } = useRoute();
  const restaurant = params?.restaurant;

  const [visible, setVisible] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [type, setType] = useState('success');
  const [message, setMessage] = useState('');

  const { name, phone, address, hours, image, status = '' } = restaurant || {};

  const infoRows = useMemo(
    () => [
      {
        icon: <Phone size={18} color={Colors.primary} />,
        value: phone,
      },
      {
        icon: <MapPin size={18} color={Colors.primary} />,
        value: address,
        extra: (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(Screen.Other.ViewOnMap, {
                info: {
                  name: name,
                  phone: phone,
                  address: address,
                },
              })
            }
          >
            <Text style={styles.link}>View on map</Text>
          </TouchableOpacity>
        ),
      },
    ],
    [address, name, navigation, phone],
  );

  const isPendingOrSuccess = useMemo(
    () => ['pending', 'success'].includes(status.toLowerCase()),
    [status],
  );

  const handleDismissSnackbar = useCallback(() => {
    setSnackVisible(false);
  }, []);

  const handleApply = () => setVisible(true);
  const handleCancel = () => setVisible(false);

  const handleConfirm = () => {
    navigation.setParams({
      restaurant: {
        ...restaurant,
        status: 'success',
      },
    });
    showSnackbar('You have been applied as a Rider now!', 'success');
  };

  const showSnackbar = (msg, type = 'info') => {
    setVisible(false);
    setMessage(msg);
    setType(type);
    setSnackVisible(true);
  };

  if (!restaurant) return null;
  const renderHoursColumn = days => (
    <View style={styles.column}>
      {days.map(day => (
        <View key={day} style={styles.dayTimeRow}>
          <Text style={styles.day}>{day}</Text>
          <Text style={styles.time}>{hours?.[day]}</Text>
        </View>
      ))}
    </View>
  );

  const renderStatusSection = () => {
    if (status === 'success') {
      return (
        <>
          <Text style={styles.statusTitle}>Status</Text>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: Colors.successColor },
            ]}
          >
            <Text style={styles.statusPillText}>APPLIED NOW</Text>
          </View>
          <Text style={styles.statusNote}>
            Note: You’re now available for the deliveries.
          </Text>
        </>
      );
    } else if (status === 'pending') {
      return (
        <>
          <Text style={styles.statusTitle}>Status</Text>

          <View
            style={[styles.statusPill, { backgroundColor: Colors.pendigColor }]}
          >
            <Text style={styles.statusPillText}>PENDING</Text>
          </View>
          <Text style={styles.statusNote}>
            Note: You have been applied as a Rider now and the shop/restaurant
            will check and approve within 1 to 2 business days.
          </Text>
        </>
      );
    } else {
      return (
        <ButtonComponent
          title="Apply Now"
          onPress={handleApply}
          contentContainer={{ marginTop: 8 }}
        />
      );
    }
  };

  return (
    <BaseContainer contentStyle={styles.container}>
      <HeaderTitleComponent
        navigation={navigation}
        title="Details"
        paddingTop={0}
      />
      <ScrollView>
        <ImageCarousel images={Array.isArray(image) ? image : [image]} />
        <InfoCardComponent title={name} rows={infoRows} />

        <View style={styles.hoursBox}>
          <Text style={styles.sectionTitle}>Opening Hours</Text>
          <View style={styles.hoursGrid}>
            {renderHoursColumn(LEFT_DAYS)}
            {renderHoursColumn(RIGHT_DAYS)}
          </View>
        </View>

        <View style={styles.statusContainer}>
          {isPendingOrSuccess && (
            <>
              <Text style={styles.statusTitle}>Rider Instructions</Text>
              <Text style={styles.statusInstruction}>
                Pickup at the back entrance. Parking available on the side
                street. Average order prep time: 15–20 minutes.
              </Text>
            </>
          )}
          {renderStatusSection()}
        </View>

        <CustomConfirmModal
          visible={visible}
          titleShow={false}
          message={t('dialogs.applyAsRider', { name })}
          onConfirmText={t('common.yesSure')}
          onConfirm={handleConfirm}
          onCancelText={t('common.no')}
          onCancel={handleCancel}
          confirmButtonStyle={styles.confirmButton}
          cancelButtonStyle={styles.cancelButton}
        />

        <CustomSnackbar
          visible={snackVisible}
          message={message}
          type={type}
          onDismiss={handleDismissSnackbar}
        />
      </ScrollView>
    </BaseContainer>
  );
};

export default NearByDetailScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.screenBackground,
  },
  image: {
    width: '100%',
    height: 218,
  },

  link: {
    fontFamily: Font.Bold,
    color: Colors.primary,
    fontSize: 16,
    marginLeft: 70,
  },
  hoursBox: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: Font.Bold,
    fontSize: 16,
    marginBottom: 12,
  },
  hoursGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  dayTimeRow: {
    marginBottom: 14,
  },
  day: {
    fontFamily: Font.Regular,
    fontSize: 14,
    color: Colors.secondaryText,
  },
  time: {
    fontFamily: Font.Regular,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
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
  statusContainer: {
    paddingVertical: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 15,
  },
  statusTitle: {
    fontFamily: Font.Bold,
    fontSize: 16,
    color: '#111',
    marginBottom: 8,
  },
  statusInstruction: {
    fontFamily: Font.Regular,
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
    lineHeight: 20,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusPillText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Font.Bold,
  },
  statusNote: {
    fontFamily: Font.Regular,
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    lineHeight: 20,
  },
});
