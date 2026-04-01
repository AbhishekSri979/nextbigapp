import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { AppToast } from '../components/common';
import AppNavigator from '../navigation';

function App(): React.JSX.Element {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <AppToast />
    </View>
  );
}

export default App;
