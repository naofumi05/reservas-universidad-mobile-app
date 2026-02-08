import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, gradients, spacing, typography } from '../../constants/theme';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

/**
 * PageHeader - Banner verde como en el diseño web
 * Muestra un header con gradiente verde, icono, título y subtítulo
 */
export function PageHeader({ title, subtitle, icon = 'home' }: PageHeaderProps) {
    return (
        <LinearGradient
            colors={gradients.header as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={icon} size={28} color={colors.onPrimary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.base,
        borderRadius: 16,
        marginHorizontal: spacing.base,
        marginTop: spacing.base,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.base,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.onPrimary,
    },
    subtitle: {
        fontSize: typography.sizes.sm,
        color: 'rgba(255, 255, 255, 0.85)',
        marginTop: 2,
    },
});
