import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={styles.headerText}
      >
        Hello World
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  image: {
    marginVertical: 50
  },
  headerText: {
    color: '#fff',
    fontSize: 50
  },
  normalText: {
    color: '#fff',
    marginVertical: 30,
    marginBottom: 100,
    fontSize: 18
  }
});