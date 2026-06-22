import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import Colors from '../../styles/Color';
import { Font } from '../../styles/Font';
import { Check, ChevronRight, Globe2, LogOut, X } from 'lucide-react-native';
import SwitchToggle from 'react-native-switch-toggle';
import { LanguageContext } from '../../context/LanguageContext';
import { translations } from '../../localization/translations';

const AccountScreen = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  const { language, languages, setLanguage, t } = useContext(LanguageContext);

  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const selectLanguage = nextLanguage => {
    setLanguage(nextLanguage);
    setLanguageModalVisible(false);
  };

  return (
    <BaseContainer contentStyle={{ backgroundColor: Colors.screenBackground }}>
      <HeaderTitleComponent
        navigation={navigation}
        showBackIcon={false}
        title={t('account.title')}
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
          <Text style={styles.sub}>{t('account.riderId')}: 123456</Text>
        </View>

        <Section title={t('account.personalInformation')} editLabel={t('account.editProfile')} onEdit={() => { }}>
          <InfoRow label={t('account.name')} value="Ethan Carter" />
          <InfoRow label={t('account.phoneNumber')} value="+959 (973) 345–780" />
          <InfoRow label={t('account.email')} value="ethan.carter@example.com" />
        </Section>

        <Section title={t('account.vehicleDetails')} editLabel={t('account.editInfo')} onEdit={() => { }}>
          <InfoRow label={t('account.vehicleType')} value={t('account.bike')} />
          <InfoRow label={t('account.licensePlate')} value="ABC-123" />
        </Section>

        <Section title={t('account.notifications')}>
          <SwitchRow
            label={t('account.pushNotifications')}
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
          <SwitchRow
            label={t('account.emailNotifications')}
            value={emailEnabled}
            onValueChange={setEmailEnabled}
          />
        </Section>

        <Section title={t('account.appSettings')}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('account.language')}
            style={styles.languageRow}
            onPress={() => setLanguageModalVisible(true)}
          >
            <View style={styles.languageLabelGroup}>
              <Globe2 size={20} color={Colors.primary} />
              <Text style={styles.infoLabel}>{t('account.language')}</Text>
            </View>
            <View style={styles.languageValueGroup}>
              <Text style={styles.infoValue}>{translations[language].languageName}</Text>
              <ChevronRight size={18} color={Colors.secondaryText} />
            </View>
          </TouchableOpacity>
          <InfoRow label={t('account.theme')} value={t('account.light')} />
        </Section>

        <TouchableOpacity style={styles.signOut} onPress={signOut}>
          <Text style={styles.signOutText}>{t('account.signOut')}</Text>
          <LogOut size={16} color={Colors.error} />
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            activeOpacity={1}
            style={StyleSheet.absoluteFill}
            onPress={() => setLanguageModalVisible(false)}
          />
          <View style={styles.languageModal}>
            <View style={styles.languageModalHeader}>
              <Text style={styles.languageModalTitle}>{t('account.chooseLanguage')}</Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={t('account.cancel')}
                style={styles.closeButton}
                onPress={() => setLanguageModalVisible(false)}
              >
                <X size={22} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {languages.map(item => {
              const selected = item === language;

              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.languageOption, selected && styles.languageOptionSelected]}
                  onPress={() => selectLanguage(item)}
                >
                  <Text style={[styles.languageOptionText, selected && styles.languageOptionTextSelected]}>
                    {translations[item].languageName}
                  </Text>
                  {selected && <Check size={20} color={Colors.primary} strokeWidth={2.5} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </BaseContainer>
  );
};

const Section = ({ title, children, editLabel, onEdit }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onEdit && (
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.edit}>{editLabel}</Text>
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
    alignItems: 'center',
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
    flexShrink: 1,
    textAlign: 'right',
  },
  languageRow: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    fontFamily: Font.SemiBold,
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
  modalBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  languageModal: {
    width: '100%',
    maxWidth: 420,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.background,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  languageModalHeader: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  languageModalTitle: {
    flex: 1,
    color: Colors.text,
    fontFamily: Font.Bold,
    fontSize: 18,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageOption: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  languageOptionSelected: {
    backgroundColor: Colors.primary20,
  },
  languageOptionText: {
    color: Colors.text,
    fontFamily: Font.Regular,
    fontSize: 16,
  },
  languageOptionTextSelected: {
    color: Colors.primary,
    fontFamily: Font.Bold,
  },
});
