import React, { useEffect, useRef } from 'react';
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
import { ActivityIndicator, View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

const LoadingScreen = () => {
  const pulseAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Animated.View style={[styles.splashIconCircle, { transform: [{ scale: pulseAnim }] }]}>
        <Ionicons name="bus" size={48} color="#fff" />
      </Animated.View>
      <Text style={styles.splashTitle}>Smart Bus</Text>
    </View>
  );
};

const Navigation = () => {
  const { isAuthenticated, role, checkAuth } = useAuth();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuth().finally(() => {
      // Add a tiny artificial delay to let the nice splash animation play for at least 1s
      setTimeout(() => setLoading(false), 1000);
    });
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : role === 'STAFF' ? (
          <>
            <Stack.Screen name="InChargeDashboard" component={InChargeDashboard} />
            <Stack.Screen name="Attendance" component={AttendanceScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen 
              name="RouteSelection" 
              component={RouteSelectionScreen} 
              options={{ animation: 'slide_from_bottom' }} 
            />
            <Stack.Screen 
              name="StopSelection" 
              component={StopSelectionScreen} 
            />
            <Stack.Screen 
              name="AlertSettings" 
              component={AlertSettingsScreen} 
              options={{ animation: 'slide_from_bottom' }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#18332a', // Deep branding color
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#18864b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  }
});
