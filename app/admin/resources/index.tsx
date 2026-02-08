import { useResources } from '@/hooks/useResources';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Card, Searchbar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminResourcesScreen() {
  const { resources = [], isLoadingResources: loading, refetchResources } = useResources();
  const theme = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      refetchResources();
    }, [refetchResources])
  );

  const filteredResources = resources.filter(r =>
    (r.nombre || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.tipo_recurso?.nombre || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderResourceItem = ({ item }: { item: any }) => (
    <Card style={styles.resourceCard} onPress={() => router.push(`/admin/resources/edit?id=${item.id}`)}>
      <Card.Content style={styles.resourceContent}>
        <View style={styles.resourceHeader}>
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" numberOfLines={1}>{item.nombre}</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
              {item.tipo_recurso?.nombre} • Planta {item.planta}
            </Text>
          </View>
          <View style={[styles.capacityBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.capacityText}>{item.capacidad} Pl.</Text>
          </View>
        </View>
        <View style={styles.resourceFooter}>
          <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
            {item.estado === 1 ? '✓ Disponible' : '✗ No disponible'}
          </Text>
          <TouchableOpacity onPress={() => router.push(`/admin/resources/edit?id=${item.id}`)}>
            <MaterialCommunityIcons name="pencil" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Gestionar Recursos</Text>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => router.push('/admin/resources/create')}
          style={styles.createButton}
        >
          Nuevo Recurso
        </Button>
      </View>

      <Searchbar
        placeholder="Buscar por nombre o tipo..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : filteredResources.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MaterialCommunityIcons name="database-search" size={60} color={theme.colors.outline} />
          <Text variant="bodyMedium" style={{ marginTop: 12, color: theme.colors.secondary }}>
            No hay recursos
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredResources}
          renderItem={renderResourceItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  createButton: {
    alignSelf: 'flex-start',
  },
  searchbar: {
    marginBottom: 16,
  },
  listContent: {
    gap: 8,
  },
  resourceCard: {
    marginBottom: 0,
  },
  resourceContent: {
    padding: 12,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  capacityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  capacityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});
