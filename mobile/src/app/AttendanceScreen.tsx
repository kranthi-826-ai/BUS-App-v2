import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { api } from '../api';

interface Student {
    id: string;
    name: string;
    attendanceStatus?: string;
}

export const AttendanceScreen = ({ route }: any) => {
    const { tripId, busId } = route.params;
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch students enrolled in this bus
        api.get(`/transport/enrolments/bus/${busId}`)
            .then((res: any) => setStudents(res.data.map((e: any) => ({
                id: e.studentId,
                name: e.studentName || 'Unknown Student',
                attendanceStatus: null
            }))))
            .catch((err: any) => console.warn('Failed to load students', err))
            .finally(() => setLoading(false));
    }, [busId]);

    const markAttendance = async (studentId: string, status: string) => {
        try {
            await api.post(`/attendance/mark`, {
                tripId,
                studentId,
                status,
                source: 'MANUAL'
            });
            setStudents(prev => prev.map(s => s.id === studentId ? { ...s, attendanceStatus: status } : s));
        } catch (e: any) {
            Alert.alert("Error", e.response?.data?.message || "Failed to mark attendance");
        }
    };

    const renderItem = ({ item }: { item: Student }) => (
        <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            {item.attendanceStatus ? (
                <Text style={styles.status}>Status: {item.attendanceStatus}</Text>
            ) : (
                <View style={styles.actions}>
                    <Button title="Present" onPress={() => markAttendance(item.id, 'PRESENT')} color="green" />
                    <View style={{width: 10}} />
                    <Button title="Absent" onPress={() => markAttendance(item.id, 'ABSENT')} color="red" />
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mark Attendance</Text>
            <FlatList
                data={students}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No students enrolled for this bus.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 1 },
    name: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
    actions: { flexDirection: 'row' },
    status: { fontSize: 14, color: '#666', fontStyle: 'italic' }
});
