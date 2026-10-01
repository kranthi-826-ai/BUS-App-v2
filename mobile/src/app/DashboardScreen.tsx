import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../features/auth/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const DashboardScreen = () => {
    const { logout, role } = useAuth();
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>Role: {role}</Text>

            <View style={styles.buttonContainer}>
                {role === 'STUDENT' && (
                    <>
                        <Button 
                            title="Enrol in a Bus Route" 
                            onPress={() => navigation.navigate('RouteSelection')} 
                        />
                        <View style={{height: 15}} />
                        <Button 
                            title="Configure Arrival Alerts" 
                            onPress={() => navigation.navigate('AlertSettings')} 
                            color="#28a745"
                        />
                    </>
                )}
            </View>

            <View style={styles.logoutContainer}>
                <Button title="Logout" color="red" onPress={logout} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, alignItems: 'center', paddingTop: 50 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 40 },
    buttonContainer: { width: '100%', marginBottom: 20 },
    logoutContainer: { marginTop: 'auto', width: '100%' }
});
