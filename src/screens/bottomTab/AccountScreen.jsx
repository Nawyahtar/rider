import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import Colors from '../../styles/Color';
import { Font } from '../../styles/Font';
import { LogOut } from 'lucide-react-native';
import SwitchToggle from 'react-native-switch-toggle';

const AccountScreen = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);

  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <BaseContainer contentStyle={{ backgroundColor: Colors.screenBackground }}>
      <HeaderTitleComponent
        navigation={navigation}
        showBackIcon={false}
        title="My Profile"
        contentContainer={styles.headerContainer}
        paddingTop={10}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar + Name */}
        <View style={styles.centered}>
          <Image
            source={require('../../assets/images/profileImageAvatar.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>Ethan Carter</Text>
          <Text style={styles.sub}>Rider ID: 123456</Text>
        </View>

        {/* Personal Info */}
        <Section title="Personal Information" onEdit={() => { }}>
          <InfoRow label="Name" value="Ethan Carter" />
          <InfoRow label="Phone Number" value="+959 (973) 345–780" />
          <InfoRow label="Email" value="ethan.carter@example.com" />
        </Section>

        {/* Vehicle Details */}
        <Section title="Vehicle Details" onEdit={() => { }}>
          <InfoRow label="Vehicle Type" value="Bike" />
          <InfoRow label="License Plate" value="ABC-123" />
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <SwitchRow
            label="Push Notifications"
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
          <SwitchRow
            label="Email Notifications"
            value={emailEnabled}
            onValueChange={setEmailEnabled}
          />
        </Section>

        {/* App Settings */}
        <Section title="App Settings">
          <InfoRow label="Language" value="English" />
          <InfoRow label="Theme" value="Light" />
        </Section>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOut} onPress={signOut}>
          <Text style={styles.signOutText}>Sign out account</Text>
          <LogOut size={16} color={Colors.error} />
        </TouchableOpacity>
      </ScrollView>

    </BaseContainer>
  );
};

const Section = ({ title, children, onEdit }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onEdit && (
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.edit}>Edit {title.includes('Vehicle') ? 'Info' : 'Profile'}</Text>
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.sectionBox}>{children}</View>
  </View>
);

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const SwitchRow = ({ label, value, onValueChange }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <SwitchToggle
      switchOn={value}
      onPress={() => onValueChange(!value)}
      containerStyle={styles.toggleContainer}
      circleStyle={styles.toggleCircle}
      backgroundColorOn={Colors.primary}
      backgroundColorOff="#ccc"
      circleColorOff="#fff"
      circleColorOn="#fff"
    />
  </View>
);

export default AccountScreen;

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    marginVertical: 16,
  },
  headerContainer: { backgroundColor: Colors.background },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 22,
    fontFamily: Font.Bold,
    fontWeight: '700',
    marginTop: 8,
    color: Colors.text,
  },
  sub: {
    fontSize: 16,
    color: Colors.secondaryText,
    fontFamily: Font.Regular,
    fontWeight: '400',
    marginTop: 2,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sectionTitle: {
    fontFamily: Font.Bold,
    fontWeight: '700',
    fontSize: 16,
    color: Colors.text,
  },
  edit: {
    fontSize: 16,
    fontFamily: Font.Bold,
    color: Colors.primary,
    fontWeight: '700',
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: Font.Regular,
    textAlignVertical: 'center',
    fontWeight: '400',
    color: Colors.text,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: Font.Regular,
    color: Colors.secondaryText,
    fontWeight: '400',
  },
  signOut: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 6,
  },
  signOutText: {
    color: Colors.error,
    fontWeight: '600',
    fontSize: 14,
  },
  toggleContainer: {
    width: 50,
    height: 30,
    borderRadius: 25,
    padding: 5,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});
