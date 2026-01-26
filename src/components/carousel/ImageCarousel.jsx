import React, { useRef, useState, memo } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Colors from '../../styles/Color';

const { width: screenWidth } = Dimensions.get('window');

const ImageCarousel = ({ images }) => {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = direction => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      carouselRef.current?.scrollTo({ index: newIndex, animated: true });
    }
  };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === images.length - 1;

  const renderArrowButton = direction => {
    const isDisabled = direction === 'left' ? isFirst : isLast;
    const onPress = () => handleScroll(direction === 'left' ? -1 : 1);
    const icon =
      direction === 'left' ? (
        <ChevronLeft size={20} color="white" />
      ) : (
        <ChevronRight size={20} color="white" />
      );
    const positionStyle = direction === 'left' ? styles.left : styles.right;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.arrowButton, positionStyle, isDisabled && styles.hidden]}
        disabled={isDisabled}
      >
        {icon}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.carouselWrapper}>
      <Carousel
        ref={carouselRef}
        loop={false}
        width={screenWidth}
        height={218}
        data={images}
        scrollAnimationDuration={300}
        onSnapToItem={setCurrentIndex}
        renderItem={({ item }) => (
          <Image source={item} style={styles.image} resizeMode="cover" />
        )}
      />
      {renderArrowButton('left')}
      {renderArrowButton('right')}
    </View>
  );
};

const styles = StyleSheet.create({
  carouselWrapper: {
    position: 'relative',
  },
  image: {
    width: screenWidth,
    height: 218,
  },
  arrowButton: {
    position: 'absolute',
    top: '40%',
    backgroundColor: Colors.iconGray,
    padding: 10,
    borderRadius: 30,
    zIndex: 10,
  },
  hidden: {
    opacity: 0,
    pointerEvents: 'none',
  },
  left: {
    left: 16,
  },
  right: {
    right: 16,
  },
});

export default memo(ImageCarousel);
