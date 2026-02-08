import { StatusBadge } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Avatar, Card, FAB, Searchbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  estado: number;
  must_change_password: boolean | number;
  role?: { id: number; nombre: string };
}

export default function UsersListScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<User[]> => {
      const response = await api.get('/usuarios');
      return response.data.data || response.data;
    },
    enabled: !!token,
  });

  // Forzar recarga al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.role?.nombre || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (user: User) => {
    Alert.alert(
      'Eliminar Usuario',
      `¿Estás seguro de eliminar a ${user.name}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/usuarios/${user.id}`);
              refetch();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el usuario');
            }
          },
        },
      ]
    );
  };

  const getRoleIcon = (roleName: string) => {
    const name = roleName.toLowerCase();
    if (name.includes('admin')) return 'shield-account';
    return 'account';
  };

  const renderItem = ({ item }: { item: User }) => {
    const isActive = item.estado === 1;
    const indicatorColor = isActive ? colors.primary : colors.error;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push(`/admin/users/edit/${item.id}`)}
        style={styles.cardContainer}
      >
        <Card style={styles.card}>
          <View style={styles.cardRow}>
            {/* Indicador lateral de estado */}
            <View style={[styles.statusIndicator, { backgroundColor: indicatorColor }]} />

            <View style={styles.cardMainContent}>
              <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                  <Avatar.Text
                    size={48}
                    label={item.name.substring(0, 2).toUpperCase()}
                    style={[styles.avatar, { backgroundColor: indicatorColor + '15' }]}
                    labelStyle={{ color: indicatorColor, fontWeight: 'bold' }}
                  />
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                  </View>
                </View>
                <StatusBadge status={isActive ? 'active' : 'inactive'} />
              </View>

              <View style={styles.divider} />

              <View style={styles.infoGrid}>
                <View style={styles.infoBox}>
                  <MaterialCommunityIcons name={getRoleIcon(item.role?.nombre || '')} size={16} color={colors.gray500} />
                  <Text style={styles.infoText}>{item.role?.nombre || 'Estudiante'}</Text>
                </View>
                <View style={[styles.infoBox, { justifyContent: 'flex-end' }]}>
                  <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteIconBtn}>
                    <MaterialCommunityIcons name="delete-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push(`/admin/users/edit/${item.id}`)} style={styles.editIconBtn}>
                    <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.primary} />
                  </TouchableOpacity>
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
            <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
            <Text style={styles.headerSubtitle}>Administra el acceso y roles del sistema</Text>

            <View style={styles.searchRow}>
              <Searchbar
                placeholder="Buscar por nombre o correo..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                inputStyle={styles.searchInput}
                iconColor={colors.primary}
              />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loaderText}>Sincronizando usuarios...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <MaterialCommunityIcons name="account-search-outline" size={48} color={colors.gray300} />
              </View>
              <Text style={styles.emptyTitle}>Sin usuarios</Text>
              <Text style={styles.emptyText}>No hemos encontrado registros con esos datos.</Text>
            </View>
          }
          ListFooterComponent={
            filteredUsers.length > 0 ? (
              <Text style={styles.footerText}>
                Mostrando {filteredUsers.length} de {users.length} usuarios
              </Text>
            ) : null
          }
        />
      )}

      <FAB
        icon="account-plus"
        style={styles.fab}
        onPress={() => router.push('/admin/users/create')}
        color="#fff"
        label="Nuevo"
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  searchRow: {
    marginTop: 20,
  },
  searchBar: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#fff',
    elevation: 4,
  },
  searchInput: {
    fontSize: 14,
    minHeight: 0,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  avatar: {
    borderRadius: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  deleteIconBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#FFF1F0',
    marginRight: 8,
  },
  editIconBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#ecfdf5',
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
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 10,
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
