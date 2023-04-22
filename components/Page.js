import React from 'react';
import { View } from 'react-native';

const Page = ({ backgroundColor, children }) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor,
    }}>
    <View style={{ marginTop: 16 }}>{children}</View>
  </View>
);

export default Page;
