import { useReservations } from '@/hooks/useReservations';
import { useResourceDetails } from '@/hooks/useResources';
import { reservationsService } from '@/services/reservations';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateReservationScreen() {
    const { recurso_id } = useLocalSearchParams();
    const router = useRouter();
    const theme = useTheme();

    const { createReservation, isCreating } = useReservations();
    const { data: resource } = useResourceDetails(Number(recurso_id));

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().getTime() + 60 * 60 * 1000)); // 1 hora después
    const [comments, setComments] = useState('');

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    /**
     * Formats a date object to 'YYYY-MM-DD HH:mm:ss' in LOCAL time.
     */
    const formatToLocalISO = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleCreate = async () => {
        setError('');
        
        if (endDate <= startDate) {
            setError('La fecha de fin debe ser posterior a la de inicio.');
            return;
        }

        const startStr = formatToLocalISO(startDate);
        const endStr = formatToLocalISO(endDate);

        console.log('Attempting to create reservation for resource:', recurso_id);
        console.log('Local Dates:', startStr, 'to', endStr);

        // 1. Verify availability first
        try {
            setIsVerifying(true);
            const conflictData = await reservationsService.checkConflicts(
                Number(recurso_id),
                startStr,
                endStr
            );

            if (conflictData.hay_conflicto) {
                const conflicts = conflictData.conflictos || [];
                const conflictMsg = conflicts.length > 0
                    ? `Conflicto con reserva de ${conflicts[0].usuario} (${conflicts[0].fecha_inicio} - ${conflicts[0].fecha_fin})`
                    : 'El recurso no está disponible en este horario.';
                
                setError(conflictMsg);
                setIsVerifying(false);
                return;
            }
        } catch (err: any) {
            console.error('Error verifying conflicts:', err);
            // If verification fails (e.g. network error), ask user if they want to proceed anyway or stop?
            // Safer to show error.
            setError('Error al verificar disponibilidad: ' + (err.message || 'Error desconocido'));
            setIsVerifying(false);
            return;
        } finally {
            setIsVerifying(false);
        }

        // 2. Create reservation if no conflicts
        createReservation({
            recurso_id: Number(recurso_id),
            fecha_inicio: startStr,
            fecha_fin: endStr,
            comentarios: comments
        }, {
            onSuccess: (data) => {
                console.log('Reservation created successfully:', data);
                Alert.alert('Éxito', 'Reserva creada correctamente', [
                    { text: 'OK', onPress: () => router.replace('/(tabs)/reservations') }
                ]);
            },
            onError: (error: any) => {
                console.error('Error creating reservation:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Error al crear la reserva';
                const errorDetails = error.response?.data?.error || '';
                Alert.alert('Error', `${errorMessage}\n${errorDetails}`);
            }
        });
    };

    const onDateChange = (event: any, selectedDate?: Date, isStart: boolean = true) => {
        const currentDate = selectedDate || (isStart ? startDate : endDate);
        if (Platform.OS === 'android') {
            setShowStartPicker(false);
            setShowEndPicker(false);
        }

        if (isStart) {
            setStartDate(currentDate);
            // Auto-adjust end date if needed (at least 1 hour duration or keep current duration?)
            // Simple logic: if end date calls behind start date, push it forward
            if (endDate <= currentDate) {
                setEndDate(new Date(currentDate.getTime() + 60 * 60 * 1000));
            }
        } else {
            setEndDate(currentDate);
        }
    };

    const showMode = (currentMode: 'date' | 'time', isStart: boolean) => {
        setMode(currentMode);
        if (isStart) setShowStartPicker(true);
        else setShowEndPicker(true);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text variant="headlineSmall" style={styles.title}>Nueva Reserva</Text>
                <Text variant="titleMedium" style={{ marginBottom: 24, color: theme.colors.primary }}>
                    {resource ? `Recurso: ${resource.nombre}` : 'Cargando recurso...'}
                </Text>

                <View style={styles.dateContainer}>
                    <Text variant="labelLarge">Fecha Inicio:</Text>
                    <Button mode="outlined" onPress={() => showMode('date', true)} style={styles.dateButton}>
                        {startDate.toLocaleDateString()}
                    </Button>
                    <Button mode="outlined" onPress={() => showMode('time', true)} style={styles.dateButton}>
                        {startDate.toLocaleTimeString()}
                    </Button>
                </View>

                <View style={styles.dateContainer}>
                    <Text variant="labelLarge">Fecha Fin:   </Text>
                    <Button mode="outlined" onPress={() => showMode('date', false)} style={styles.dateButton}>
                        {endDate.toLocaleDateString()}
                    </Button>
                    <Button mode="outlined" onPress={() => showMode('time', false)} style={styles.dateButton}>
                        {endDate.toLocaleTimeString()}
                    </Button>
                </View>

                {/* Pickers */}
                {showStartPicker && (
                    <DateTimePicker
                        value={startDate}
                        mode={mode}
                        is24Hour={true}
                        onChange={(e, d) => onDateChange(e, d, true)}
                    />
                )}
                {showEndPicker && (
                    <DateTimePicker
                        value={endDate}
                        mode={mode}
                        is24Hour={true}
                        onChange={(e, d) => onDateChange(e, d, false)}
                        minimumDate={startDate}
                    />
                )}

                <TextInput
                    label="Comentarios (Opcional)"
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    value={comments}
                    onChangeText={setComments}
                    style={styles.input}
                />

                {error ? <HelperText type="error" visible>{error}</HelperText> : null}

                <Button
                    mode="contained"
                    onPress={handleCreate}
                    loading={isCreating || isVerifying}
                    disabled={isCreating || isVerifying || !resource}
                    style={styles.button}
                    contentStyle={{ height: 50 }}
                >
                    {isVerifying ? 'Verificando...' : (resource ? 'Confirmar Reserva' : 'Cargando...')}
                </Button>

                <Button mode="text" onPress={() => router.back()} style={{ marginTop: 16 }}>
                    Cancelar
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
        gap: 8,
    },
    dateButton: {
        flex: 1,
    },
    input: {
        marginTop: 16,
        marginBottom: 8,
    },
    button: {
        marginTop: 24,
    }
});

