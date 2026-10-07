import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../features/auth/AuthContext';
import * as tripApi from '../api/trip';
import { api } from '../api';
import { startLocationTracking, stopLocationTracking } from '../background/LocationPublisher';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export const InChargeDashboard = () => {
    const { logout } = useAuth();
    const navigation = useNavigation<any>();
    const [activeTrip, setActiveTrip] = useState<any>(null);
    const [paused, setPaused] = useState(false);
    const [loading, setLoading] = useState(true);

    const selectedBus = "bus-1";
    const selectedRoute = "route-8"; // Valid seeded data
    const [routeName, setRouteName] = useState("Loading Route...");

    useEffect(() => {
        const fetchState = async () => {
            try {
                const res = await api.get('/v1/trips/active');
                if (res.data && res.data.length > 0) {
                    setActiveTrip(res.data[0]);
                    setPaused(res.data[0].status === 'PAUSED');
                }
                const routes = await api.get('/transport/routes');
                const matched = routes.data.find((r: any) => r.id === selectedRoute);
                if (matched) setRouteName(matched.name);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchState();
    }, []);

    const handleStartTrip = async () => {
        setLoading(true);
        try {
            const data = await tripApi.startTrip(selectedBus, selectedRoute);
            await startLocationTracking(data.id);
            setActiveTrip(data);
            Alert.alert("Trip Started", "Background location sharing is active.");
        } catch (e: any) {
            const msg = e.response?.data?.message || (e instanceof Error ? e.message : 'Failed to start trip');
            Alert.alert("Trip could not start", msg);
        } finally {
            setLoading(false);
        }
    };

    const handlePauseTrip = async () => {
        if (!activeTrip) return;
        setLoading(true);
        try {
            await tripApi.pauseTrip(activeTrip.id);
            await stopLocationTracking();
            setPaused(true);
            Alert.alert('Trip paused', 'GPS sharing has stopped until you resume the trip.');
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Failed to pause trip');
        } finally {
            setLoading(false);
        }
    };

    const handleResumeTrip = async () => {
        if (!activeTrip) return;
        setLoading(true);
        try {
            await tripApi.resumeTrip(activeTrip.id);
            await startLocationTracking(activeTrip.id);
            setPaused(false);
            Alert.alert('Trip resumed', 'Background location sharing is active.');
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Failed to resume trip');
        } finally {
            setLoading(false);
        }
    };

    const handleEndTrip = async () => {
        if (!activeTrip) return;
        setLoading(true);
        try {
            await tripApi.endTrip(activeTrip.id);
            await stopLocationTracking();
            setActiveTrip(null);
            setPaused(false);
            Alert.alert("Trip Ended", "Location sharing stopped.");
        } catch (e: any) {
            Alert.alert("Error", e.response?.data?.message || 'Failed to end trip');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !activeTrip) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#18864b" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Driver Dashboard</Text>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color="#bd6b16" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {!activeTrip ? (
                    <View style={styles.idleCard}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="bus" size={40} color="#18332a" />
                        </View>
                        <Text style={styles.idleTitle}>Ready to Drive?</Text>
                        <Text style={styles.idleSubtitle}>You are assigned to {routeName}. Start the trip to begin sharing GPS location with students.</Text>
                        
                        <TouchableOpacity 
                            style={styles.primaryButton} 
                            onPress={handleStartTrip}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Start Trip</Text>}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.activeCard}>
                        <View style={[styles.statusIndicator, paused ? styles.statusPaused : styles.statusActive]} />
                        
                        <Text style={styles.activeTitle}>{paused ? 'Trip Paused' : 'Trip in Progress'}</Text>
                        <Text style={styles.activeSubtitle}>Route: {routeName}</Text>
                        <Text style={styles.statusDescription}>
                            {paused ? 'Location sharing is paused. Students cannot see your live location.' : 'GPS location is being shared live with enrolled students.'}
                        </Text>
                        
                        <View style={styles.actionGrid}>
                            <TouchableOpacity 
                                style={[styles.gridButton, paused ? styles.gridButtonResume : styles.gridButtonPause]}
                                onPress={paused ? handleResumeTrip : handlePauseTrip}
                                disabled={loading}
                            >
                                <Ionicons name={paused ? "play" : "pause"} size={24} color="#fff" />
                                <Text style={styles.gridButtonText}>{paused ? "Resume" : "Pause"}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.gridButton, styles.gridButtonAttendance]}
                                onPress={() => navigation.navigate('Attendance', { tripId: activeTrip.id, busId: selectedBus })}
                                disabled={loading}
                            >
                                <Ionicons name="people" size={24} color="#fff" />
                                <Text style={styles.gridButtonText}>Attendance</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={styles.endButton} 
                            onPress={handleEndTrip}
                            disabled={loading}
                        >
                            <Ionicons name="stop-circle" size={20} color="#fff" style={{marginRight: 8}} />
                            <Text style={styles.endButtonText}>End Trip</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f6f4' },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingHorizontal: 20, 
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#18332a' },
    logoutButton: { padding: 8, backgroundColor: '#fff', borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOffset:{width:0, height:1}, shadowOpacity: 0.1 },
    content: { flex: 1, padding: 20, justifyContent: 'center' },
    
    idleCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12
    },
    iconCircle: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: '#e3eee8', alignItems: 'center', justifyContent: 'center', marginBottom: 20
    },
    idleTitle: { fontSize: 22, fontWeight: '800', color: '#18332a', marginBottom: 10 },
    idleSubtitle: { fontSize: 15, color: '#566661', textAlign: 'center', marginBottom: 30, lineHeight: 22 },
    primaryButton: { 
        width: '100%', minHeight: 56, backgroundColor: '#18864b', borderRadius: 14, alignItems: 'center', justifyContent: 'center' 
    },
    primaryButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
    
    activeCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        alignItems: 'center'
    },
    statusIndicator: { width: 12, height: 12, borderRadius: 6, marginBottom: 15 },
    statusActive: { backgroundColor: '#18864b', shadowColor: '#18864b', shadowOpacity: 0.8, shadowRadius: 8, elevation: 4 },
    statusPaused: { backgroundColor: '#bd6b16' },
    activeTitle: { fontSize: 24, fontWeight: '800', color: '#18332a', marginBottom: 5 },
    activeSubtitle: { fontSize: 16, fontWeight: '600', color: '#566661', marginBottom: 15 },
    statusDescription: { fontSize: 14, color: '#75837e', textAlign: 'center', marginBottom: 30, paddingHorizontal: 10, lineHeight: 20 },
    
    actionGrid: { flexDirection: 'row', gap: 15, width: '100%', marginBottom: 20 },
    gridButton: { flex: 1, height: 90, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 2 },
    gridButtonPause: { backgroundColor: '#bd6b16' },
    gridButtonResume: { backgroundColor: '#18864b' },
    gridButtonAttendance: { backgroundColor: '#18332a' },
    gridButtonText: { color: '#fff', fontSize: 14, fontWeight: '700', marginTop: 8 },
    
    endButton: { 
        width: '100%', minHeight: 56, backgroundColor: '#d32f2f', borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' 
    },
    endButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' }
});
