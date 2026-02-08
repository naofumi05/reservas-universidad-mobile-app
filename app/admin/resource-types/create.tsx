import { Button, Input, PageHeader } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateResourceTypeScreen() {
    const router = useRouter();
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [activo, setActivo] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!nombre.trim()) newErrors.nombre = 'El nombre es requerido';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await api.post('/tipos-recursos', {
                nombre: nombre.trim(),
                descripcion: descripcion.trim() || null,
                estado: activo ? 1 : 0,
            });

            // Invalidar cache para refrescar listas
            queryClient.invalidateQueries({ queryKey: ['resource-types'] });
            queryClient.invalidateQueries({ queryKey: ['resourceTypes'] });

            Alert.alert('Éxito', 'Tipo de recurso creado correctamente', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.log('Error creating resource type:', error.response?.data || error.message);
            const message = error.response?.data?.message || 'Error al crear el tipo de recurso';
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <PageHeader
                    title="Nuevo Tipo de Recurso"
                    subtitle="Crear un nuevo tipo de recurso"
                    icon="shape-plus"
                />

                <View style={styles.form}>
                    <Input
                        label="Nombre *"
                        value={nombre}
                        onChangeText={setNombre}
                        placeholder="Ej: Laboratorio, Aula, Sala..."
                        leftIcon="tag"
                        error={errors.nombre}
                        disabled={loading}
                    />

                    <Input
                        label="Descripción (opcional)"
                        value={descripcion}
                        onChangeText={setDescripcion}
                        placeholder="Descripción del tipo de recurso"
                        leftIcon="text"
                        multiline
                        numberOfLines={3}
                        disabled={loading}
                    />

                    <View style={styles.switchRow}>
                        <View>
                            <Text style={styles.switchLabel}>Estado</Text>
                            <Text style={styles.switchDescription}>
                                {activo ? 'Activo - visible en el sistema' : 'Inactivo - oculto en el sistema'}
                            </Text>
                        </View>
                        <Switch
                            value={activo}
                            onValueChange={setActivo}
                            trackColor={{ false: colors.gray300, true: colors.primaryLight }}
                            thumbColor={activo ? colors.primary : colors.gray400}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            variant="primary"
                            onPress={handleSubmit}
                            loading={loading}
                            disabled={loading}
                        >
                            Crear Tipo de Recurso
                        </Button>

                        <Button
                            variant="outline"
                            onPress={() => router.back()}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    form: {
        padding: spacing.base,
        gap: spacing.md,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.base,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.gray800,
    },
    switchDescription: {
        fontSize: 12,
        color: colors.gray500,
        marginTop: 2,
    },
    buttonContainer: {
        marginTop: spacing.lg,
        gap: spacing.sm,
    },
});
