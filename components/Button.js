import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

TouchableOpacity.defaultProps = {activeOpacity: 0.8};

export const PrimaryButton = ({
  onPress,
  title,
  backgroundColor = '#000',
  borderColor= '#50994d',
  fontColor = '#fff',
  width,
  height,
  marginTop,
  marginVertical,
  paddingHorizontal = 20,
  paddingVertical = 20
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={
        [
        styles.appButtonContainer,
        {
            backgroundColor,
            borderColor,
            width,
            height,
            marginTop,
            marginVertical,
            paddingHorizontal,
            paddingVertical
        },
    ]}>
    <Text style={[styles.appButtonText, {color: fontColor}]}>{title}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  appButtonContainer: {
    // elevation: 8,
    borderColor: '#50994d',
    borderWidth: 1,
    borderRadius: 10
  },
  appButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
