/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type { Node } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import MainNavigation from './components/MainNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App: () => Node = () => (
    <Provider store={store}>
      <SafeAreaProvider>
        <MainNavigation />  
      </SafeAreaProvider>
    </Provider>
);

export default App;
