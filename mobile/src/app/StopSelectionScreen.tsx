import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Animated } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { api } from '../api';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface StopItem {
    id: string;
    sequenceNum: number;
    stop: {
        id: string;
        name: string;
        latitude: number;
        longitude: number;
    };
}

export const StopSelectionScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { routeId, routeName } = route.params;
    
    const [stops, setStops] = useState<StopItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStop, setSelectedStop] = useState<string | null>(null);
    const [enrolling, setEnrolling] = useState(false);
    
    const slideAnim = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        // Fetch stops for route
        api.get(`/transport/routes/${routeId}/stops`)
            .then(res => setStops(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [routeId]);

    useEffect(() => {
        if (selectedStop) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 8
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 150,
                duration: 200,
                useNativeDriver: true
            }).start();
        }
    }, [selectedStop]);

    const handleEnrol = async () => {
        if (!selectedStop) return;
        setEnrolling(true);
        try {
            const busesResponse = await api.get(`/transport/routes/${routeId}/buses`);
            const matchingBus = (busesResponse.data as Array<{ id: string; displayName: string }>)[0];
            if (!matchingBus) throw new Error('No bus is currently assigned for this route. Ask your transport office.');

            await api.post('/transport/enrolments', {
                busId: matchingBus.id,
                routeId,
                selectedStopId: selectedStop,
            });
            Alert.alert("Welcome aboard", "You are now enrolled in " + routeName);
            navigation.navigate('Dashboard');
        } catch (error: any) {
            const responseMessage = typeof error === 'object' && error !== null && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
                : undefined;
            Alert.alert("Enrolment Failed", responseMessage ?? (error instanceof Error ? error.message : "Please retry."));
        } finally {
            setEnrolling(false);
        }
    };

    const renderItem = ({ item }: { item: StopItem }) => {
        const isSelected = selectedStop === item.stop.id;
        return (
            <TouchableOpacity 
                style={[styles.card, isSelected && styles.selectedCard]}
                onPress={() => setSelectedStop(item.stop.id)}
                activeOpacity={0.8}
            >
                <View style={[styles.sequenceBadge, isSelected && styles.selectedSequenceBadge]}>
                    <Text style={[styles.sequenceText, isSelected && styles.selectedSequenceText]}>{item.sequenceNum}</Text>
                </View>
                <Text style={[styles.cardTitle, isSelected && styles.selectedText]}>
                    {item.stop.name}
                </Text>
                {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color="#fff" style={styles.checkIcon} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#18332a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{routeName}</Text>
            </View>
            
            <View style={styles.content}>
                <Text style={styles.prompt}>Where will you be boarding?</Text>
                
                {loading ? (
                    <ActivityIndicator style={{marginTop: 40}} size="large" color="#18864b" />
                ) : (
                    <FlatList 
                        data={stops}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Ionicons name="location-outline" size={48} color="#c2cfcb" />
                                <Text style={styles.emptyText}>No stops configured yet.</Text>
                            </View>
                        }
                    />
                )}
            </View>

            <Animated.View style={[styles.footer, { transform: [{ translateY: slideAnim }] }]}>
                <TouchableOpacity 
                    style={[styles.primaryButton, enrolling && styles.buttonDisabled]} 
                    onPress={handleEnrol} 
                    disabled={enrolling}
                >
                    {enrolling ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Confirm Boarding Stop</Text>
                    )}
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 15, 
        paddingTop: 10,
        paddingBottom: 15,
    },
    backButton: { marginRight: 15, padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#18332a', flex: 1 },
    content: { 
        flex: 1, 
        backgroundColor: '#fff', 
        paddingHorizontal: 20, 
    },
    prompt: { fontSize: 16, color: '#566661', marginBottom: 15, fontWeight: '600' },
    listContainer: { paddingBottom: 100 }, // Space for footer
    card: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#f2f6f4',
        marginBottom: 10
    },
    selectedCard: { 
        backgroundColor: '#18864b', 
        borderColor: '#18864b',
        elevation: 3,
        shadowColor: '#18864b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6
    },
    sequenceBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f2f6f4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },
    selectedSequenceBadge: {
        backgroundColor: '#fff',
    },
    sequenceText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#18332a'
    },
    selectedSequenceText: {
        color: '#18864b'
    },
    cardTitle: { fontSize: 16, fontWeight: '600', color: '#18332a', flex: 1 },
    selectedText: { color: '#fff' },
    checkIcon: { marginLeft: 10 },
    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyText: { fontSize: 16, color: '#75837e', marginTop: 15 },
    footer: { 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: 20, 
        backgroundColor: '#fff', 
        borderTopWidth: 1, 
        borderTopColor: '#f2f6f4',
        paddingBottom: 34,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10
    },
    primaryButton: { 
        minHeight: 56, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#18332a', 
        borderRadius: 14 
    },
    buttonDisabled: {
        backgroundColor: '#75837e'
    },
    primaryButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '700' 
    }
});
