import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../../constants/theme';

type StatColor = 'blue' | 'green' | 'orange' | 'purple' | 'red';

interface StatCardProps {
    title: string;
    value: number | string;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
    color?: StatColor;
}

const colorMap: Record<StatColor, { text: string; bg: string; icon: string }> = {
    blue: { text: colors.info, bg: '#EFF6FF', icon: colors.info },
    green: { text: colors.success, bg: '#ECFDF5', icon: colors.success },
    orange: { text: colors.warning, bg: '#FFF7ED', icon: colors.warning },
    purple: { text: '#8B5CF6', bg: '#F5F3FF', icon: '#8B5CF6' },
    red: { text: colors.error, bg: colors.errorContainer, icon: colors.error },
};

/**
 * StatCard - Tarjeta de estadística como en el diseño web
 * Muestra un título coloreado arriba, valor grande abajo, icono a la derecha
 */
export function StatCard({ title, value, icon = 'chart-line', color = 'blue' }: StatCardProps) {
    const colorStyle = colorMap[color];

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colorStyle.text }]}>{title}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
            <View style={[styles.iconContainer, { backgroundColor: colorStyle.bg }]}>
                <MaterialCommunityIcons name={icon} size={24} color={colorStyle.icon} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.base,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        marginBottom: spacing.xs,
    },
    value: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.weights.bold,
        color: colors.gray900,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacing.sm,
    },
});
