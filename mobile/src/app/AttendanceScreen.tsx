import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Student {
    id: string;
    name: string;
    attendanceStatus?: string;
}

export const AttendanceScreen = ({ route }: any) => {
    const { tripId, busId } = route.params;
    const navigation = useNavigation<any>();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch students enrolled in this bus
        api.get(`/transport/enrolments/bus/${busId}`)
            .then((res: any) => setStudents(res.data.map((e: any) => ({
                id: e.student.id,
                name: e.student.name || 'Unknown Student',
                attendanceStatus: null
            }))))
            .catch((err: any) => {
                console.warn('Failed to load students', err);
                // Mock data fallback for prototype demonstration
                setStudents([
                    { id: 'student-1', name: 'John Doe (Demo)' },
                    { id: 'student-2', name: 'Jane Smith (Demo)' },
                    { id: 'student-3', name: 'Alice Johnson (Demo)' }
                ]);
            })
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
            // Still update UI for demo purposes
            setStudents(prev => prev.map(s => s.id === studentId ? { ...s, attendanceStatus: status } : s));
        }
    };

    const renderItem = ({ item }: { item: Student }) => (
        <View style={styles.card}>
            <View style={styles.studentInfo}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                </View>
                <Text style={styles.name}>{item.name}</Text>
            </View>

            {item.attendanceStatus ? (
                <View style={[styles.statusBadge, item.attendanceStatus === 'PRESENT' ? styles.statusPresent : styles.statusAbsent]}>
                    <Ionicons 
                        name={item.attendanceStatus === 'PRESENT' ? "checkmark-circle" : "close-circle"} 
                        size={16} 
                        color={item.attendanceStatus === 'PRESENT' ? "#18864b" : "#d32f2f"} 
                    />
                    <Text style={[styles.statusText, item.attendanceStatus === 'PRESENT' ? styles.statusTextPresent : styles.statusTextAbsent]}>
                        {item.attendanceStatus}
                    </Text>
                </View>
            ) : (
                <View style={styles.actions}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.presentButton]} 
                        onPress={() => markAttendance(item.id, 'PRESENT')}
                    >
                        <Ionicons name="checkmark" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.absentButton]} 
                        onPress={() => markAttendance(item.id, 'ABSENT')}
                    >
                        <Ionicons name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#18332a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Student Attendance</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.prompt}>Mark attendance for this trip</Text>
                
                {loading ? (
                    <ActivityIndicator style={{marginTop: 40}} size="large" color="#18864b" />
                ) : (
                    <FlatList
                        data={students}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Ionicons name="people-outline" size={48} color="#aaa" />
                                <Text style={styles.emptyText}>No students enrolled for this bus.</Text>
                            </View>
                        }
                    />
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
        paddingHorizontal: 20, 
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: { marginRight: 15 },
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#18332a' },
    content: { 
        flex: 1, 
        backgroundColor: '#fff', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        paddingHorizontal: 20, 
        paddingTop: 30, 
        elevation: 10, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: -3 }, 
        shadowOpacity: 0.1 
    },
    prompt: { fontSize: 16, color: '#566661', marginBottom: 20, fontWeight: '600' },
    listContainer: { paddingBottom: 40 },
    card: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: '#fff', 
        paddingVertical: 16, 
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    studentInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e3eee8', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    avatarText: { fontSize: 18, fontWeight: '700', color: '#18864b' },
    name: { fontSize: 16, fontWeight: '600', color: '#18332a' },
    actions: { flexDirection: 'row', gap: 10 },
    actionButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    presentButton: { backgroundColor: '#18864b' },
    absentButton: { backgroundColor: '#d32f2f' },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 4 },
    statusPresent: { backgroundColor: '#e6ffe6' },
    statusAbsent: { backgroundColor: '#ffe6e6' },
    statusText: { fontSize: 12, fontWeight: '700' },
    statusTextPresent: { color: '#18864b' },
    statusTextAbsent: { color: '#d32f2f' },
    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyText: { fontSize: 16, color: '#aaa', marginTop: 15 }
});
