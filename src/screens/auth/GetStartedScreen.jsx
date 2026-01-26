import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import BaseContainer from '../../components/BaseContainer';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import Colors from '../../styles/Color';
import LoadingComponent from '../../components/loadings/LoadingComponent';

const GetStartedScreen = ({ onContinue }) => {
  const [loading, setLoading] = useState(false);

  return (
    <BaseContainer>
      <LoadingComponent visible={loading}/>

      <View style={styles.container}>
        {/* Header Image */}
        <Image
          source={require('../../assets/images/delivery.png')}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Card Section */}
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to the rider team</Text>
          <Text style={styles.subtitle}>
            Start earning by delivering food from local restaurants to hungry
            customers.
          </Text>
        </View>

        {/* Action Button */}
        <ButtonComponent
          title="Get Started"
          onPress={async () => {
            setLoading(true);
            try {
              await onContinue();
            } finally {
              setLoading(false);
            }
          }}
          contentContainer={styles.buttonContainer}
        />
      </View>
    </BaseContainer>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '55%',
  },
  content: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.text,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
});
