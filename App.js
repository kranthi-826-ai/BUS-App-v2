import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import LanguageScreen from './src/screens/LanguageScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import UniversitySelectionScreen from './src/screens/UniversitySelectionScreen';
import BusSelectionScreen from './src/screens/BusSelectionScreen';
import StopSelectionScreen from './src/screens/StopSelectionScreen';
import AlarmSetupScreen from './src/screens/AlarmSetupScreen';
import TrackingScreen from './src/screens/TrackingScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  const [language, setLanguage] = useState('english');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (on app start)
  useEffect(() => {
    checkUserLoginStatus();
  }, []);

  const checkUserLoginStatus = async () => {
    // TODO: Implement storage check for user session
    setIsLoading(false);
  };

  if (isLoading) {
    return null; // Or a loading screen component
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName={user ? "BusSelection" : "Language"}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1e90ff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Language Selection - First Screen */}
        <Stack.Screen 
          name="Language" 
          component={LanguageScreen}
          options={{ headerShown: false }}
        />

        {/* Authentication Flow */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen}
          options={{ title: 'Sign Up' }}
        />

        {/* University Selection */}
        <Stack.Screen 
          name="UniversitySelection" 
          component={UniversitySelectionScreen}
          options={{ title: 'Select University' }}
        />

        {/* Main App Flow */}
        <Stack.Screen 
          name="BusSelection" 
          component={BusSelectionScreen}
          options={{ 
            title: 'Select Bus',
            headerRight: () => <ProfileScreen /> // Profile icon in header
          }}
        />
        <Stack.Screen 
          name="StopSelection" 
          component={StopSelectionScreen}
          options={{ title: 'Select Stop' }}
        />
        <Stack.Screen 
          name="AlarmSetup" 
          component={AlarmSetupScreen}
          options={{ title: 'Set Alarm' }}
        />
        <Stack.Screen 
          name="Tracking" 
          component={TrackingScreen}
          options={{ title: 'Bus Tracking' }}
        />

        {/* Profile */}
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ title: 'My Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}