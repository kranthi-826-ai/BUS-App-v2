import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RouteItem {
    id: string;
    name: string;
    direction: string;
}

export const RouteSelectionScreen = () => {
    const navigation = useNavigation<any>();
    const [routes, setRoutes] = useState<RouteItem[]>([]);
    const [filteredRoutes, setFilteredRoutes] = useState<RouteItem[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const res = await api.get('/transport/routes');
                setRoutes(res.data);
                setFilteredRoutes(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoutes();
    }, []);

    const handleSearch = (text: string) => {
        setSearch(text);
        if (!text) {
            setFilteredRoutes(routes);
            return;
        }
        const lower = text.toLowerCase();
        setFilteredRoutes(routes.filter(r => r.name.toLowerCase().includes(lower) || r.direction.toLowerCase().includes(lower)));
    };

    const renderItem = ({ item }: { item: RouteItem }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('StopSelection', { routeId: item.id, routeName: item.name })}
            activeOpacity={0.7}
        >
            <View style={styles.cardIcon}>
                <Ionicons name="location" size={24} color="#18332a" />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>Direction: {item.direction}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#c2cfcb" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="close" size={28} color="#18332a" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Select Route</Text>
                </View>

                <View style={styles.searchContainer}>
                    <View style={styles.searchInputWrapper}>
                        <Ionicons name="search" size={20} color="#75837e" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Where are you headed?"
                            placeholderTextColor="#75837e"
                            value={search}
                            onChangeText={handleSearch}
                            autoCorrect={false}
                        />
                        {search.length > 0 && (
                            <TouchableOpacity onPress={() => handleSearch('')}>
                                <Ionicons name="close-circle" size={20} color="#c2cfcb" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                
                <View style={styles.content}>
                    {loading ? (
                        <ActivityIndicator style={{marginTop: 40}} size="large" color="#18864b" />
                    ) : (
                        <FlatList 
                            data={filteredRoutes}
                            keyExtractor={item => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={styles.listContainer}
                            keyboardShouldPersistTaps="handled"
                            ListEmptyComponent={
                                <View style={styles.emptyState}>
                                    <View style={styles.emptyIconCircle}>
                                        <Ionicons name="map-outline" size={32} color="#75837e" />
                                    </View>
                                    <Text style={styles.emptyText}>No routes found matching "{search}"</Text>
                                </View>
                            }
                        />
                    )}
                </View>
            </KeyboardAvoidingView>
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
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#18332a' },
    
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f6f4'
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f6f4',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 52
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16, color: '#18332a', fontWeight: '500', height: '100%' },
    
    content: { flex: 1, backgroundColor: '#fff' },
    listContainer: { paddingBottom: 40, paddingTop: 10 },
    card: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 16, 
        paddingHorizontal: 20,
    },
    cardIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#e3eee8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15
    },
    cardContent: { flex: 1, paddingRight: 15 },
    cardTitle: { fontSize: 16, fontWeight: '600', color: '#18332a', marginBottom: 2 },
    cardSubtitle: { fontSize: 13, color: '#75837e' },
    emptyState: { alignItems: 'center', marginTop: 80 },
    emptyIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f2f6f4', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
    emptyText: { fontSize: 15, color: '#566661', fontWeight: '500' }
});
