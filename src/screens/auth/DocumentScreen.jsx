import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  Image,
} from 'react-native';
import * as DocumentPicker from '@react-native-documents/picker';
import BaseContainer from '../../components/BaseContainer';
import HeaderTitleComponent from '../../components/HeaderTitleComponent';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import CustomConfirmModal from '../../components/modals/CustomConfirmModal';
import { RegisterContext } from '../../context/RegisterContext';
import { Screen } from '../../constant/Screen';
import { Images } from 'lucide-react-native';
import { LanguageContext } from '../../context/LanguageContext';

const documents = [
  {
    id: 'driver_license',
    labelKey: 'documents.driverLicense',
    description: "Upload a clear photo of your driver's license",
  },
  {
    id: 'vehicle_registration',
    labelKey: 'documents.vehicleRegistration',
    description: 'Upload a clear photo of your vehicle registration',
  },
  {
    id: 'vehicle_photo',
    labelKey: 'documents.vehiclePhoto',
    description: 'Upload a clear photo of your vehicle',
  },
  {
    id: 'police_recommendation',
    labelKey: 'documents.policeRecommendation',
    description: 'Upload a clear photo of your police recommendation',
  },
  {
    id: 'insurance_certificate',
    labelKey: 'documents.insuranceCertificate',
    description: 'Upload a clear photo of your insurance certificate',
  },
];

const FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
];

const DocumentScreen = ({ navigation }) => {
  const { registerData, updateStepData, resetRegisterData } =
    useContext(RegisterContext);
  const { t } = useContext(LanguageContext);
  const [uploaded, setUploaded] = useState({});
  const [confirmModal, setConfirmModal] = useState(false);
  const [alertModal, setAlertModal] = useState({ visible: false, message: '' });
  const [docToRemove, setDocToRemove] = useState(null);

  // Set initial uploaded documents
  useEffect(() => {
    const current = registerData?.document || {};
    setUploaded(current);
  }, [registerData?.document]);

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: t('dialogs.storagePermissionTitle'),
          message: t('dialogs.storagePermissionMessage'),
          buttonNeutral: t('dialogs.askLater'),
          buttonNegative: t('common.cancel'),
          buttonPositive: t('common.ok'),
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleUpload = async id => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      return setAlertModal({
        visible: true,
        message: t('dialogs.filePermissionDenied'),
      });
    }

    try {
      const res = await DocumentPicker.pick({
        allowMultiSelection: false,
        type: FILE_TYPES,
      });

      if (res?.length > 0) {
        const file = res[0];

        const updated = {
          ...uploaded,
          [id]: {
            name: file.name,
            uri: file.uri,
            type: file.type,
          },
        };

        updateStepData('document', updated);
        setUploaded(updated);
      }
    } catch (err) {
      const message = err?.message?.toLowerCase();
      if (!message?.includes('cancel')) {
        console.error('Upload error:', err);
        setAlertModal({
          visible: true,
          message: t('dialogs.uploadFailed'),
        });
      }
    }
  };

  const openRemoveModal = id => {
    setDocToRemove(id);
    setConfirmModal(true);
  };

  const confirmRemove = () => {
    const updatedUploaded = { ...uploaded };
    delete updatedUploaded[docToRemove];

    // Update context as well
    const updatedDocument = { ...registerData.document };
    delete updatedDocument[docToRemove];

    setUploaded(updatedUploaded);
    updateStepData('document', updatedDocument);
    setDocToRemove(null);
    setConfirmModal(false);
  };

  const handleNext = () => {
    const docs = uploaded;
    const missing = documents.filter(doc => !docs[doc.id]?.uri?.trim());

    if (missing.length > 0) {
      return setAlertModal({
        visible: true,
        message: t('dialogs.uploadFollowing', {
          documents: missing.map(doc => `• ${t(doc.labelKey)}`).join('\n'),
        }),
      });
    }

    console.log('All steps combined:', {
      ...registerData.info,
      ...registerData.step2,
      document: uploaded,
    });

    navigation.reset({
      index: 0,
      routes: [
        {
          name: Screen.Auth.Success,
          params: {
            screenTitle:"Registration",
            title: 'Registration Successful!',
            message:
              'Your account has been successfully created.\nYou can now log in to start managing your deliveries.',
            buttonText: 'Go to Login',
            redirectTo: Screen.Auth.Login,
          },
        },
      ],
    });

    resetRegisterData();
  };

  const renderDocumentCard = doc => {
    const isUploaded = !!uploaded[doc.id];

    return (
      <View key={doc.id} style={styles.card}>
        <View style={styles.leftSection}>
          {isUploaded && uploaded[doc.id]?.uri ? (
            <Image
              source={{ uri: uploaded[doc.id].uri }}
              style={styles.previewImage}
            />
          ) : (
            <Images size={26} color="#555" />
          )}
          <View style={styles.textContent}>
            <Text style={styles.label}>{t(doc.labelKey)}</Text>
            <Text style={styles.description}>{doc.description}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() =>
            isUploaded ? openRemoveModal(doc.id) : handleUpload(doc.id)
          }
        >
          <Text style={styles.uploadText}>
            {isUploaded ? 'Remove' : 'Upload'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <BaseContainer keyboardOffset={20}>
      <HeaderTitleComponent
        title="Necessary Documentation"
        showBackIcon
        navigation={navigation}
      />

      <View style={styles.container}>
        {documents.map(renderDocumentCard)}

        <ButtonComponent
          title="Saved Documents and next"
          onPress={handleNext}
          contentContainer={{ flex: 1, justifyContent: 'flex-end' }}
        />
      </View>

      <CustomConfirmModal
        visible={confirmModal}
        onConfirmText={t('common.remove')}
        title={t('dialogs.removeDocumentTitle')}
        message={t('dialogs.removeDocumentMessage')}
        onCancel={() => setConfirmModal(false)}
        onConfirm={confirmRemove}
      />

      <CustomConfirmModal
        visible={alertModal.visible}
        title={t('common.alert')}
        message={alertModal.message}
        onConfirm={() => setAlertModal({ visible: false, message: '' })}
      />
    </BaseContainer>
  );
};

export default DocumentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#F6F8FB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  previewImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    resizeMode: 'cover',
    backgroundColor: '#ccc',
  },
  textContent: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  uploadBtn: {
    backgroundColor: '#E5E9F0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'center',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});
