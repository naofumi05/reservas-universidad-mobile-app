import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../../constants/theme';

interface ButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function Button({
    children,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
    textStyle,
}: ButtonProps) {
    const getVariantStyles = (): ViewStyle => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: colors.primary,
                    ...shadows.sm,
                };
            case 'secondary':
                return {
                    backgroundColor: colors.secondary,
                    ...shadows.sm,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: colors.primary,
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                };
            case 'danger':
                return {
                    backgroundColor: colors.error,
                    ...shadows.sm,
                };
            default:
                return {
                    backgroundColor: colors.primary,
                };
        }
    };

    const getSizeStyles = (): ViewStyle & TextStyle => {
        switch (size) {
            case 'sm':
                return {
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                    fontSize: typography.sizes.sm,
                };
            case 'md':
                return {
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.base,
                    fontSize: typography.sizes.base,
                };
            case 'lg':
                return {
                    paddingVertical: spacing.base,
                    paddingHorizontal: spacing.lg,
                    fontSize: typography.sizes.lg,
                };
            default:
                return {
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.base,
                    fontSize: typography.sizes.base,
                };
        }
    };

    const getTextColor = (): string => {
        if (disabled) return colors.gray400;
        switch (variant) {
            case 'primary':
            case 'secondary':
            case 'danger':
                return colors.onPrimary;
            case 'outline':
            case 'ghost':
                return colors.primary;
            default:
                return colors.onPrimary;
        }
    };

    const sizeStyles = getSizeStyles();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[
                styles.button,
                getVariantStyles(),
                {
                    paddingVertical: sizeStyles.paddingVertical,
                    paddingHorizontal: sizeStyles.paddingHorizontal,
                },
                fullWidth && styles.fullWidth,
                disabled && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} size="small" />
            ) : (
                <Text
                    style={[
                        styles.text,
                        {
                            color: getTextColor(),
                            fontSize: sizeStyles.fontSize,
                        },
                        textStyle,
                    ]}
                >
                    {children}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        fontWeight: typography.weights.semibold,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
});
