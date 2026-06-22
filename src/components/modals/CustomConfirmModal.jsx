import React, { memo, useContext } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LanguageContext } from '../../context/LanguageContext';
import { Font } from '../../styles/Font';

const { width } = Dimensions.get('window');

const CustomConfirmModal = ({
  visible,
  onCancel,
  onConfirm,
  onCancelText,
  onConfirmText,
  titleShow = true,
  title,
  message,
  confirmButtonStyle,
  cancelButtonStyle
}) => {
  const { t } = useContext(LanguageContext);
  const resolvedTitle = title ?? t('dialogs.defaultTitle');
  const resolvedMessage = message ?? t('dialogs.defaultMessage');
  const resolvedCancelText = onCancelText ?? t('common.cancel');
  const resolvedConfirmText = onConfirmText ?? t('common.ok');

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {titleShow && <Text style={styles.title}>{resolvedTitle}</Text>}
          {typeof resolvedMessage === 'string' ? (
            <Text style={styles.message}>{resolvedMessage}</Text>
          ) : (
            <View style={styles.customMessage}>{resolvedMessage}</View>
          )}
          <View style={styles.actions}>
            {onCancel && (
              <TouchableOpacity style={[styles.cancelBtn,cancelButtonStyle]} onPress={onCancel}>
                <Text style={styles.cancelText}>{resolvedCancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.confirmBtn,confirmButtonStyle]} onPress={onConfirm}>
              <Text style={styles.confirmText}>{resolvedConfirmText}</Text>
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
    fontFamily: Font.SemiBold,
    marginBottom: 10,
    color: '#333',
  },
  message: {
    fontSize: 14,
    fontFamily: Font.Regular,
    color: '#666',
    marginBottom: 25,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  customMessage: {
    marginBottom: 25,
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
    fontFamily: Font.Medium,
  },
  confirmText: {
    color: '#fff',
    fontFamily: Font.SemiBold,
  },
});
