/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import Text from 'react-native';
// import {
//   StyleSheet,
// } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { LandingScreen } from '../screens/LandingScreen';

const { Navigator, Screen } = createNativeStackNavigator();

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Navigator>
            <Screen
              name="Home"
              component={LandingScreen}
              options={{
                headerStyle: {
                  backgroundColor: '#000',
                },
                headerTintColor: '#50994d',
                // headerTitle: () => <Text>Hello World</Text>,
              }}
            />
      </Navigator>
    </NavigationContainer>
  );
};

// const styles = StyleSheet.create({
//   loader: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   }
// });

export default MainNavigation;
