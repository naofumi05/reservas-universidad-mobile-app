import { Button, Input, SectionHeader } from '@/components/ui';
import * as config from '@/constants/config';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useResourceDetails } from '@/hooks/useResources';
import api from '@/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { ActivityIndicator, HelperText, Menu, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditResourceScreen() {
    const { id } = useLocalSearchParams();
    const theme = useTheme();
    const router = useRouter();
    const { token } = useAuth();

    // Load existing data
    const { data: resource, isLoading: isLoadingResource } = useResourceDetails(Number(id));

    // Load types
    const { data: resourceTypes = [] } = useQuery({
        queryKey: ['resourceTypes'],
        queryFn: async () => {
            if (!token) return [];
            const response = await api.get(`${config.API_BASE_URL}/tipos-recursos`);
            return response.data.data || response.data;
        },
        enabled: !!token,
    });

    const [nombre, setNombre] = useState('');
    const [tipoId, setTipoId] = useState('');
    const [capacidad, setCapacidad] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [planta, setPlanta] = useState('');
    const [disponibilidad, setDisponibilidad] = useState(true);
    const [estado, setEstado] = useState('1');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [typeMenuVisible, setTypeMenuVisible] = useState(false);
    const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' });

    // Populate form
    useEffect(() => {
        if (resource) {
            setNombre(resource.nombre);
            setTipoId(resource.tipo_recurso_id?.toString() || '');
            setCapacidad(resource.capacidad?.toString() || '');
            setUbicacion(resource.ubicacion || '');
            setDescripcion(resource.descripcion || '');
            setPlanta(resource.planta?.toString() || '');
            setDisponibilidad(resource.disponibilidad_general);
            setEstado(resource.estado?.toString() || '1');
        }
    }, [resource]);

    const handleUpdate = async () => {
        if (!nombre || !capacidad || !ubicacion) {
            setError('Nombre, capacidad y ubicación son obligatorios');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.put(`/recursos/${id}`, {
                nombre,
                tipo_recurso_id: parseInt(tipoId),
                capacidad: parseInt(capacidad),
                ubicacion,
                descripcion,
                planta: parseInt(planta),
                disponibilidad_general: disponibilidad,
                estado: parseInt(estado)
            });
            Alert.alert('Éxito', 'Recurso actualizado correctamente', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || 'Error al actualizar recurso';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const selectedType = resourceTypes.find((t: any) => t.id?.toString() === tipoId);

    if (isLoadingResource) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <SectionHeader
                    title="Editar Recurso"
                    subtitle={`Editando: ${resource?.nombre || ''}`}
                    Icon={(props) => <MaterialCommunityIcons name="pencil" {...props} />}
                />

                <View style={styles.form}>
                    <Input
                        label="Nombre del Recurso"
                        value={nombre}
                        onChangeText={setNombre}
                        placeholder="Ej. Aula 202"
                        leftIcon="folder"
                        disabled={loading}
                    />

                    <View>
                        <Text variant="bodyMedium" style={styles.label}>Tipo de Recurso</Text>
                        <Menu
                            visible={typeMenuVisible}
                            onDismiss={() => setTypeMenuVisible(false)}
                            anchor={
                                <Button
                                    variant="outline"
                                    onPress={() => setTypeMenuVisible(true)}
                                    disabled={loading}
                                    style={styles.dropdownButton}
                                >
                                    {selectedType ? selectedType.nombre : 'Seleccionar tipo...'}
                                </Button>
                            }
                        >
                            {resourceTypes.map((type: any) => (
                                <Menu.Item
                                    key={type.id}
                                    onPress={() => {
                                        setTipoId(type.id.toString());
                                        setTypeMenuVisible(false);
                                    }}
                                    title={type.nombre}
                                />
                            ))}
                        </Menu>
                    </View>

                    <View style={styles.rowInputs}>
                        <View style={styles.halfInput}>
                            <Input
                                label="Capacidad"
                                value={capacidad}
                                onChangeText={setCapacidad}
                                keyboardType="numeric"
                                disabled={loading}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Input
                                label="Planta"
                                value={planta}
                                onChangeText={setPlanta}
                                keyboardType="numeric"
                                disabled={loading}
                            />
                        </View>
                    </View>

                    <Input
                        label="Ubicación"
                        value={ubicacion}
                        onChangeText={setUbicacion}
                        placeholder="Ej. Edificio B, Piso 2"
                        leftIcon="map-marker"
                        disabled={loading}
                    />

                    <Input
                        label="Descripción"
                        value={descripcion}
                        onChangeText={setDescripcion}
                        multiline
                        numberOfLines={3}
                        leftIcon="note-text"
                        disabled={loading}
                    />

                    <View style={styles.switchContainer}>
                        <Text variant="bodyMedium">Disponible Generalmente</Text>
                        <Switch
                            value={disponibilidad}
                            onValueChange={setDisponibilidad}
                            trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primaryContainer }}
                            thumbColor={disponibilidad ? theme.colors.primary : theme.colors.outline}
                        />
                    </View>

                    <View style={styles.switchContainer}>
                        <Text variant="bodyMedium">Estado (Activo)</Text>
                        <Switch
                            value={estado === '1'}
                            onValueChange={(v) => setEstado(v ? '1' : '0')}
                            trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primaryContainer }}
                            thumbColor={estado === '1' ? theme.colors.primary : theme.colors.outline}
                        />
                    </View>

                    {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}

                    <View style={styles.actions}>
                        <Button
                            variant="outline"
                            onPress={() => router.back()}
                            style={styles.actionButton}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onPress={handleUpdate}
                            loading={loading}
                            disabled={loading}
                            style={styles.actionButton}
                        >
                            Guardar Cambios
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
    },
    content: {
        padding: spacing.base,
        paddingBottom: spacing.xl,
    },
    form: {
        gap: spacing.md,
        marginTop: spacing.md,
    },
    label: {
        marginBottom: 4,
        fontWeight: '500',
    },
    dropdownButton: {
        justifyContent: 'flex-start',
    },
    rowInputs: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    halfInput: {
        flex: 1,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 8,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.lg,
    },
    actionButton: {
        flex: 1,
    }
});
