import ResourceFiltersModal from '@/components/resources/ResourceFiltersModal';
import { colors } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useResources } from '@/hooks/useResources';
import { Resource, ResourceFilters } from '@/types/models';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Card, FAB, Searchbar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResourcesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<ResourceFilters>({});

  const { isAdmin } = useAuth();
  const theme = useTheme();
  const router = useRouter();

  // Construir filtros combinados
  const queryFilters: ResourceFilters = {
    ...(selectedType ? { tipo_recurso_id: selectedType } : {}),
    ...advancedFilters
  };

  const { resources, types, isLoadingResources, refetchResources } = useResources(
    Object.keys(queryFilters).length > 0 ? queryFilters : undefined
  );

  useFocusEffect(
    useCallback(() => {
      refetchResources();
    }, [refetchResources])
  );

  const filteredResources = resources.filter(r =>
    (r.nombre || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.ubicacion || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeFiltersCount = Object.keys(advancedFilters).length;

  const handleApplyFilters = (filters: any) => {
    const newFilters: ResourceFilters = {
      capacidad: filters.capacidad ? parseInt(filters.capacidad) : undefined,
      ubicacion: filters.ubicacion,
      fecha_inicio: filters.fecha_inicio?.toISOString(),
      fecha_fin: filters.fecha_fin?.toISOString(),
    };
    Object.keys(newFilters).forEach(key => (newFilters as any)[key] === undefined && delete (newFilters as any)[key]);
    setAdvancedFilters(newFilters);
  };

  const handleClearFilters = () => setAdvancedFilters({});

  const getResourceIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('biblio')) return 'book-open-variant';
    if (lowerName.includes('aula') || lowerName.includes('salon')) return 'school';
    if (lowerName.includes('lab')) return 'flask';
    if (lowerName.includes('computo') || lowerName.includes('sistemas')) return 'laptop';
    if (lowerName.includes('auditorio')) return 'account-group';
    if (lowerName.includes('deporte') || lowerName.includes('cancha')) return 'soccer';
    return 'domain';
  };

  const getIconColor = (id: number) => {
    const colorsList = ['#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#F59E0B', '#EF4444'];
    return colorsList[id % colorsList.length];
  };

  const renderItem = ({ item }: { item: Resource }) => {
    const statusColor = item.disponibilidad_general ? colors.primary : colors.error;
    const iconBaseColor = getIconColor(item.id);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push(`/resource/${item.id}`)}
        style={styles.cardContainer}
      >
        <Card style={styles.card}>
          <View style={styles.cardRow}>
            {/* Indicador lateral de disponibilidad */}
            <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />

            <View style={styles.cardMainContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: iconBaseColor + '15' }]}>
                  <MaterialCommunityIcons
                    name={getResourceIcon(item.nombre)}
                    size={28}
                    color={iconBaseColor}
                  />
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.resourceName} numberOfLines={1}>{item.nombre}</Text>
                  <View style={styles.locationRow}>
                    <MaterialCommunityIcons name="map-marker" size={12} color={colors.gray400} />
                    <Text style={styles.locationText} numberOfLines={1}>{item.ubicacion}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                <View style={styles.tagGroup}>
                  <View style={styles.tag}>
                    <MaterialCommunityIcons name="account-multiple" size={14} color={colors.gray600} />
                    <Text style={styles.tagText}>{item.capacidad}</Text>
                  </View>
                  {item.tipo_recurso && (
                    <View style={styles.tag}>
                      <MaterialCommunityIcons name="tag-outline" size={14} color={colors.gray600} />
                      <Text style={styles.tagText}>{item.tipo_recurso.nombre}</Text>
                    </View>
                  )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                  <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                    {item.disponibilidad_general ? 'LIBRE' : 'OCUPADO'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Premium con Gradiente Verde */}
      <LinearGradient
        colors={[colors.primary, '#059669']}
        style={styles.header}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Recursos</Text>
            <Text style={styles.headerSubtitle}>Explora y reserva espacios universitarios</Text>

            <View style={styles.searchRow}>
              <Searchbar
                placeholder="Buscar por nombre o lugar..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                inputStyle={styles.searchInput}
                iconColor={colors.primary}
                placeholderTextColor={colors.gray400}
              />
              <TouchableOpacity
                onPress={() => setShowFiltersModal(true)}
                style={styles.filterIconButton}
              >
                <MaterialCommunityIcons
                  name={activeFiltersCount > 0 ? "filter-check" : "filter-variant"}
                  size={24}
                  color="#fff"
                />
                {activeFiltersCount > 0 && <View style={styles.filterDot} />}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Selector de Categorías (Tipos) */}
      <View style={styles.typesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={types}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.typesContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedType(selectedType === item.id ? null : item.id)}
              style={[
                styles.typeChip,
                selectedType === item.id && styles.typeChipSelected
              ]}
            >
              <Text style={[
                styles.typeChipText,
                selectedType === item.id && styles.typeChipTextSelected
              ]}>
                {item.nombre}
              </Text>
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <TouchableOpacity
              onPress={() => setSelectedType(null)}
              style={[
                styles.typeChip,
                selectedType === null && styles.typeChipSelected
              ]}
            >
              <Text style={[
                styles.typeChipText,
                selectedType === null && styles.typeChipTextSelected
              ]}>
                Todos
              </Text>
            </TouchableOpacity>
          }
        />
      </View>

      {isLoadingResources ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loaderText}>Cargando recursos...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredResources}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={refetchResources}
          refreshing={isLoadingResources}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <MaterialCommunityIcons name="domain-off" size={48} color={colors.gray300} />
              </View>
              <Text style={styles.emptyTitle}>No hay resultados</Text>
              <Text style={styles.emptyText}>Prueba ajustando los filtros o la búsqueda.</Text>
            </View>
          }
        />
      )}

      {isAdmin && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => router.push('/admin/resources/create')}
          color="#fff"
        />
      )}

      <ResourceFiltersModal
        visible={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        initialFilters={{
          capacidad: advancedFilters.capacidad?.toString(),
          ubicacion: advancedFilters.ubicacion,
          fecha_inicio: advancedFilters.fecha_inicio ? new Date(advancedFilters.fecha_inicio) : undefined,
          fecha_fin: advancedFilters.fecha_fin ? new Date(advancedFilters.fecha_fin) : undefined,
        }}
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
    paddingBottom: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#fff',
    elevation: 4,
  },
  searchInput: {
    fontSize: 14,
    minHeight: 0,
  },
  filterIconButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  typesWrapper: {
    marginTop: -15,
  },
  typesContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  typeChipSelected: {
    backgroundColor: colors.primary,
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray600,
  },
  typeChipTextSelected: {
    color: '#fff',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
  },
  statusIndicator: {
    width: 6,
    height: '100%',
  },
  cardMainContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    flex: 1,
  },
  resourceName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 13,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
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
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 16,
  },
});
