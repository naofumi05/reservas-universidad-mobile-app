import api from '@/services/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChangePasswordScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { userId } = useLocalSearchParams(); // Obtener userId de los parámetros de navegación
    // const { user, logout } = useAuth(); // No usamos useAuth aquí porque el usuario no está logueado aún

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (!userId) {
            setError('Error: No se encontró el ID de usuario. Vuelve al login.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/auth/change-password-first-login', {
                user_id: userId,
                new_password: newPassword,
                new_password_confirmation: confirmPassword
            });

            Alert.alert('Éxito', 'Contraseña actualizada correctamente. Por favor inicia sesión nuevamente.', [
                {
                    text: 'OK',
                    onPress: async () => {
                        // await logout(); // No necesario
                        router.replace('/(auth)/login');
                    }
                }
            ]);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Error al cambiar contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <Text variant="headlineMedium" style={styles.title}>Cambio de Contraseña</Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                    Por seguridad, debes cambiar tu contraseña antes de continuar.
                </Text>

                <TextInput
                    label="Nueva Contraseña"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                />

                <TextInput
                    label="Confirmar Contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                />

                {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}

                <Button
                    mode="contained"
                    onPress={handleChangePassword}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                >
                    Actualizar Contraseña
                </Button>

                <Button
                    mode="text"
                    onPress={() => logout()}
                    style={{ marginTop: 20 }}
                >
                    Cancelar y Salir
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        padding: 20,
    },
    title: {
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        marginBottom: 20,
        textAlign: 'center',
        opacity: 0.7
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
    },
});
