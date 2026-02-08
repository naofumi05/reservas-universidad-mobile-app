import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { borderRadius, colors, gradients, spacing, typography } from '../../constants/theme';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    note?: string;
    Icon?: React.ComponentType<any>;
    iconColor?: string;
    textColor?: string;
    gradient?: string[];
    style?: ViewStyle;
}

export function SectionHeader({
    title,
    subtitle,
    note,
    Icon,
    iconColor = colors.onPrimary,
    textColor = colors.onPrimary,
    gradient = gradients.header,
    style,
}: SectionHeaderProps) {
    return (
        <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.container, style]}
        >
            <View style={styles.content}>
                {Icon && (
                    <View style={styles.iconContainer}>
                        <Icon width={28} height={28} color={iconColor} />
                    </View>
                )}
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: textColor }]}>{title}</Text>
                    {subtitle && (
                        <Text style={[styles.subtitle, { color: textColor, opacity: 0.9 }]}>
                            {subtitle}
                        </Text>
                    )}
                    {note && (
                        <Text style={[styles.note, { color: textColor, opacity: 0.8 }]}>
                            {note}
                        </Text>
                    )}
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    content: {
        padding: spacing.base,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: spacing.md,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.weights.bold,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: typography.sizes.sm,
        marginBottom: spacing.xs,
    },
    note: {
        fontSize: typography.sizes.xs,
        fontStyle: 'italic',
    },
});
