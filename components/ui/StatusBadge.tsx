import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../../constants/theme';

type StatusType = 'active' | 'inactive' | 'pending' | 'cancelled' | 'completed';

interface StatusBadgeProps {
    status: StatusType;
    label?: string;
}

const statusConfig: Record<StatusType, { label: string; bg: string; text: string; dot: string }> = {
    active: {
        label: 'Activo',
        bg: '#ECFDF5',
        text: colors.success,
        dot: colors.success,
    },
    inactive: {
        label: 'Inactivo',
        bg: colors.errorContainer,
        text: colors.error,
        dot: colors.error,
    },
    pending: {
        label: 'Pendiente',
        bg: '#FEF3C7',
        text: '#D97706',
        dot: '#D97706',
    },
    cancelled: {
        label: 'Cancelada',
        bg: colors.errorContainer,
        text: colors.error,
        dot: colors.error,
    },
    completed: {
        label: 'Finalizada',
        bg: '#E0E7FF',
        text: '#4F46E5',
        dot: '#4F46E5',
    },
};

/**
 * StatusBadge - Badge de estado como en el diseño web
 * Muestra un punto de color + texto con fondo suave
 */
export function StatusBadge({ status, label }: StatusBadgeProps) {
    const config = statusConfig[status];
    const displayLabel = label || config.label;

    return (
        <View style={[styles.container, { backgroundColor: config.bg }]}>
            <View style={[styles.dot, { backgroundColor: config.dot }]} />
            <Text style={[styles.label, { color: config.text }]}>{displayLabel}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: spacing.xs,
    },
    label: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
    },
});
