import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { api } from '../api/index';

interface StopItem {
    id: string;
    stopId: string;
    name: string;
    sequenceNum: number;
}

export const StopSelectionScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { routeId, routeName } = route.params;
    
    const [stops, setStops] = useState<StopItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStop, setSelectedStop] = useState<string | null>(null);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        // Fetch stops for route
        api.get(`/transport/routes/${routeId}/stops`)
            .then(res => setStops(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [routeId]);

    const handleEnrol = async () => {
        if (!selectedStop) return;
        setEnrolling(true);
        try {
            // Usually the student needs a specific bus ID. 
            // In a real app, they might pick a route and stop, and the system assigns the bus.
            // For now, let's assume the API expects a selected stop ID and a route ID.
            await api.post(`/transport/enrolments`, { routeId, stopId: selectedStop });
            Alert.alert("Success", "You are now enrolled in " + routeName);
            navigation.navigate('Dashboard');
        } catch (error: any) {
            Alert.alert("Enrolment Failed", error.response?.data?.message || "An error occurred");
        } finally {
            setEnrolling(false);
        }
    };

    const renderItem = ({ item }: { item: StopItem }) => (
        <TouchableOpacity 
            style={[styles.card, selectedStop === item.stopId && styles.selectedCard]}
            onPress={() => setSelectedStop(item.stopId)}
        >
            <Text style={[styles.cardTitle, selectedStop === item.stopId && styles.selectedText]}>
                {item.sequenceNum}. {item.name}
            </Text>
        </TouchableOpacity>
    );

    if (loading) return <ActivityIndicator style={{flex:1}} size="large" />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select your stop for {routeName}</Text>
            <FlatList 
                data={stops}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No stops configured for this route.</Text>}
            />
            {selectedStop && (
                <View style={styles.footer}>
                    <Button title={enrolling ? "Enrolling..." : "Confirm Selection"} onPress={handleEnrol} disabled={enrolling} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { fontSize: 16, padding: 15, fontWeight: '600', backgroundColor: '#fff', elevation: 1 },
    card: { backgroundColor: '#fff', padding: 15, marginHorizontal: 15, marginVertical: 5, borderRadius: 8, elevation: 1 },
    selectedCard: { backgroundColor: '#007bff', borderColor: '#0056b3', borderWidth: 1 },
    cardTitle: { fontSize: 16 },
    selectedText: { color: '#fff', fontWeight: 'bold' },
    footer: { padding: 15, backgroundColor: '#fff', elevation: 5 }
});
