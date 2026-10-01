import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/features/auth/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './src/app/LoginScreen';
import { DashboardScreen } from './src/app/DashboardScreen';
import { RouteSelectionScreen } from './src/app/RouteSelectionScreen';
import { StopSelectionScreen } from './src/app/StopSelectionScreen';
import { AlertSettingsScreen } from './src/app/AlertSettingsScreen';
import { InChargeDashboard } from './src/app/InChargeDashboard';
import { AttendanceScreen } from './src/app/AttendanceScreen';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { isAuthenticated, role, checkAuth } = useAuth();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuth().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : role === 'STAFF' ? (
          <>
            <Stack.Screen name="InChargeDashboard" component={InChargeDashboard} options={{ title: 'In-Charge Home' }} />
            <Stack.Screen name="Attendance" component={AttendanceScreen} options={{ title: 'Attendance' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="RouteSelection" component={RouteSelectionScreen} options={{ title: 'Select Route' }} />
            <Stack.Screen name="StopSelection" component={StopSelectionScreen} options={{ title: 'Select Stop' }} />
            <Stack.Screen name="AlertSettings" component={AlertSettingsScreen} options={{ title: 'Alert Settings' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
