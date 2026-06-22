
import { Platform } from 'react-native';

const regular = Platform.select({
  android: 'GoogleSansFlex-Regular',
  ios: 'GoogleSansFlex18pt-Regular',
  default: 'Google Sans Flex 18pt',
});

const medium = Platform.select({
  android: 'GoogleSansFlex-Medium',
  ios: 'GoogleSansFlex18pt-Medium',
  default: 'Google Sans Flex 18pt Medium',
});

export const Font = {
  Bold: medium,
  Regular: regular,
  Medium: medium,
  SemiBold: medium,
  ExtraBold: medium,
  Italic: regular,
};
