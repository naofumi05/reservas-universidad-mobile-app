import { StatCard } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useReservations } from '@/hooks/useReservations';
import { useResources } from '@/hooks/useResources';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Badge, Card, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, isAdmin } = useAuth();
  const { reservations, isLoading } = useReservations();
  const { resources, isLoadingTypes } = useResources();
  const { unreadCount } = useNotifications();
  const theme = useTheme();
  const router = useRouter();

  // Estadísticas del usuario
  const activeReservations = reservations.filter(r => r.estado === 'activa');

  // Próxima reserva
  const nextReservation = activeReservations.length > 0
    ? activeReservations.sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime())[0]
    : null;

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header Premium con Gradiente VERDE */}
        <LinearGradient
          colors={[colors.primary, '#059669']}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={['top']}>
            <View style={styles.topBar}>
              <View style={styles.welcomeInfo}>
                <Text style={styles.greetingText}>Hola,</Text>
                <Text style={styles.userNameText}>{user?.name?.split(' ')[0] || 'Usuario'}</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/notifications')}
                style={styles.notificationBell}
              >
                <MaterialCommunityIcons name="bell" size={26} color="#fff" />
                {unreadCount > 0 && (
                  <Badge size={18} style={styles.badge}>{unreadCount}</Badge>
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Stats Grid - Flotando sobre el gradiente */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <StatCard
                title={isAdmin ? "Total Reservas" : "Mis Reservas"}
                value={reservations.length}
                icon="calendar"
                color="green"
              />
            </View>
            <View style={styles.statItem}>
              <StatCard
                title="Activas"
                value={activeReservations.length}
                icon="clock-fast"
                color="orange"
              />
            </View>
          </View>
        </View>

        {/* Próxima Reserva o Llamado a la Acción */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isAdmin ? 'Estado del Sistema' : 'Tu Próxima Cita'}
            </Text>
            {!isAdmin && (
              <TouchableOpacity onPress={() => router.push('/(tabs)/reservations')}>
                <Text style={styles.seeAllLink}>Ver todas</Text>
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <ActivityIndicator style={{ padding: 40 }} />
          ) : nextReservation ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push(`/reservation/${nextReservation.id}`)}
            >
              <LinearGradient
                colors={['#ffffff', '#f0fdf4']}
                style={styles.nextResCard}
              >
                <View style={[styles.resIconBox, { backgroundColor: '#dcfce7' }]}>
                  <MaterialCommunityIcons
                    name={getResourceIcon(nextReservation.recurso?.nombre || '')}
                    size={28}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.resContent}>
                  <Text style={styles.resName}>{nextReservation.recurso?.nombre || 'Recurso'}</Text>
                  <View style={styles.resDetailRow}>
                    <MaterialCommunityIcons name="calendar-clock" size={14} color={colors.gray500} />
                    <Text style={styles.resDetailText}>
                      {new Date(nextReservation.fecha_inicio).toLocaleDateString()} • {new Date(nextReservation.fecha_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={colors.gray400} />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <Card style={styles.emptyPrompt} onPress={() => router.push('/(tabs)/resources')}>
              <Card.Content style={styles.emptyPromptContent}>
                <View style={[styles.emptyIconCircle, { backgroundColor: '#dcfce7' }]}>
                  <MaterialCommunityIcons name="calendar-plus" size={32} color={colors.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={styles.emptyPromptTitle}>¿Listo para estudiar?</Text>
                  <Text style={styles.emptyPromptSub}>Reserva un espacio ahora mismo</Text>
                </View>
                <MaterialCommunityIcons name="arrow-right" size={20} color={colors.primary} />
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Acciones Rápidas (Restaurando Tipos de Recursos para Admin) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => router.push('/(tabs)/resources')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
                <MaterialCommunityIcons name="plus-box-multiple" size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Nueva</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => router.push('/(tabs)/reservations')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#ecfdf5' }]}>
                <MaterialCommunityIcons name="clipboard-list" size={24} color={colors.primaryDark} />
              </View>
              <Text style={styles.actionLabel}>Reservas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => router.push('/(tabs)/statistics')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
                <MaterialCommunityIcons name="chart-arc" size={24} color="#d97706" />
              </View>
              <Text style={styles.actionLabel}>Reportes</Text>
            </TouchableOpacity>

            {isAdmin ? (
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => router.push('/admin/resource-types')}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#f0f9ff' }]}>
                  <MaterialCommunityIcons name="shape-outline" size={24} color="#0284c7" />
                </View>
                <Text style={styles.actionLabel}>Tipos</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => router.push('/(tabs)/profile')}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#fdf2f8' }]}>
                  <MaterialCommunityIcons name="account-cog" size={24} color="#db2777" />
                </View>
                <Text style={styles.actionLabel}>Perfil</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Consola Administrativa Dinámica */}
        {isAdmin && (
          <View style={[styles.section, { marginBottom: 20 }]}>
            <Text style={styles.sectionTitle}>Consola Administrativa</Text>
            <Card style={styles.adminCard}>
              <TouchableOpacity style={styles.adminRow} onPress={() => router.push('/admin/users')}>
                <MaterialCommunityIcons name="account-group-outline" size={24} color={colors.gray700} />
                <Text style={styles.adminRowText}>Gestión de Usuarios</Text>
                <View style={styles.rowBadge}>
                  <Text style={styles.rowBadgeText}>Activo</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.gray400} />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.adminRow} onPress={() => router.push('/admin/resources')}>
                <MaterialCommunityIcons name="office-building-cog" size={24} color={colors.gray700} />
                <Text style={styles.adminRowText}>Gestión de Recursos</Text>
                <View style={[styles.rowBadge, { backgroundColor: '#f0fdf4' }]}>
                  <Text style={[styles.rowBadgeText, { color: colors.primaryDark }]}>{resources.length}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.gray400} />
              </TouchableOpacity>
            </Card>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerGradient: {
    paddingBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  welcomeInfo: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  userNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationBell: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: -30,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  statItem: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  seeAllLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  nextResCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  resIconBox: {
    width: 55,
    height: 55,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resContent: {
    flex: 1,
    marginLeft: 15,
  },
  resName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  resDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  resDetailText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 5,
  },
  emptyPrompt: {
    borderRadius: 20,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  emptyPromptContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPromptTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  emptyPromptSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  adminCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  adminRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  adminRowText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
  },
  rowBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 10,
  },
  rowBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 18,
  },
});
