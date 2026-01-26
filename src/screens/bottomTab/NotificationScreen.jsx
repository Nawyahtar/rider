import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import { CheckCircle, BellRing, CircleAlert } from 'lucide-react-native';
import Colors from '../../styles/Color';
import moment from 'moment';
import { Font } from '../../styles/Font';

const rawNotifications = [
  {
    id: '1',
    type: 'new',
    title: 'New Delivery Request',
    from: 'ABC Restaurant',
    time: '11:27 AM',
    message: 'Pick-up by 11:45 AM',
    date: '07/29/2025',
    read: false,
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Reminder',
    from: 'Taco Casa',
    message: 'Hurry Up! You have to pick-up by 11:30 PM!',
    time: '11:21 AM',
    date: '07/29/2025',
    read: true,
  },
  {
    id: '3',
    type: 'success',
    title: 'Successful Delivery',
    from: 'Java Coffee',
    to: 'Su Su',
    message: 'Delivered at 12:15 PM',
    time: '10:55 AM',
    date: '07/29/2025',
    read: true, // Read notification
  },
  {
    id: '4',
    type: 'new',
    title: 'New Delivery Request',
    from: 'Pizza Place',
    time: '10:42 AM',
    message: 'Pick-up by 12:30 PM',
    date: '07/28/2025',
    read: false, // New notification
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Shift Reminder',
    from: 'Scheduler Bot',
    message: 'Don’t forget your shift at 4:00 PM',
    time: '09:30 AM',
    date: '07/28/2025',
    read: true, // Read notification
  },
  {
    id: '6',
    type: 'success',
    title: 'Delivery Completed',
    from: 'Coffee Beans',
    to: 'Aye Aye',
    message: 'Delivered at 1:30 PM',
    time: '09:00 AM',
    date: '07/28/2025',
    read: false, // New notification
  },
  {
    id: '7',
    type: 'success',
    title: 'Successful Delivery',
    from: 'Thitsar Shop',
    to: 'Kyaw Gyi',
    message: 'Delivered at 12:20 PM',
    time: '9:55 AM',
    date: '07/25/2025',
    read: true, // Read notification
  },
  {
    id: '8',
    type: 'new',
    title: 'New Delivery Request',
    from: 'Shwe Myanmar Foods',
    time: '9:30 AM',
    message: 'Pick-up by 10:00 AM',
    date: '07/25/2025',
    read: false, // New notification
  },
  {
    id: '9',
    type: 'reminder',
    title: 'Fuel Reminder',
    from: 'System',
    message: 'Low fuel detected – refill before next delivery',
    time: '8:45 AM',
    date: '07/25/2025',
    read: true, // Read notification
  },
];

// 🔧 Group notifications by readable date label
const groupNotificationsByDate = (notifications) => {
  const today = moment().format('MM/DD/YYYY');
  const yesterday = moment().subtract(1, 'day').format('MM/DD/YYYY');

  const grouped = {};

  notifications.forEach((noti) => {
    const label =
      noti.date === today
        ? 'Today'
        : noti.date === yesterday
          ? 'Yesterday'
          : moment(noti.date, 'MM/DD/YYYY').format('D MMM YYYY');

    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(noti);
  });

  return grouped;
};

const getIconByType = (type) => {
  switch (type) {
    case 'new':
      return <BellRing color={Colors.primary} size={30} />;
    case 'reminder':
      return <CircleAlert color={Colors.pendigColor} size={30} />;
    case 'success':
      return <CheckCircle color={Colors.successColor} size={30} />;
    default:
      return null;
  }
};
const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(rawNotifications);

  const groupedNotifications = groupNotificationsByDate(notifications);

  const markGroupAsRead = (label) => {
    const today = moment().format('MM/DD/YYYY');
    const yesterday = moment().subtract(1, 'day').format('MM/DD/YYYY');

    const resolvedDate =
      label === 'Today'
        ? today
        : label === 'Yesterday'
          ? yesterday
          : moment(label, 'D MMM YYYY').format('MM/DD/YYYY');

    const updated = notifications.map((noti) =>
      noti.date === resolvedDate ? { ...noti, read: true } : noti
    );

    setNotifications(updated);
  };

  const renderNotificationCard = (item) => (
    <View
      key={item.id}
      style={[
        styles.card,
        item.read && { backgroundColor: Colors.surface }, // read style
      ]}
    >
      <View style={styles.iconContainer}>{getIconByType(item.type)}</View>
      <View style={{ flex: 1, gap: 8 }}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.senderRow}>
          <Text style={styles.fromText}>
            From: <Text style={styles.fromSub}>{item.from}</Text>
          </Text>
          {item.to && (
            <Text style={styles.fromText}>
              To: <Text style={styles.fromSub}>{item.to}</Text>
            </Text>
          )}
        </View>
        {item.message && <Text style={styles.subText}>{item.message}</Text>}
      </View>
    </View>
  );

  return (
    <BaseContainer contentStyle={{ backgroundColor: Colors.screenBackground }}>
      <HeaderTitleComponent
        title="Notifications"
        navigation={navigation}
        showBackIcon={false}
        contentContainer={styles.headerContainer}
        paddingTop={10}
      />

      <FlatList
        data={Object.entries(groupedNotifications)}
        keyExtractor={([section]) => section}
        renderItem={({ item: [section, items] }) => (
          <View key={section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>{section}</Text>
              <TouchableOpacity onPress={() => markGroupAsRead(section)}>
                <Text style={styles.markAll}>Mark all as read</Text>
              </TouchableOpacity>
            </View>
            {items.map(renderNotificationCard)}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
      />
    </BaseContainer>
  );
};


export default NotificationScreen;

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 6,
  },
  headerContainer: { backgroundColor: Colors.background },
  sectionHeader: {
    fontSize: 14,
    fontFamily: Font.Bold,
    fontWeight: '700',
    color: Colors.text,
  },
  markAll: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Font.Bold,
    color: Colors.primary,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: '#eee',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontWeight: '700',
    fontFamily: Font.Bold,
    fontSize: 16,
    color: Colors.text,
  },
  fromText: {
    fontWeight: '700',
    fontFamily: Font.Bold,
    fontSize: 16,
    color: Colors.text,
  },
  fromSub: {
    fontWeight: '400',
    fontFamily: Font.Regular,
    color: Colors.secondaryText,
  },
  subText: {
    fontSize: 13,
    fontFamily: Font.Italic,
    color: Colors.secondaryText,
    fontStyle: 'italic',
  },
  time: {
    fontSize: 14,
    fontFamily: Font.Regular,
    fontWeight: '400',
    color: Colors.text,
  },
});
