import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { borderRadius, colors, shadows, spacing } from '../../constants/theme';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'outlined' | 'elevated';
    padding?: number;
    style?: ViewStyle;
}

export function Card({ children, variant = 'default', padding = spacing.base, style }: CardProps) {
    const getVariantStyles = (): ViewStyle => {
        switch (variant) {
            case 'default':
                return {
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    ...shadows.md,
                };
            case 'outlined':
                return {
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.outline,
                };
            case 'elevated':
                return {
                    backgroundColor: colors.surface,
                    ...shadows.lg,
                };
            default:
                return {
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    ...shadows.md,
                };
        }
    };

    return (
        <View style={[styles.card, getVariantStyles(), { padding }, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.xl,
    },
});
