import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Colors from '../../styles/Color';

const DropdownComponent = ({
  title = '',
  value,
  data = [],
  placeholder = 'Select',
  onChange,
  error = '',
  contentContainerStyle = {},
  labelField = 'label',
  valueField = 'value',
}) => {
  return (
    <View style={[styles.container, contentContainerStyle]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      <Dropdown
        style={[
          styles.dropdown,
          error ? { borderColor: 'red', borderWidth: 1 } : {},
        ]}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        itemTextStyle={styles.itemText}
        containerStyle={{ borderRadius: 12 }}
        itemContainerStyle={{ borderRadius: 12 }}
        data={data}
        maxHeight={150}
        labelField={labelField}
        valueField={valueField}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius:12
  },
  title: {
    fontSize: 14,
    color: '#000',
    marginLeft: 4,
    marginBottom: 4,
    fontWeight: '500',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    color: '#000',
  },
  placeholder: {
    color: Colors.mutedText,
  },
  selectedText: {
    color: '#000',
  },
  itemText: {
    color: '#000',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginLeft: 4,
    marginTop: 4,
  },
});
