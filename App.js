import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginScreen from './screens/LoginScreen';
import ClockScreen from './screens/ClockScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <PaperProvider>
        <UserProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Clock" 
                component={ClockScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Analytics" 
                component={AnalyticsScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </UserProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
