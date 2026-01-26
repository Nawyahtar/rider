import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../styles/Color';
import { Font } from '../../styles/Font';

const ButtonComponent = ({
  title = 'Button',
  onPress,
  contentContainer,
  buttonStyle,
  textStyle,
  disabled = false,
}) => {
  return (
    <View style={contentContainer}>
      <TouchableOpacity
        style={[
          styles.button,
          buttonStyle,
          disabled && styles.disabledButton, // Apply disabled style
        ]}
        onPress={onPress}
        activeOpacity={0.5}
        disabled={disabled} // Disable interaction
      >
        <Text
          style={[
            styles.text,
            textStyle,
            disabled && styles.disabledText, // Apply text style if disabled
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(ButtonComponent);

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    height: 60,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  text: {
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Font.Bold,
  },
  disabledButton: {
    backgroundColor: Colors.disabled || '#ccc',
  },
  disabledText: {
    color: '#999',
  },
});
