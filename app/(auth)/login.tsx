import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login, isLoggingIn, error } = useAuth();
    const theme = useTheme();

    const handleLogin = () => {
        login({ email, password });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.logoContainer}>
                    {/* Placeholder para logo */}
                    <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.primaryContainer }]}>
                        <Text variant="headlineLarge" style={{ color: theme.colors.primary }}>U</Text>
                    </View>
                    <Text variant="headlineMedium" style={styles.title}>Bienvenido</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>Sistema de Reservas Universitario</Text>
                </View>

                <View style={styles.formContainer}>
                    <TextInput
                        label="Correo Electrónico"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                        left={<TextInput.Icon icon="email" />}
                    />

                    <TextInput
                        label="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry={!showPassword}
                        style={styles.input}
                        left={<TextInput.Icon icon="lock" />}
                        right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                    />

                    {error && (
                        <HelperText type="error" visible={!!error}>
                            {(error as any)?.response?.data?.message || (error as any)?.message || "Credenciales incorrectas o error de conexión."}
                        </HelperText>
                    )}

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        loading={isLoggingIn}
                        disabled={isLoggingIn}
                        style={styles.button}
                        contentStyle={{ height: 50 }}
                    >
                        Iniciar Sesión
                    </Button>

                    <Button
                        mode="text"
                        onPress={() => { }}
                        style={styles.forgotButton}
                    >
                        ¿Olvidaste tu contraseña?
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    formContainer: {
        width: '100%',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        borderRadius: 8,
    },
    forgotButton: {
        marginTop: 16,
    },
});
