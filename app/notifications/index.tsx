import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/types/models';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Badge, Card, IconButton, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
    const { notifications, isLoading, markAsRead, markAllAsRead, refetch } = useNotifications();
    const theme = useTheme();
    const router = useRouter();

    const handleMarkAsRead = (id: number) => {
        markAsRead(String(id));
        // Navigation to reservation detail requires reservation_id which is not in the current API response
        // if (reservationId) {
        //     router.push(`/reservation/${reservationId}`);
        // }
    };

    const renderItem = ({ item }: { item: Notification }) => {
        const isRead = item.leida;

        return (
            <TouchableOpacity onPress={() => handleMarkAsRead(item.id)}>
                <Card style={[styles.card, !isRead && { backgroundColor: theme.colors.primaryContainer }]}>
                    <Card.Content style={styles.cardContent}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons
                                name={item.tipo.includes('Reserva') ? 'calendar-check' : 'bell'}
                                size={24}
                                color={theme.colors.primary}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text variant="bodyLarge" style={{ fontWeight: isRead ? 'normal' : 'bold' }}>
                                {item.mensaje || item.titulo || 'Nueva notificación'}
                            </Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.secondary, marginTop: 4 }}>
                                {new Date(item.created_at).toLocaleString()}
                            </Text>
                        </View>
                        {!isRead && <Badge size={8} style={{ alignSelf: 'center' }} />}
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.title}>Notificaciones</Text>
                <IconButton
                    icon="check-all"
                    mode="contained-tonal"
                    onPress={() => markAllAsRead()}
                />
            </View>

            {isLoading ? (
                <ActivityIndicator style={{ marginTop: 40 }} size="large" />
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.listContent}
                    refreshing={isLoading}
                    onRefresh={refetch}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="bell-off-outline" size={48} color={theme.colors.outline} />
                            <Text style={{ textAlign: 'center', marginTop: 16 }}>No tienes notificaciones.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
    },
    listContent: {
        padding: 16,
    },
    card: {
        marginBottom: 8,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconContainer: {
        marginRight: 16,
        marginTop: 2,
    },
    textContainer: {
        flex: 1,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    }
});
