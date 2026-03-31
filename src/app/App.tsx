import React from 'react';
import { StatusBar,View } from 'react-native';

import HomeScreen from '../screens/home/HomeScreen';
import { colors } from '../theme/colors';

function App(): React.JSX.Element {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />
      <HomeScreen />
    </View>
  );
}

export default App;
