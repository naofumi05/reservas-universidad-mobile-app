import { FilterTabs, StatusBadge } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useReservations } from '@/hooks/useReservations';
import { Reservation } from '@/types/models';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Card, FAB, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterStatus = 'todas' | 'activas' | 'canceladas' | 'finalizadas';

export default function ReservationsScreen() {
  const { isAdmin } = useAuth();
  const { reservations, isLoading, refetch } = useReservations();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todas');
  const router = useRouter();

  // Filtrar y ordenar reservas
  const filteredReservations = reservations.filter((reservation) => {
    const isCancelled = reservation.estado === 'cancelada';
    const isPast = new Date(reservation.fecha_fin).getTime() < Date.now();
    const isActive = reservation.estado === 'activa' && !isPast;

    if (filterStatus === 'todas') return true;
    if (filterStatus === 'activas') return isActive;
    if (filterStatus === 'canceladas') return isCancelled;
    if (filterStatus === 'finalizadas') return isPast && !isCancelled;
    return true;
  });

  const sortedReservations = [...filteredReservations].sort((a, b) =>
    new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime()
  );

  const getStatusType = (item: Reservation): 'active' | 'cancelled' | 'completed' => {
    const isCancelled = item.estado === 'cancelada';
    const isPast = new Date(item.fecha_fin).getTime() < Date.now();
    if (isCancelled) return 'cancelled';
    if (isPast) return 'completed';
    return 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.primary;
      case 'cancelled': return colors.error;
      case 'completed': return colors.tertiary;
      default: return colors.gray400;
    }
  };

  const renderItem = ({ item }: { item: Reservation }) => {
    const status = getStatusType(item);
    const statusColor = getStatusColor(status);
    const isCancelled = item.estado === 'cancelada';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push(`/reservation/${item.id}`)}
        style={styles.cardContainer}
      >
        <Card style={[styles.card, isCancelled && styles.cancelledCard]}>
          <View style={styles.cardRow}>
            {/* Indicador de Estado Lateral */}
            <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />

            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.resourceBox}>
                  <Text style={styles.resourceName} numberOfLines={1}>{item.recurso?.nombre || 'Recurso'}</Text>
                  <Text style={styles.locationText} numberOfLines={1}>📍 {item.recurso?.ubicacion || 'Sin ubicación'}</Text>
                </View>
                <StatusBadge status={status} />
              </View>

              <View style={styles.divider} />

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color={colors.gray500} />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Inicio</Text>
                    <Text style={styles.detailValue}>
                      {new Date(item.fecha_inicio).toLocaleDateString()} {new Date(item.fecha_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>

                {isAdmin && item.user && (
                  <View style={[styles.detailItem, { marginTop: spacing.sm }]}>
                    <MaterialCommunityIcons name="account-circle-outline" size={16} color={colors.primary} />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Solicitante</Text>
                      <Text style={styles.detailValue}>{item.user.name}</Text>
                    </View>
                  </View>
                )}
              </View>
            </Card.Content>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const filterOptions = ['Todas', 'Activas', 'Canceladas', 'Finalizadas'];
  const filterMap: Record<string, FilterStatus> = {
    'Todas': 'todas',
    'Activas': 'activas',
    'Canceladas': 'canceladas',
    'Finalizadas': 'finalizadas'
  };

  return (
    <View style={styles.container}>
      {/* Header Premium con Gradiente */}
      <LinearGradient
        colors={[colors.primary, '#059669']}
        style={styles.header}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Mis Reservas</Text>
            <Text style={styles.headerSubtitle}>{sortedReservations.length} encontradas</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Tabs de Filtro estilizados */}
      <View style={styles.filterWrapper}>
        <FilterTabs
          options={filterOptions}
          selected={filterOptions.find(o => filterMap[o] === filterStatus) || 'Todas'}
          onSelect={(option) => setFilterStatus(filterMap[option])}
        />
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loaderText}>Sincronizando reservas...</Text>
        </View>
      ) : (
        <FlatList
          data={sortedReservations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <MaterialCommunityIcons name="calendar-search" size={48} color={colors.gray300} />
              </View>
              <Text style={styles.emptyTitle}>Sin resultados</Text>
              <Text style={styles.emptyText}>No hemos encontrado reservas con estos criterios.</Text>
            </View>
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(tabs)/resources')}
        label="Reservar"
        color="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  filterWrapper: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 5,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  cancelledCard: {
    opacity: 0.65,
    backgroundColor: '#F1F5F9',
  },
  cardRow: {
    flexDirection: 'row',
  },
  statusIndicator: {
    width: 6,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resourceBox: {
    flex: 1,
    marginRight: 10,
  },
  resourceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  locationText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loaderText: {
    marginTop: 15,
    color: '#64748B',
    fontSize: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 16,
    elevation: 6,
  },
});

