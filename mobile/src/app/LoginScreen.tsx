import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../features/auth/AuthContext';
import * as authApi from '../api/auth';
import { saveTokens } from '../storage/secureStore';

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { checkAuth } = useAuth();

    const handleLogin = async () => {
        try {
            const data = await authApi.login(email, password);
            await saveTokens(data.accessToken, data.refreshToken, data.role);
            await checkAuth(); // Trigger re-render of nav
        } catch (error: any) {
            Alert.alert("Login Failed", "Invalid credentials");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Smart Bus Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});
