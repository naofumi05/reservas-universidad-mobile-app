import { useAuth } from '@/hooks/useAuth';
import { useResourceDetails } from '@/hooks/useResources';
import api from '@/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, Paragraph, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResourceDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const theme = useTheme();

    const { isAdmin } = useAuth();
    const { data: resource, isLoading } = useResourceDetails(Number(id));
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        Alert.alert(
            "Eliminar Recurso",
            "¿Estás seguro de eliminar este recurso? Esta acción no se puede deshacer.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setIsDeleting(true);
                            await api.delete(`/recursos/${id}`);
                            Alert.alert('Éxito', 'Recurso eliminado', [
                                { text: 'OK', onPress: () => router.replace('/(tabs)/resources') }
                            ]);
                        } catch (error: any) {
                            Alert.alert('Error', error.response?.data?.message || 'No se pudo eliminar el recurso');
                        } finally {
                            setIsDeleting(false);
                        }
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    if (!resource) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Recurso no encontrado</Text>
                <Button onPress={() => router.back()}>Volver</Button>
            </SafeAreaView>
        );
    }

    const getResourceIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('biblio')) return 'book-open-variant';
        if (lowerName.includes('aula') || lowerName.includes('salon')) return 'school';
        if (lowerName.includes('lab')) return 'flask';
        if (lowerName.includes('computo') || lowerName.includes('sistemas')) return 'laptop';
        if (lowerName.includes('auditorio')) return 'account-group';
        if (lowerName.includes('deporte') || lowerName.includes('cancha')) return 'soccer';
        return 'domain';
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Imagen Estándar Minimalista */}
                <Card style={styles.headerCard} mode="elevated">
                    <Card.Cover
                        source={{
                            uri: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1000&auto=format&fit=crop'
                        }}
                        style={styles.coverImage}
                    />
                    <View style={styles.iconOverlay}>
                        <MaterialCommunityIcons
                            name={getResourceIcon(resource.nombre)}
                            size={48}
                            color="#fff"
                        />
                    </View>
                </Card>

                <View style={styles.titleSection}>
                    <Text variant="headlineSmall" style={styles.titleText}>{resource.nombre}</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>{resource.tipo_recurso?.nombre || 'Recurso Universitario'}</Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.row}>
                        <Chip icon="map-marker-outline" style={styles.chip}>{resource.ubicacion}</Chip>
                        <Chip icon="account-group-outline" style={styles.chip}>Capacidad: {resource.capacidad}</Chip>
                    </View>

                    <Text variant="titleMedium" style={styles.sectionTitle}>Descripción</Text>
                    <Paragraph style={styles.description}>{resource.descripcion}</Paragraph>

                    <Text variant="titleMedium" style={styles.sectionTitle}>Disponibilidad</Text>
                    <View style={styles.row}>
                        <Text style={{ color: resource.disponibilidad_general ? theme.colors.primary : theme.colors.error }}>
                            {resource.disponibilidad_general ? 'Disponible para reservas' : 'No disponible temporalmente'}
                        </Text>
                    </View>

                    {isAdmin && (
                        <View style={styles.adminSection}>
                            <Text variant="titleMedium" style={styles.sectionTitle}>Administración</Text>
                            <View style={styles.adminButtons}>
                                <Button
                                    mode="outlined"
                                    icon="pencil"
                                    onPress={() => router.push(`/admin/resources/edit/${id}`)}
                                    style={styles.adminButton}
                                >
                                    Editar
                                </Button>
                                <Button
                                    mode="outlined"
                                    icon="delete"
                                    textColor={theme.colors.error}
                                    style={[styles.adminButton, { borderColor: theme.colors.error }]}
                                    onPress={handleDelete}
                                    loading={isDeleting}
                                    disabled={isDeleting}
                                >
                                    Eliminar
                                </Button>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    icon="calendar-check"
                    onPress={() => router.push(`/reservation/create?recurso_id=${resource.id}`)}
                    disabled={!resource.disponibilidad_general}
                    contentStyle={{ height: 50 }}
                >
                    Reservar este Recurso
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 80,
    },
    headerCard: {
        height: 200,
        borderRadius: 0,
        elevation: 4,
        overflow: 'hidden',
    },
    coverImage: {
        height: 200,
        backgroundColor: '#2c3e50', // Color oscuro de respaldo
    },
    iconOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)', // Oscurecer la imagen estándar
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleSection: {
        padding: 16,
        paddingBottom: 0,
    },
    titleText: {
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        marginBottom: 24,
        lineHeight: 22,
        color: '#444',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    adminSection: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    adminButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    adminButton: {
        flex: 1,
    }
});
