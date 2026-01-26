import React, { useEffect, useRef, memo } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions } from 'react-native';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const TYPE_CONFIG = {
  success: {
    Icon: CheckCircle,
    color: '#4CAF50',
    backgroundColor: '#2E2E2E',
  },
  error: {
    Icon: XCircle,
    color: '#F44336',
    backgroundColor: '#2E2E2E',
  },
  info: {
    Icon: Info,
    color: '#2196F3',
    backgroundColor: '#2E2E2E',
  },
  warn: {
    Icon: AlertCircle,
    color: '#FFC107',
    backgroundColor: '#2E2E2E',
  },
};

const CustomSnackbar = ({
  visible,
  message,
  type = 'info',
  onDismiss,
  duration = 1200,
}) => {
  console.log('cusotm snack bar');
  const slideAnim = useRef(new Animated.Value(100)).current;

  const { Icon, color, backgroundColor } =
    TYPE_CONFIG[type] || TYPE_CONFIG.info;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onDismiss?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, slideAnim, onDismiss]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.snackbarContainer,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={[styles.snackbar, { backgroundColor }]}>
        <View style={styles.iconWrapper}>
          <Icon size={20} color={color} />
        </View>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export default memo(CustomSnackbar);

const styles = StyleSheet.create({
  snackbarContainer: {
    position: 'absolute',
    bottom: 80,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  snackbar: {
    width: '90%',
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 16,
    elevation: 5,
  },
  iconWrapper: {
    marginRight: 10,
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '400',
    flexShrink: 1,
  },
});
