import React from 'react';
import { StatusBar,View } from 'react-native';

import { colors } from '../theme/colors';
import LoginScreen from '../screens/login';

function App(): React.JSX.Element {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />
      <LoginScreen/>
    </View>
  );
}

export default App;
