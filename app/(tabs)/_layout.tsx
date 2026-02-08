import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: 'Recursos',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="bookshelf" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: 'Mis Reservas',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="calendar-clock" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="chart-bar" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" size={size} color={color} />,
        }}
      />
      {/* Hide explore tab */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
