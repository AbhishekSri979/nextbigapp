import React, { useState } from 'react';
import { StatusBar, View } from 'react-native';

import { colors } from '../theme/colors';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';

type AuthScreen = 'login' | 'register';

function App(): React.JSX.Element {
  const [activeScreen, setActiveScreen] = useState<AuthScreen>('login');

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.authBackground}
      />
      {activeScreen === 'login' ? (
        <LoginScreen onRegister={() => setActiveScreen('register')} />
      ) : (
        <RegisterScreen onLogin={() => setActiveScreen('login')} />
      )}
    </View>
  );
}

export default App;
