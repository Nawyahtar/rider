import React, { useState, memo } from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Colors from '../../styles/Color';

const ImagePickerBox = ({ onImagePicked }) => {
  const [imageUri, setImageUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera to take a photo.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const pickFromGallery = async () => {
    setModalVisible(false);
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        includeBase64: false,
      });
      setImageUri(image.path);
      onImagePicked?.(image);
    } catch (error) {
      console.warn('Gallery Error:', error);
    }
  };

  const pickFromCamera = async () => {
    setModalVisible(false);
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      console.warn('Camera permission denied');
      return;
    }

    try {
      const image = await ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
        includeBase64: false,
      });
      setImageUri(image.path);
      onImagePicked?.(image);
    } catch (error) {
      console.warn('Camera Error:', error);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.uploadBox} onPress={() => setModalVisible(true)}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.uploadText}>Upload Photo</Text>
        )}
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Choose Image Source</Text>
            <TouchableOpacity style={styles.modalButton} onPress={pickFromCamera}>
              <Text style={styles.modalButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={pickFromGallery}>
              <Text style={styles.modalButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: Colors.secondaryText }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  uploadBox: {
    height: 188,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  uploadText: {
    color: Colors.secondaryText,
    fontSize: 18,
    fontWeight: '700',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.primary,
    fontWeight: '600',
  },
  cancelButton: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
});

export default memo(ImagePickerBox);
