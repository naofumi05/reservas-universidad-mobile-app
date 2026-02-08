import { useAuth } from '@/hooks/useAuth';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

export default function AdminLayout() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario es administrador usando la misma lógica de useAuth
    if (user && !isAdmin) {
      router.replace('/(tabs)');
    }
  }, [user, isAdmin]);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="users/index"
        options={{
          title: 'Gestionar Usuarios',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="users/create"
        options={{
          title: 'Crear Usuario',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="users/edit"
        options={{
          title: 'Editar Usuario',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="resources/index"
        options={{
          title: 'Gestionar Recursos',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="resources/create"
        options={{
          title: 'Crear Recurso',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="resources/edit"
        options={{
          title: 'Editar Recurso',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="resource-types/index"
        options={{
          title: 'Tipos de Recursos',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="resource-types/create"
        options={{
          title: 'Nuevo Tipo',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="resource-types/edit/[id]"
        options={{
          title: 'Editar Tipo',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
