import React, { memo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const CustomConfirmModal = ({
  visible,
  onCancel,
  onConfirm,
  onCancelText = 'Cancel',
  onConfirmText = 'OK',
  titleShow = true,
  title = 'Remove Document',
  message = 'Are you sure you want to remove this document?',
  confirmButtonStyle,
  cancelButtonStyle
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {titleShow && <Text style={styles.title}>{title}</Text>}
          {typeof message === 'string' ? (
            <Text style={styles.message}>{message}</Text>
          ) : (
            <View style={{ marginBottom: 25 }}>{message}</View>
          )}
          <View style={styles.actions}>
            {onCancel && (
              <TouchableOpacity style={[styles.cancelBtn,cancelButtonStyle]} onPress={onCancel}>
                <Text style={styles.cancelText}>{onCancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.confirmBtn,confirmButtonStyle]} onPress={onConfirm}>
              <Text style={styles.confirmText}>{onConfirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(CustomConfirmModal);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#ff4444',
  },
  cancelText: {
    color: '#333',
    fontWeight: '500',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});
