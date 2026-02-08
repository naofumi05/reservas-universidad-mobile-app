import { CONFIG } from '@/constants/config';
import { colors } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Card, Divider, HelperText, List, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { user, logout, isLoggingOut } = useAuth();
    const theme = useTheme();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

    // Sincronizar estados locales cuando el usuario cambie
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const updateProfileMutation = useMutation({
        mutationFn: async (data: { name: string; email: string }) => {
            const response = await api.put('/perfil', data);
            return response.data;
        },
        onSuccess: async (data) => {
            queryClient.setQueryData(['user'], data.user);
            await AsyncStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(data.user));
            setEditMode(false);
            setError('');
            setSnackbar({ visible: true, message: 'Perfil actualizado correctamente', type: 'success' });
        },
        onError: (err: any) => {
            const errorMsg = err.response?.data?.message || 'Error al actualizar perfil';
            setError(errorMsg);
            setSnackbar({ visible: true, message: errorMsg, type: 'error' });
        }
    });

    const handleSave = () => {
        if (!name || !email) {
            setError('Todos los campos son obligatorios');
            return;
        }
        updateProfileMutation.mutate({ name, email });
    };

    const handleCancel = () => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setError('');
        setEditMode(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header Premium - VERDE */}
                <LinearGradient
                    colors={[colors.primary, '#059669']}
                    style={styles.profileHeader}
                >
                    <SafeAreaView edges={['top']}>
                        <View style={styles.headerTop}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Mi Perfil</Text>
                            <View style={{ width: 40 }} />
                        </View>

                        <View style={styles.avatarSection}>
                            <View style={styles.avatarBorder}>
                                <Avatar.Text
                                    size={100}
                                    label={user?.name?.substring(0, 2).toUpperCase() || 'US'}
                                    style={styles.avatar}
                                    color={colors.primary}
                                />
                                <TouchableOpacity style={styles.editIconBadge} onPress={() => setEditMode(true)}>
                                    <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.profileName}>{user?.name}</Text>
                            <View style={styles.roleTag}>
                                <MaterialCommunityIcons name="shield-check" size={14} color="#fff" />
                                <Text style={styles.roleTagText}>{user?.role?.nombre?.toUpperCase() || 'ESTUDIANTE'}</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                </LinearGradient>

                <View style={styles.content}>
                    {editMode ? (
                        <Card style={styles.formCard}>
                            <Card.Content>
                                <Text style={styles.formTitle}>Editar Información</Text>
                                <TextInput
                                    label="Nombre Completo"
                                    value={name}
                                    onChangeText={setName}
                                    mode="outlined"
                                    outlineStyle={{ borderRadius: 12 }}
                                    activeOutlineColor={colors.primary}
                                    style={styles.input}
                                    left={<TextInput.Icon icon="account-outline" />}
                                />
                                <TextInput
                                    label="Correo Institucional"
                                    value={email}
                                    onChangeText={setEmail}
                                    mode="outlined"
                                    outlineStyle={{ borderRadius: 12 }}
                                    activeOutlineColor={colors.primary}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={styles.input}
                                    left={<TextInput.Icon icon="email-outline" />}
                                />

                                {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}

                                <View style={styles.formButtons}>
                                    <Button mode="outlined" onPress={handleCancel} style={styles.formBtn} textColor={colors.primary}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        mode="contained"
                                        onPress={handleSave}
                                        loading={updateProfileMutation.isPending}
                                        style={[styles.formBtn, { backgroundColor: colors.primary }]}
                                    >
                                        Guardar
                                    </Button>
                                </View>
                            </Card.Content>
                        </Card>
                    ) : (
                        <>
                            <Card style={styles.infoCard}>
                                <List.Item
                                    title="Información Personal"
                                    left={(props) => <List.Icon {...props} icon="account-details-outline" color={colors.primary} />}
                                />
                                <Divider style={styles.divider} />
                                <List.Item
                                    title="Correo Electrónico"
                                    description={user?.email}
                                    left={(props) => <List.Icon {...props} icon="email-outline" color={colors.primary} />}
                                />
                                <List.Item
                                    title="Token de Usuario"
                                    description={`#${user?.id?.toString().padStart(6, '0')}`}
                                    left={(props) => <List.Icon {...props} icon="identifier" color={colors.primary} />}
                                />
                            </Card>

                            <Text style={styles.sectionLabel}>Configuración</Text>
                            <Card style={styles.infoCard}>
                                <List.Item
                                    title="Notificaciones"
                                    description="Alertas de reservas y avisos"
                                    left={(props) => <List.Icon {...props} icon="bell-outline" color={colors.primary} />}
                                    right={() => <MaterialCommunityIcons name="chevron-right" size={20} color={colors.gray400} />}
                                    onPress={() => router.push('/notifications')}
                                />
                                <Divider style={styles.divider} />
                                <List.Item
                                    title="Seguridad"
                                    description="Cambiar mi contraseña"
                                    left={(props) => <List.Icon {...props} icon="lock-outline" color={colors.primary} />}
                                    right={() => <MaterialCommunityIcons name="chevron-right" size={20} color={colors.gray400} />}
                                    onPress={() => router.push('/auth/change-password')}
                                />
                            </Card>

                            <TouchableOpacity
                                style={styles.logoutBtn}
                                activeOpacity={0.8}
                                onPress={() => {
                                    Alert.alert(
                                        'Cerrar Sesión',
                                        '¿Estás seguro de que deseas salir de la aplicación?',
                                        [
                                            { text: 'Cancelar', style: 'cancel' },
                                            { text: 'Cerrar Sesión', onPress: () => logout(), style: 'destructive' }
                                        ]
                                    );
                                }}
                            >
                                <LinearGradient
                                    colors={['#fef2f2', '#fee2e2']}
                                    style={styles.logoutGradient}
                                >
                                    <MaterialCommunityIcons name="logout-variant" size={22} color="#dc2626" />
                                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>

            <Snackbar
                visible={snackbar.visible}
                onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
                duration={3000}
                style={{ backgroundColor: snackbar.type === 'success' ? '#10B981' : '#EF4444' }}
            >
                {snackbar.message}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileHeader: {
        paddingBottom: 50,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    avatarSection: {
        alignItems: 'center',
        marginTop: 20,
    },
    avatarBorder: {
        padding: 6,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.3)',
        elevation: 10,
    },
    avatar: {
        backgroundColor: '#fff',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 15,
    },
    roleTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 10,
    },
    roleTagText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    content: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    formCard: {
        borderRadius: 24,
        elevation: 4,
        backgroundColor: '#fff',
        padding: 10,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    formButtons: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 10,
    },
    formBtn: {
        flex: 1,
        borderRadius: 14,
        paddingVertical: 4,
    },
    infoCard: {
        borderRadius: 24,
        backgroundColor: '#fff',
        elevation: 2,
        overflow: 'hidden',
        marginBottom: 24,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginHorizontal: 16,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#94A3B8',
        marginLeft: 10,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    logoutBtn: {
        marginTop: 8,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    logoutGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 12,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#dc2626',
    },
});
