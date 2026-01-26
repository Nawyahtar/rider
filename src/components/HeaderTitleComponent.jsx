import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import Colors from '../styles/Color';
import { Font } from '../styles/Font';

const HeaderTitleComponent = ({
  navigation,
  title,
  onBackPress,
  contentContainer,
  showBackIcon = true,
  paddingTop = 40,
}) => {
  console.log('header title');
  const handleBackPress = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();

    }
  }, [navigation, onBackPress]);
  return (
    <View style={[{ paddingTop: paddingTop }, contentContainer]}>
      <View style={[styles.container]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backIcon}>
          {showBackIcon && <ArrowLeft size={26} color={Colors.text} />}
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default memo(HeaderTitleComponent);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    position: 'absolute',
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Font.Bold,
  },
});
