import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../../constants/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    helperText?: string;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    variant?: 'outlined' | 'filled';
    leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
    rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
    onRightIconPress?: () => void;
    disabled?: boolean;
}

export function Input({
    label,
    error,
    helperText,
    containerStyle,
    inputStyle,
    variant = 'outlined',
    leftIcon,
    rightIcon,
    onRightIconPress,
    disabled = false,
    ...textInputProps
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const getBorderColor = () => {
        if (error) return colors.error;
        if (isFocused) return colors.primary;
        return colors.outline;
    };

    const getBackgroundColor = () => {
        if (disabled) return colors.background; // Or a specific disabled bg color
        if (variant === 'filled') {
            return colors.gray50;
        }
        return colors.surface;
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[
                styles.inputContainer,
                {
                    borderColor: getBorderColor(),
                    backgroundColor: getBackgroundColor(),
                },
                variant === 'filled' && styles.filledInputContainer,
                styles.inputWrapper
            ]}>
                {leftIcon && (
                    <MaterialCommunityIcons
                        name={leftIcon}
                        size={20}
                        color={colors.gray500}
                        style={styles.leftIcon}
                    />
                )}
                <TextInput
                    {...textInputProps}
                    editable={!disabled}
                    style={[
                        styles.input,
                        inputStyle,
                        disabled && styles.disabledInput
                    ]}
                    placeholderTextColor={colors.gray400}
                    onFocus={(e) => {
                        setIsFocused(true);
                        textInputProps.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        textInputProps.onBlur?.(e);
                    }}
                />
                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress}>
                        <MaterialCommunityIcons
                            name={rightIcon}
                            size={20}
                            color={colors.gray500}
                            style={styles.rightIcon}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {(error || helperText) && (
                <Text style={[styles.helperText, error ? styles.errorText : null]}>
                    {error || helperText}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        color: colors.gray700,
        marginBottom: spacing.xs,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.sm,
    },
    inputContainer: {
        // Wrapper styles handled above
    },
    filledInputContainer: {
        borderWidth: 0,
        borderBottomWidth: 2,
        borderRadius: 0,
    },
    input: {
        flex: 1,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xs,
        fontSize: typography.sizes.base,
        color: colors.onSurface,
    },
    disabledInput: {
        color: colors.gray500,
    },
    leftIcon: {
        marginRight: spacing.xs,
    },
    rightIcon: {
        marginLeft: spacing.xs,
    },
    helperText: {
        fontSize: typography.sizes.xs,
        color: colors.gray500,
        marginTop: spacing.xs,
    },
    errorText: {
        color: colors.error,
    },
});
