import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, Animated } from 'react-native';
import { useAuth } from '../features/auth/AuthContext';
import * as authApi from '../api/auth';
import { saveTokens } from '../storage/secureStore';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { checkAuth } = useAuth();
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Missing Fields", "Please enter both email and password.");
            return;
        }
        setLoading(true);
        try {
            const data = await authApi.login(email, password);
            await saveTokens(data.accessToken, data.refreshToken, data.role);
            await checkAuth();
        } catch (error: any) {
            Alert.alert("Login Failed", "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={styles.container}
            >
                <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
                    <View style={styles.logoContainer}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="bus" size={48} color="#fff" />
                        </View>
                        <Text style={styles.title}>Smart Bus</Text>
                        <Text style={styles.subtitle}>Your ride, simplified.</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#75837e" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email address"
                                placeholderTextColor="#75837e"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#75837e" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#75837e"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                editable={!loading}
                            />
                        </View>

                        <TouchableOpacity 
                            style={[styles.primaryButton, loading && styles.buttonDisabled]} 
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.primaryButtonText}>Sign In</Text>
                            )}
                        </TouchableOpacity>
                        
                        <View style={styles.demoContainer}>
                            <Text style={styles.demoTitle}>Demo Accounts</Text>
                            <TouchableOpacity onPress={() => { setEmail('student@test.com'); setPassword('student123'); }} style={styles.demoPill}>
                                <Text style={styles.demoText}>Student: student@test.com</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setEmail('admin@test.com'); setPassword('admin123'); }} style={styles.demoPill}>
                                <Text style={styles.demoText}>Admin: admin@test.com</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f6f4' },
    content: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
    logoContainer: { alignItems: 'center', marginBottom: 50 },
    iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#18864b', alignItems: 'center', justifyContent: 'center', marginBottom: 20, elevation: 4, shadowColor: '#18864b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
    title: { fontSize: 34, fontWeight: '800', color: '#18332a', letterSpacing: -0.5 },
    subtitle: { fontSize: 16, color: '#566661', marginTop: 8, fontWeight: '500' },
    form: { width: '100%' },
    inputContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        borderRadius: 14, 
        marginBottom: 16, 
        paddingHorizontal: 16,
        borderWidth: 1.5,
        borderColor: '#e3eee8',
        height: 60
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: 16, color: '#18332a', height: '100%', fontWeight: '500' },
    primaryButton: { 
        height: 60, 
        backgroundColor: '#18332a', 
        borderRadius: 14, 
        alignItems: 'center', 
        justifyContent: 'center',
        marginTop: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8
    },
    buttonDisabled: { backgroundColor: '#75837e', shadowOpacity: 0, elevation: 0 },
    primaryButtonText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
    demoContainer: { marginTop: 40, alignItems: 'center' },
    demoTitle: { fontSize: 12, color: '#75837e', textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700', marginBottom: 15 },
    demoPill: { backgroundColor: '#e3eee8', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, marginBottom: 10 },
    demoText: { color: '#18332a', fontSize: 13, fontWeight: '600' }
});
