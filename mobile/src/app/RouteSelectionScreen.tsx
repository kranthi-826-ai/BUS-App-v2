import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api/index';

interface RouteItem {
    id: string;
    name: string;
    direction: string;
}

export const RouteSelectionScreen = () => {
    const navigation = useNavigation<any>();
    const [routes, setRoutes] = useState<RouteItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch routes from backend
        api.get('/transport/routes')
            .then(res => setRoutes(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const renderItem = ({ item }: { item: RouteItem }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('StopSelection', { routeId: item.id, routeName: item.name })}
        >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.direction}</Text>
        </TouchableOpacity>
    );

    if (loading) return <ActivityIndicator style={{flex:1}} size="large" />;

    return (
        <View style={styles.container}>
            <FlatList 
                data={routes}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No routes available.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    card: { backgroundColor: '#fff', padding: 20, marginHorizontal: 15, marginVertical: 8, borderRadius: 8, elevation: 2 },
    cardTitle: { fontSize: 18, fontWeight: 'bold' },
    cardSubtitle: { fontSize: 14, color: '#666', marginTop: 5 }
});
