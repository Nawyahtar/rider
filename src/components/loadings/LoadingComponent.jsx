import React from 'react';
import { View, StyleSheet, Modal, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import LoadingSource from '../../assets/animation/glowLoading.json';

const LoadingComponent = ({ visible = false, animationSource }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <LottieView
          source={animationSource || LoadingSource}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
    </Modal>
  );
};

export default LoadingComponent;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
});
