import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api';
import { usePushNotifications } from '../features/alert/usePushNotifications';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export const AlertSettingsScreen = () => {
    const navigation = useNavigation<any>();
    const { expoPushToken } = usePushNotifications();
    const [enabled, setEnabled] = useState(true);
    const [radius, setRadius] = useState(1000);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [enrolment, setEnrolment] = useState<any>(null);

    useEffect(() => {
        api.get('/transport/enrolments/me')
            .then(res => setEnrolment(res.data))
            .catch(() => setEnrolment(null))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        if (!enrolment) {
            Alert.alert("No Enrolment", "You need to select a route and stop first.");
            return;
        }
        setSaving(true);
        try {
            await api.post('/alerts/subscribe', {
                busId: enrolment.bus.id,
                stopId: enrolment.selectedStop.id,
                radiusMeters: radius,
                enabled
            });
            Alert.alert("Success", "Alert settings saved.");
            navigation.goBack();
        } catch (e: any) {
            Alert.alert("Error", e.response?.data?.message || "Failed to save alerts.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#18864b" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#18332a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Arrival Alerts</Text>
            </View>

            <View style={styles.content}>
                {!enrolment ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="alert-circle-outline" size={48} color="#bd6b16" />
                        <Text style={styles.emptyText}>You haven't enrolled in a bus yet. Please select your route first to configure alerts.</Text>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('RouteSelection')}>
                            <Text style={styles.primaryButtonText}>Select Route</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <View style={styles.settingCard}>
                            <View style={styles.settingRow}>
                                <View>
                                    <Text style={styles.settingTitle}>Enable Alerts</Text>
                                    <Text style={styles.settingDesc}>Notify me when my bus is near</Text>
                                </View>
                                <Switch 
                                    value={enabled} 
                                    onValueChange={setEnabled} 
                                    trackColor={{ false: '#d1d1d1', true: '#18864b' }}
                                    thumbColor="#fff"
                                />
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Alert Distance</Text>
                        <View style={styles.radiusContainer}>
                            {[500, 1000, 2000].map(dist => (
                                <TouchableOpacity 
                                    key={dist}
                                    style={[styles.radiusButton, radius === dist && styles.radiusButtonActive]}
                                    onPress={() => setRadius(dist)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.radiusText, radius === dist && styles.radiusTextActive]}>
                                        {dist >= 1000 ? `${dist/1000} km` : `${dist} m`}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.info}>
                            We will send a notification to your device when {enrolment.bus.displayName || "your bus"} is within {radius >= 1000 ? `${radius/1000} km` : `${radius} m`} of {enrolment.selectedStop.name}.
                        </Text>
                    </>
                )}
            </View>

            {enrolment && (
                <View style={styles.footer}>
                    <TouchableOpacity style={[styles.primaryButton, saving && styles.buttonDisabled]} onPress={handleSave} disabled={saving}>
                        <Text style={styles.primaryButtonText}>{saving ? "Saving..." : "Save Settings"}</Text>
                    </TouchableOpacity>
                    <Text style={styles.debug}>Push status: {expoPushToken ? "Active" : "Unavailable"}</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f6f4' },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: { marginRight: 15 },
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#18332a' },
    content: { padding: 20, flex: 1 },
    settingCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        elevation: 2,
    },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    settingTitle: { fontSize: 17, fontWeight: '700', color: '#18332a', marginBottom: 4 },
    settingDesc: { fontSize: 14, color: '#75837e' },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: '#18332a', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
    radiusContainer: { flexDirection: 'row', gap: 10, marginBottom: 25 },
    radiusButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        elevation: 1,
    },
    radiusButtonActive: {
        borderColor: '#18864b',
        backgroundColor: '#e3eee8',
    },
    radiusText: { fontSize: 16, fontWeight: '600', color: '#566661' },
    radiusTextActive: { color: '#18864b' },
    info: { fontSize: 14, color: '#566661', lineHeight: 22, backgroundColor: '#e3eee8', padding: 15, borderRadius: 12 },
    footer: { padding: 20, paddingBottom: 34, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
    primaryButton: { 
        minHeight: 52, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#18332a', 
        borderRadius: 12 
    },
    buttonDisabled: { backgroundColor: '#75837e' },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    debug: { fontSize: 12, color: '#aaa', marginTop: 15, textAlign: 'center' },
    emptyState: { alignItems: 'center', marginTop: 40, backgroundColor: '#fff', padding: 30, borderRadius: 16 },
    emptyText: { fontSize: 16, color: '#566661', textAlign: 'center', marginVertical: 20, lineHeight: 24 }
});
