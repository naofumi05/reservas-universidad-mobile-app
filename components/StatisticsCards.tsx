import { useStatistics, Statistics } from '@/hooks/useStatistics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, useTheme, ActivityIndicator } from 'react-native-paper';

export default function StatisticsCards() {
  const { stats, loading } = useStatistics();
  const theme = useTheme();

  if (loading) {
    return <ActivityIndicator size="large" style={styles.container} />;
  }

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text>No hay datos disponibles</Text>
      </View>
    );
  }

  const statCards = [
    {
      title: 'Total Reservas',
      value: stats.totales?.total_reservas || 0,
      icon: 'calendar-check',
      color: theme.colors.primary,
    },
    {
      title: 'Reservas Activas',
      value: stats.totales?.reservas_activas || 0,
      icon: 'clock-check',
      color: theme.colors.tertiary,
    },
    {
      title: 'Total Usuarios',
      value: stats.totales?.total_usuarios || 0,
      icon: 'account-multiple',
      color: '#3B82F6',
    },
    {
      title: 'Total Recursos',
      value: stats.totales?.total_recursos || 0,
      icon: 'domain',
      color: '#8B5CF6',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {statCards.map((card, index) => (
          <Card key={index} style={[styles.card, { marginLeft: index === 0 ? 0 : 8 }]}>
            <Card.Content style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: `${card.color}20` }]}>
                <MaterialCommunityIcons name={card.icon} size={32} color={card.color} />
              </View>
              <Text variant="labelSmall" style={styles.cardTitle}>{card.title}</Text>
              <Text variant="headlineSmall" style={styles.cardValue}>{card.value}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollView: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  card: {
    width: 160,
    marginRight: 8,
  },
  cardContent: {
    padding: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    opacity: 0.7,
    marginBottom: 8,
  },
  cardValue: {
    fontWeight: 'bold',
  },
});
