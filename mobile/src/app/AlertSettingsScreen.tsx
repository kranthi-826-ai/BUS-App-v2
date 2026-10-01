import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button, StyleSheet, Alert } from 'react-native';
import { api } from '../../api';
import { usePushNotifications } from '../../features/alert/usePushNotifications';

export const AlertSettingsScreen = () => {
    const { expoPushToken } = usePushNotifications();
    const [enabled, setEnabled] = useState(true);
    const [radius, setRadius] = useState(1000);
    const [loading, setLoading] = useState(false);

    // Hardcoded for demo, normally derived from student's active enrolment
    const busId = "bus-1";
    const stopId = "stop-1";

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.post('/alerts/subscribe', {
                busId,
                stopId,
                radiusMeters: radius,
                enabled
            });
            Alert.alert("Success", "Alert settings saved.");
        } catch (e: any) {
            Alert.alert("Error", e.response?.data?.message || "Failed to save alerts.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Arrival Alerts</Text>
            
            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Enable Notifications</Text>
                <Switch value={enabled} onValueChange={setEnabled} />
            </View>

            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Alert Radius</Text>
                <View style={styles.radiusSelector}>
                    <Button title="500m" onPress={() => setRadius(500)} color={radius === 500 ? '#007bff' : 'gray'} />
                    <Button title="1km" onPress={() => setRadius(1000)} color={radius === 1000 ? '#007bff' : 'gray'} />
                    <Button title="2km" onPress={() => setRadius(2000)} color={radius === 2000 ? '#007bff' : 'gray'} />
                </View>
            </View>

            <Text style={styles.info}>
                You will receive a push notification when your assigned bus is within {radius} meters of your selected stop.
            </Text>

            <Button title={loading ? "Saving..." : "Save Settings"} onPress={handleSave} disabled={loading} />
            
            <Text style={styles.debug}>Push Token: {expoPushToken ? "Registered" : "Not available"}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 1 },
    settingText: { fontSize: 16 },
    radiusSelector: { flexDirection: 'row', gap: 10 },
    info: { fontSize: 14, color: '#666', marginVertical: 20, lineHeight: 20 },
    debug: { fontSize: 10, color: '#aaa', marginTop: 30, textAlign: 'center' }
});
