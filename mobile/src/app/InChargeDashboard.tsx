import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../features/auth/AuthContext';
import * as tripApi from '../../api/trip';
import { startLocationTracking, stopLocationTracking } from '../../background/LocationPublisher';

export const InChargeDashboard = () => {
    const { logout } = useAuth();
    const navigation = useNavigation<any>();
    const [activeTrip, setActiveTrip] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Hardcoded for demo, normally selected by user or derived from assignment
    const selectedBus = "bus-1";
    const selectedRoute = "route-1";

    const handleStartTrip = async () => {
        setLoading(true);
        try {
            const data = await tripApi.startTrip(selectedBus, selectedRoute);
            setActiveTrip(data.id);
            await startLocationTracking(data.id);
            Alert.alert("Trip Started", "Background location sharing is active.");
        } catch (e: any) {
            Alert.alert("Error", e.response?.data?.message || "Failed to start trip");
        } finally {
            setLoading(false);
        }
    };

    const handleEndTrip = async () => {
        if (!activeTrip) return;
        setLoading(true);
        try {
            await stopLocationTracking();
            await tripApi.endTrip(activeTrip);
            setActiveTrip(null);
            Alert.alert("Trip Ended", "Location sharing stopped.");
        } catch (e: any) {
            Alert.alert("Error", e.response?.data?.message || "Failed to end trip");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>In-Charge Dashboard</Text>

            <View style={styles.content}>
                {!activeTrip ? (
                    <Button title="Start Trip" onPress={handleStartTrip} disabled={loading} />
                ) : (
                    <View style={styles.activeContainer}>
                        <Text style={styles.activeText}>Trip is ACTIVE</Text>
                        <Text style={styles.subText}>Location is being shared in the background.</Text>
                        <Button title="Mark Attendance" onPress={() => navigation.navigate('Attendance', { tripId: activeTrip, busId: selectedBus })} />
                        <View style={{height: 15}} />
                        <Button title="End Trip" color="red" onPress={handleEndTrip} disabled={loading} />
                    </View>
                )}
            </View>

            <Button title="Logout" color="gray" onPress={logout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 50 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    content: { flex: 1, justifyContent: 'center' },
    activeContainer: { alignItems: 'center', backgroundColor: '#e6ffe6', padding: 20, borderRadius: 10 },
    activeText: { fontSize: 20, color: 'green', fontWeight: 'bold', marginBottom: 10 },
    subText: { textAlign: 'center', marginBottom: 20 }
});
