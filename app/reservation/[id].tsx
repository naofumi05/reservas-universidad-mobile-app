import { useReservations } from '@/hooks/useReservations';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Divider, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReservationHistory from '@/components/ReservationHistory';

export default function ReservationDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const theme = useTheme();

    const { reservations, cancelReservation, isCanceling } = useReservations();
    // Buscamos en la lista local ya cargada para simplicidad, o podríamos hacer un fetch específico
    const reservation = reservations.find(r => r.id === Number(id));

    if (!reservation) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Reserva no encontrada</Text>
                <Button onPress={() => router.back()}>Volver</Button>
            </SafeAreaView>
        );
    }

    // Fix: Replace space with T to ensure correct ISO parsing in all JS environments
    const isPast = new Date(reservation.fecha_fin.replace(' ', 'T')).getTime() < Date.now();
    const canCancel = reservation.estado === 'activa' && !isPast;

    const handleCancel = () => {
        Alert.alert(
            "Cancelar Reserva",
            "¿Estás seguro que deseas cancelar esta reserva?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Sí, Cancelar", style: 'destructive', onPress: () => {
                        cancelReservation(reservation.id, {
                            onSuccess: () => router.back()
                        });
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.content}>
                <Card style={styles.card}>
                    <Card.Title title="Detalle de Reserva" subtitle={`ID: ${reservation.id}`} />
                    <Card.Content>
                        <View style={styles.row}>
                            <Text variant="labelLarge" style={styles.label}>Recurso:</Text>
                            <Text variant="bodyLarge">{reservation.recurso?.nombre}</Text>
                        </View>
                        <Divider style={styles.divider} />

                        <View style={styles.row}>
                            <Text variant="labelLarge" style={styles.label}>Inicio:</Text>
                            <Text variant="bodyLarge">{new Date(reservation.fecha_inicio).toLocaleString()}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text variant="labelLarge" style={styles.label}>Fin:</Text>
                            <Text variant="bodyLarge">{new Date(reservation.fecha_fin).toLocaleString()}</Text>
                        </View>
                        <Divider style={styles.divider} />

                        <View style={styles.row}>
                            <Text variant="labelLarge" style={styles.label}>Estado:</Text>
                            <Chip>{reservation.estado}</Chip>
                        </View>

                        {reservation.comentarios && (
                            <>
                                <Divider style={styles.divider} />
                                <Text variant="labelLarge" style={styles.label}>Comentarios:</Text>
                                <Text variant="bodyMedium">{reservation.comentarios}</Text>
                            </>
                        )}
                    </Card.Content>
                </Card>

                <ReservationHistory reservationId={reservation.id} />

                {canCancel && (
                    <Button
                        mode="contained"
                        buttonColor={theme.colors.error}
                        style={styles.cancelButton}
                        icon="cancel"
                        onPress={handleCancel}
                        loading={isCanceling}
                        disabled={isCanceling}
                    >
                        Cancelar Reserva
                    </Button>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    card: {
        marginBottom: 24,
    },
    row: {
        marginBottom: 12,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    divider: {
        marginVertical: 12,
    },
    cancelButton: {
        marginTop: 24,
    }
});
