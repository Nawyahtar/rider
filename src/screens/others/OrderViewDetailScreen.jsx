import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Image,
} from 'react-native';
import {
  Clock,
  HandCoins,
  Info,
  MapPin,
  Phone,
  User,
  Utensils,
} from 'lucide-react-native';

import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import CustomAccordion from '../../components/accordion/CustomAccordion';
import Colors from '../../styles/Color';
import { Font } from '../../styles/Font';
import { Screen } from '../../constant/Screen';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import OrderReceived from "../../assets/images/orderReceive.png"
import OrderConfirm from "../../assets/images/orderConfirm.png"
import CustomConfirmModal from '../../components/modals/CustomConfirmModal';
import ImagePickerBox from '../../components/imagepicker/ImagePickerBox';
import OrderStatus from '../../utils/OrderStatus';
import { LanguageContext } from '../../context/LanguageContext';


const OrderViewDetail = ({ navigation, route }) => {
  const { t } = useContext(LanguageContext);
  const { order, source } = route.params || {};
  const { status, receiverName } = order || {}
  const title = status === OrderStatus.CONFIRM_ORDER ? "Delivery Confirmation" : "Pick Up Confirmation"
  const [selectedOption, setSelectedOption] = useState('Delivered to customer');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const isFromStatusFlow = source === 'statusAction';
  const [imageUri, setImageUri] = useState(null);

  const riderFee = 2000;

  const orderItems = [
    { name: 'Burger', quantity: 2, price: 7000 },
    { name: 'Fries', quantity: 1, price: 5000 },
    { name: 'Soda', quantity: 1, price: 3000 },
    { name: 'Soda', quantity: 2, price: 2500 },
  ];

  const subTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subTotal + riderFee;

  const goBackWithOrder = () => {
    navigation.replace(Screen.Other.NewDeliveryWay, { order });
  };
  useEffect(() => {
    const backAction = () => {
      navigation.replace(Screen.Other.NewDeliveryWay, { order });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // clean up on unmount
  }, [navigation, order]);




  const handleConfirmPickUp = () => {
    const updatedOrder = { ...order, status: "OrderReceived" };
    navigation.replace(Screen.Other.NewDeliveryWay, { order: updatedOrder });
  }
  const handleConfirmDelivery = () => setConfirmVisible(true)
  const handleCancel = () => setConfirmVisible(false);
  const handleConfirm = () => {
    setConfirmVisible(false)
    navigation.navigate(Screen.Other.DeliveryComplete)
  }



  return (
    <BaseContainer contentStyle={styles.container}>
      <HeaderTitleComponent
        title={title}
        navigation={navigation}
        paddingTop={15}
        contentContainer={styles.headerContainer}
        onBackPress={goBackWithOrder}
      />

      <ScrollView showsVerticalScrollIndicator={false}>

        {isFromStatusFlow && status === OrderStatus.ARRIVED_TO_RESTAURANT ? (
          <>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Image
                  source={OrderReceived}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.text}>
                Please check the order items and{"\n"}
                customer information carefully and {"\n"}
                confirm below!
              </Text>
            </View>
            <View style={styles.card}>
              <View style={styles.iconWrapper}>
                <Info color="#F2C94C" size={24} />
              </View>
              <Text style={styles.textTime}>
                Waiting time was added! <Text style={styles.bold}>05:00 mins</Text>
              </Text>
            </View>
          </>
        ) : isFromStatusFlow && status === OrderStatus.CONFIRM_ORDER ? (<>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Image
                source={OrderConfirm} // Use your icon path here
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.text}>
              Please check the order items and{"\n"}
              customer information carefully and {"\n"}
              confirm the delivery below!
            </Text>
          </View>
          <View style={styles.card}>
            <View style={styles.iconWrapper}>
              <Info color="#F2C94C" size={24} />
            </View>
            <Text style={styles.textTime}>
              Waiting time was added! <Text style={styles.bold}>05:00 mins</Text>
            </Text>
          </View></>) : (
          <>
            <View style={styles.timelineWrapper}>
              {[
                {
                  icon: <Utensils size={18} color="#fff" />,
                  title: 'Shwe Myo Daw – Popular Road',
                  time: '5 mins',
                  distance: '0.8 km',
                },
                {
                  icon: <User size={18} color="#fff" />,
                  title: 'Su Su',
                  time: '10 mins',
                  distance: '1.2 km',
                },
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <View style={styles.timelineRow}>
                    <View style={styles.timelineIconWrap}>
                      <View style={styles.timelineIcon}>{step.icon}</View>
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineTitle}>{step.title}</Text>
                      <View style={styles.infoRow}>
                        <Clock size={16} color={Colors.secondaryText} />
                        <Text style={styles.infoSub}>{step.time}</Text>
                        <Text style={styles.dot}>•</Text>
                        <MapPin size={16} color={Colors.secondaryText} />
                        <Text style={styles.infoSub}>{step.distance}</Text>
                      </View>
                    </View>
                  </View>
                  {i === 0 && <View style={styles.verticalLine} />}
                </React.Fragment>
              ))}
            </View>
            {/* Delivery Summary */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryColumn}>
                  <Text style={styles.label}>Total Delivery Time :</Text>
                  <Text style={styles.label}>Total Distance :</Text>
                </View>
                <View style={styles.summaryColumn}>
                  <Text style={styles.value}>15 mins</Text>
                  <Text style={styles.value}>2 km</Text>
                </View>
              </View>
            </View>

          </>
        )}



        {/* Order Items Accordion */}
        <CustomAccordion title="Order Items">
          {orderItems.map((item, index) => (
            <View
              key={index}
              style={[
                styles.itemRow,
                index !== orderItems.length - 1 && { marginBottom: 12 },
              ]}
            >
              <View>
                <Text style={styles.label}>{item.name}</Text>
                <Text style={styles.label}>x{item.quantity}</Text>
              </View>
              <Text style={styles.value}>
                {(item.price * item.quantity).toLocaleString()} Ks
              </Text>
            </View>
          ))}
        </CustomAccordion>

        {/* Subtotal and Total */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryColumn, { gap: 25 }]}>
              <Text style={styles.totalLabel}>Sub-Total</Text>
              <Text style={styles.totalLabel}>Rider Fee</Text>
            </View>
            <View style={[styles.summaryColumn, { alignItems: 'flex-end', gap: 25 }]}>
              <Text style={[styles.totalLabel, { color: Colors.text }]}>
                {subTotal.toLocaleString()} Ks
              </Text>
              <Text style={[styles.totalLabel, { color: Colors.text }]}>
                {riderFee.toLocaleString()} Ks
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{total.toLocaleString()} Ks</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.infoCard}>
          <Text style={styles.restaurantTitle}>Shwe Myo Daw – Popular Road</Text>
          <View style={styles.callRow}>
            <View style={styles.phoneBadge}>
              <Phone size={18} color={Colors.primary} />
            </View>
            <Text style={styles.phoneText}>098766556545</Text>
            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callText}>Call</Text>
            </TouchableOpacity>
          </View>

          {/* Recipient Info */}
          <Text style={styles.recipientTitle}>Recipient Information</Text>
          <View style={styles.recipientInfoContainer}>
            {[
              { label: 'Customer Name', value: 'Su Su' },
              { label: 'Phone Number', value: '09987776543' },
              {
                label: 'Delivery Address',
                value: 'No. 43, Popular Condo T7, Popular Road, Pakkret, Nonthaburi.',
              },
            ].map((info, index) => (
              <View
                key={index}
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <Text style={styles.infoLabel}>{info.label}</Text>
                <Text style={styles.infoValue} numberOfLines={3}>
                  {info.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
        {isFromStatusFlow && status === "ConfirmOrder" && (
          <View style={styles.deliveryConfirmSection}>
            <Text style={styles.recipientTitle}>Confirm Delivered Photo</Text>
            <ImagePickerBox onImagePicked={(image) => {
              console.log('Picked Image:', image);
            }} />
            {/* Selectable Options */}
            {['Delivered to customer', 'Left at door'].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioRow}
                onPress={() => setSelectedOption(option)}
              >
                <View
                  style={[
                    styles.radioOuter,
                    selectedOption === option && styles.radioOuterSelected,
                  ]}
                >
                  {selectedOption === option && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>
      {isFromStatusFlow && status === OrderStatus.ARRIVED_TO_RESTAURANT && (
        <ButtonComponent
          title="Confirm Pick Up"
          onPress={handleConfirmPickUp}
          buttonStyle={{ marginHorizontal: 16, height: 50 }}
        />
      )}
      {isFromStatusFlow && status === OrderStatus.CONFIRM_ORDER && (
        <ButtonComponent
          title="Confirm Delivery"
          onPress={handleConfirmDelivery}
          buttonStyle={{ marginHorizontal: 16, height: 50 }}
        />
      )}

      <CustomConfirmModal
        visible={confirmVisible}
        titleShow={false}
        message={t('dialogs.acceptPickup', { name: receiverName })}
        onConfirmText={t('common.yesSure')}
        onConfirm={handleConfirm}
        onCancelText={t('common.no')}
        onCancel={handleCancel}
        confirmButtonStyle={styles.confirmButton}
        cancelButtonStyle={styles.cancelButton}
      />

    </BaseContainer>
  );
};
export default OrderViewDetail;




const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    backgroundColor: Colors.screenBackground,
  },
  headerContainer: {
    backgroundColor: Colors.background,
  },
  timelineWrapper: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineIconWrap: {
    width: 40,
    alignItems: 'center',
  },
  timelineIcon: {
    width: 48,
    height: 48,
    borderRadius: 25,
    backgroundColor: Colors.iconGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 70,
    padding: 24,
  },
  iconCircle: {
    backgroundColor: '#DCEBFF',
    borderRadius: 64,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 120,
    height: 120,
    tintColor: '#2F80ED',
  },
  text: {
    marginTop: 18,
    textAlign: 'center',
    fontFamily: Font.Medium,
    fontWeight: '500',
    fontSize: 18,
    color: Colors.text,
    lineHeight: 30,
  },
  verticalLine: {
    width: 8,
    height: 40,
    marginLeft: 16,
    borderRadius: 5,
    backgroundColor: Colors.deliverColor,
    marginVertical: 5,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 20,
  },
  timelineTitle: {
    fontSize: 16,
    fontFamily: Font.Medium,
    color: Colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoSub: {
    fontSize: 12,
    marginLeft: 4,
    marginRight: 6,
    color: Colors.secondaryText,
    fontFamily: Font.Regular,
  },
  dot: {
    marginHorizontal: 4,
    fontSize: 12,
    color: '#aaa',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  summaryColumn: {
    flex: 1,
    gap: 15,
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '400',
    fontFamily: Font.Regular,
  },
  totalLabel: {
    fontSize: 16,
    color: Colors.secondaryText,
    fontWeight: '700',
    fontFamily: Font.Bold,
  },
  value: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '700',
    fontFamily: Font.Bold,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.dividerColor,
    marginVertical: 25,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 21,
    fontWeight: 'bold',
    color: Colors.primary,
    fontFamily: Font.Bold,
  },
  infoCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  restaurantTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Font.Bold,
    color: Colors.text,
    marginBottom: 10,
  },
  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  phoneBadge: {
    width: 40,
    height: 40,
    backgroundColor: Colors.primary20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneText: {
    fontSize: 16,
    fontFamily: Font.Regular,
    fontWeight: '400',
    color: Colors.text,
    flex: 1,
  },
  callButton: {
    paddingHorizontal: 45,
    paddingVertical: 12,
    backgroundColor: Colors.primary20,
    borderRadius: 20,
  },
  callText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  recipientTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Font.Bold,
    color: Colors.text,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: Font.Bold,
    color: Colors.secondaryText,
    fontWeight: '600',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: Font.Regular,
    color: Colors.text,
    flex: 1.2,
  },
  recipientInfoContainer: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2, // for Android
    shadowColor: '#000', // for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconWrapper: {
    marginRight: 12,
    padding: 4,
  },
  textTime: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
  bold: {
    fontWeight: '700',
    color: '#111',
  },
  deliveryConfirmSection: {
    padding: 16,
    margin: 16,
    borderRadius: 10,
  },
  uploadBox: {
    height: 188,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadText: {
    color: Colors.secondaryText,
    fontSize: 18,
    fontFamily: Font.Bold,
    fontWeight: '700'
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: Colors.radioText,
    fontFamily: Font.Regular,
    fontWeight: '400'
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

});
