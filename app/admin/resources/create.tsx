import { Button, Input, SectionHeader } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { resourcesService } from '@/services/resources';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Divider, Menu, Snackbar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateResourceScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    capacidad: '',
    tipo_recurso_id: '',
    estado: '1',
    ubicacion: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);

  // Fetch resource types
  // Fetch resource types
  const { data: resourceTypes = [], isLoading: isLoadingTypes } = useQuery({
    queryKey: ['resource-types'], // Consistent query key
    queryFn: async () => {
      console.log('Fetching resource types (create resource)...');
      const response = await api.get('/tipos-recursos');
      console.log('Resource types response:', response.data);
      // El controlador devuelve un array directo, así que response.data debería ser el array.
      // Si viniera envuelto, api.get usualmente devuelve response.data como el body.
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    },
  });

  console.log('resourceTypes loaded in UI:', resourceTypes);

  const selectedType = resourceTypes.find((t: any) => t.id?.toString() === formData.tipo_recurso_id);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.capacidad) newErrors.capacidad = 'La capacidad es requerida';
    if (isNaN(Number(formData.capacidad))) newErrors.capacidad = 'Debe ser un número';
    if (!formData.tipo_recurso_id) newErrors.tipo_recurso_id = 'El tipo de recurso es requerido';
    if (!formData.ubicacion.trim()) newErrors.ubicacion = 'La ubicación es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await resourcesService.create({
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        capacidad: parseInt(formData.capacidad),
        tipo_recurso_id: parseInt(formData.tipo_recurso_id),
        estado: parseInt(formData.estado),
        ubicacion: formData.ubicacion,
      });

      // Invalidar cache para refrescar listas (todos los filtros)
      queryClient.invalidateQueries({ queryKey: ['resources'] });

      setSnackbar({ visible: true, message: 'Recurso actualizado exitosamente', type: 'success' });
      setTimeout(() => {
        router.push('/admin/resources');
      }, 1000);
    } catch (error: any) {
      console.error('Create error:', error);
      setSnackbar({
        visible: true,
        message: error.response?.data?.message || 'Error creando recurso',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SectionHeader
          title="Crear Nuevo Recurso"
          subtitle="Complete los datos para registrar un recurso"
          Icon={(props) => <MaterialCommunityIcons name="plus-box" {...props} />}
        />

        <View style={styles.form}>
          <Input
            label="Nombre del Recurso"
            value={formData.nombre}
            onChangeText={(text) => {
              setFormData({ ...formData, nombre: text });
              if (errors.nombre) setErrors({ ...errors, nombre: '' });
            }}
            placeholder="Ej: Laboratorio 1"
            leftIcon="folder"
            error={errors.nombre}
            disabled={loading}
          />

          <Input
            label="Descripción (opcional)"
            value={formData.descripcion}
            onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
            placeholder="Detalles sobre el equipamiento..."
            leftIcon="note-text"
            multiline
            numberOfLines={3}
            disabled={loading}
          />

          <Input
            label="Ubicación"
            value={formData.ubicacion}
            onChangeText={(text) => {
              setFormData({ ...formData, ubicacion: text });
              if (errors.ubicacion) setErrors({ ...errors, ubicacion: '' });
            }}
            placeholder="Ej: Edificio A, Piso 2"
            leftIcon="map-marker"
            error={errors.ubicacion}
            disabled={loading}
          />

          <View>
            <Text variant="bodyMedium" style={styles.label}>Tipo de Recurso</Text>
            <Menu
              visible={typeMenuVisible}
              onDismiss={() => setTypeMenuVisible(false)}
              anchor={
                <Button
                  variant="outline"
                  onPress={() => setTypeMenuVisible(true)}
                  disabled={loading}
                  style={styles.dropdownButton}
                >
                  {selectedType ? selectedType.nombre : 'Seleccionar tipo...'}
                </Button>
              }
            >
              {isLoadingTypes ? (
                <Menu.Item title="Cargando tipos..." disabled />
              ) : resourceTypes.length === 0 ? (
                <Menu.Item title="No hay tipos disponibles" disabled />
              ) : (
                resourceTypes.map((type: any) => (
                  <Menu.Item
                    key={type.id}
                    onPress={() => {
                      console.log('Selected type:', type);
                      setFormData({ ...formData, tipo_recurso_id: type.id.toString() });
                      setTypeMenuVisible(false);
                      if (errors.tipo_recurso_id) setErrors({ ...errors, tipo_recurso_id: '' });
                    }}
                    title={type.nombre}
                  />
                ))
              )}
            </Menu>
            {errors.tipo_recurso_id && <Text style={styles.errorText}>{errors.tipo_recurso_id}</Text>}
          </View>

          <Input
            label="Capacidad"
            value={formData.capacidad}
            onChangeText={(text) => {
              setFormData({ ...formData, capacidad: text });
              if (errors.capacidad) setErrors({ ...errors, capacidad: '' });
            }}
            placeholder="0"
            keyboardType="number-pad"
            error={errors.capacidad}
            disabled={loading}
          />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.actions}>
          <Button
            variant="outline"
            onPress={() => router.back()}
            disabled={loading}
            style={styles.actionButton}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.actionButton}
          >
            Crear Recurso
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
        style={{
          backgroundColor: snackbar.type === 'success' ? theme.colors.primary : theme.colors.error,
        }}
      >
        {snackbar.message}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  label: {
    marginBottom: 4,
    fontWeight: '500',
  },
  dropdownButton: {
    justifyContent: 'flex-start',
  },
  divider: {
    marginVertical: spacing.lg,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});

