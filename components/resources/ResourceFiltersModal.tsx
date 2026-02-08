import { Button, Input } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface FilterState {
    fecha_inicio?: Date;
    fecha_fin?: Date;
    capacidad?: string;
    ubicacion?: string;
}

interface ResourceFiltersModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    onClear: () => void;
    initialFilters?: FilterState;
}

export default function ResourceFiltersModal({
    visible,
    onClose,
    onApply,
    onClear,
    initialFilters,
}: ResourceFiltersModalProps) {
    const theme = useTheme();
    const [filters, setFilters] = useState<FilterState>(initialFilters || {});

    // Date Picker states
    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [showStartTime, setShowStartTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleClear = () => {
        setFilters({});
        onClear();
        onClose();
    };

    const formatDate = (date?: Date) => {
        if (!date) return 'Seleccionar fecha';
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const onDateChange = (type: 'start' | 'end', event: any, selectedDate?: Date) => {
        if (type === 'start') {
            setShowStartDate(false);
            if (selectedDate) {
                const newDate = new Date(selectedDate);
                // Preserve time if previously set, or default to current time
                if (filters.fecha_inicio) {
                    newDate.setHours(filters.fecha_inicio.getHours(), filters.fecha_inicio.getMinutes());
                }
                setFilters(prev => ({ ...prev, fecha_inicio: newDate }));
                setShowStartTime(true); // Ask for time next
            }
        } else {
            setShowEndDate(false);
            if (selectedDate) {
                const newDate = new Date(selectedDate);
                if (filters.fecha_fin) {
                    newDate.setHours(filters.fecha_fin.getHours(), filters.fecha_fin.getMinutes());
                }
                setFilters(prev => ({ ...prev, fecha_fin: newDate }));
                setShowEndTime(true);
            }
        }
    };

    const onTimeChange = (type: 'start' | 'end', event: any, selectedDate?: Date) => {
        if (type === 'start') {
            setShowStartTime(false);
            if (selectedDate && filters.fecha_inicio) {
                const newDate = new Date(filters.fecha_inicio);
                newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
                setFilters(prev => ({ ...prev, fecha_inicio: newDate }));
            }
        } else {
            setShowEndTime(false);
            if (selectedDate && filters.fecha_fin) {
                const newDate = new Date(filters.fecha_fin);
                newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
                setFilters(prev => ({ ...prev, fecha_fin: newDate }));
            }
        }
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.header}>
                        <Text variant="titleLarge" style={styles.title}>Filtros Avanzados</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={24} color={theme.colors.onSurface} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body}>
                        {/* Disponibilidad */}
                        <Text variant="titleMedium" style={styles.sectionTitle}>Disponibilidad</Text>

                        <View style={styles.dateSection}>
                            <Text variant="bodyMedium">Desde:</Text>
                            <TouchableOpacity
                                style={[styles.dateButton, { borderColor: theme.colors.outline }]}
                                onPress={() => setShowStartDate(true)}
                            >
                                <Text>{formatDate(filters.fecha_inicio)}</Text>
                                <MaterialCommunityIcons name="calendar-clock" size={20} color={colors.primary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.dateSection}>
                            <Text variant="bodyMedium">Hasta:</Text>
                            <TouchableOpacity
                                style={[styles.dateButton, { borderColor: theme.colors.outline }]}
                                onPress={() => setShowEndDate(true)}
                            >
                                <Text>{formatDate(filters.fecha_fin)}</Text>
                                <MaterialCommunityIcons name="calendar-clock" size={20} color={colors.primary} />
                            </TouchableOpacity>
                        </View>

                        {/* Capacidad */}
                        <Text variant="titleMedium" style={styles.sectionTitle}>Características</Text>
                        <Input
                            label="Capacidad Mínima (personas)"
                            value={filters.capacidad}
                            onChangeText={(text) => setFilters(prev => ({ ...prev, capacidad: text }))}
                            keyboardType="numeric"
                            placeholder="Ej: 20"
                            leftIcon="account-group"
                        />

                        {/* Ubicación */}
                        <Input
                            label="Ubicación"
                            value={filters.ubicacion}
                            onChangeText={(text) => setFilters(prev => ({ ...prev, ubicacion: text }))}
                            placeholder="Ej: Edificio A"
                            leftIcon="map-marker"
                        />

                        {/* Pickers Logic */}
                        {showStartDate && (
                            <DateTimePicker
                                value={filters.fecha_inicio || new Date()}
                                mode="date"
                                display="default"
                                onChange={(e, d) => onDateChange('start', e, d)}
                            />
                        )}
                        {showStartTime && (
                            <DateTimePicker
                                value={filters.fecha_inicio || new Date()}
                                mode="time"
                                display="default"
                                onChange={(e, d) => onTimeChange('start', e, d)}
                            />
                        )}

                        {showEndDate && (
                            <DateTimePicker
                                value={filters.fecha_fin || new Date()}
                                mode="date"
                                display="default"
                                onChange={(e, d) => onDateChange('end', e, d)}
                                minimumDate={filters.fecha_inicio}
                            />
                        )}
                        {showEndTime && (
                            <DateTimePicker
                                value={filters.fecha_fin || new Date()}
                                mode="time"
                                display="default"
                                onChange={(e, d) => onTimeChange('end', e, d)}
                            />
                        )}

                    </ScrollView>

                    <View style={styles.footer}>
                        <Button
                            variant="outline"
                            onPress={handleClear}
                            style={styles.button}
                            size="md"
                        >
                            Limpiar
                        </Button>
                        <Button
                            variant="primary"
                            onPress={handleApply}
                            style={styles.button}
                            size="md"
                        >
                            Aplicar Filtros
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.lg,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontWeight: 'bold',
    },
    body: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        marginTop: spacing.md,
        marginBottom: spacing.sm,
        fontWeight: '600',
        color: colors.primary,
    },
    dateSection: {
        marginBottom: spacing.sm,
    },
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        borderWidth: 1,
        borderRadius: borderRadius.lg,
        marginTop: spacing.xs,
    },
    footer: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    button: {
        flex: 1,
    },
});
