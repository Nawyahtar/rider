import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import Colors from '../../styles/Color';
import { Eye, EyeOff } from 'lucide-react-native';

const TextInputComponent = ({
  value,
  onChangeText,
  placeholder = '',
  isSecureShow = false,
  isDateMask = false, 
  contentContainerStyle = {},
  keyboardType = 'default',
  error = '',
  title = '',
  titleFontSize = 14,
  mb= 4
}) => {
  const [secure, setSecure] = useState(isSecureShow);

  return (
    <View style={[styles.containter, contentContainerStyle]}>
      {title ? <Text style={[styles.title,{marginBottom:mb,fontSize:titleFontSize}]}>{title}</Text> : null}

      <View
        style={[
          styles.inputContainer,
          error ? { borderColor: 'red', borderWidth: 1 } : {},
        ]}
      >
        {isDateMask ? (
          <MaskInput
            value={value}
            onChangeText={onChangeText}
            mask={Masks.DATE_DDMMYYYY}
            placeholder={placeholder}
            keyboardType="numeric"
            style={styles.input}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={Colors.mutedText}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={isSecureShow ? secure : false}
            autoComplete="off"
            importantForAutofill="no"
            textContentType="none"
          />
        )}

        {/* 👁️ Only show secure toggle if not using date mask and is secure */}
        {isSecureShow && !isDateMask && (
          <TouchableOpacity
            onPress={() => setSecure(!secure)}
            style={styles.icon}
          >
            {secure ? (
              <EyeOff size={24} color="#888" />
            ) : (
              <Eye size={24} color="#888" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

export default TextInputComponent;

const styles = StyleSheet.create({
  containter: {
    marginVertical: 8,
  },
  title: {
    color: '#000',
    marginLeft: 4,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    color: '#000',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginLeft: 4,
    marginTop: 4,
  },
});
