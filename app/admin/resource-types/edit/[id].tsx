import { Button, Input, PageHeader } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ResourceType {
    id: number;
    nombre: string;
    descripcion?: string;
    estado: number;
}

export default function EditResourceTypeScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { token } = useAuth();

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [activo, setActivo] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { data: type, isLoading } = useQuery({
        queryKey: ['resource-type', id],
        queryFn: async (): Promise<ResourceType> => {
            const response = await api.get(`/tipos-recursos/${id}`);
            return response.data.data || response.data;
        },
        enabled: !!token && !!id,
    });

    useEffect(() => {
        if (type) {
            setNombre(type.nombre);
            setDescripcion(type.descripcion || '');
            setActivo(type.estado === 1);
        }
    }, [type]);

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
            await api.put(`/tipos-recursos/${id}`, {
                nombre: nombre.trim(),
                descripcion: descripcion.trim() || null,
                estado: activo ? 1 : 0,
            });

            Alert.alert('Éxito', 'Tipo de recurso actualizado correctamente', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al actualizar el tipo de recurso';
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator style={{ marginTop: 100 }} size="large" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <PageHeader
                    title="Editar Tipo de Recurso"
                    subtitle={`Editando: ${type?.nombre || ''}`}
                    icon="pencil"
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
                            Guardar Cambios
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
