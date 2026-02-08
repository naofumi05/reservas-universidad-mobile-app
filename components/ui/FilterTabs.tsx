import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../../constants/theme';

interface FilterTabsProps {
    options: string[];
    selected: string;
    onSelect: (option: string) => void;
}

/**
 * FilterTabs - Tabs de filtro como en el diseño web
 * Muestra opciones horizontales tipo tabs (Todas, Activas, etc.)
 */
export function FilterTabs({ options, selected, onSelect }: FilterTabsProps) {
    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>Mostrar:</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {options.map((option) => {
                    const isSelected = option === selected;
                    return (
                        <TouchableOpacity
                            key={option}
                            onPress={() => onSelect(option)}
                            style={[
                                styles.tab,
                                isSelected && styles.tabSelected,
                            ]}
                        >
                            <Text style={[
                                styles.tabText,
                                isSelected && styles.tabTextSelected,
                            ]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: typography.sizes.sm,
        color: colors.gray500,
        marginRight: spacing.sm,
    },
    container: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    tab: {
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    tabSelected: {
        backgroundColor: colors.primaryContainer,
        borderColor: colors.primary,
    },
    tabText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        color: colors.gray600,
    },
    tabTextSelected: {
        color: colors.primary,
    },
});
