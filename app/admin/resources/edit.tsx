import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { resourcesService } from '@/services/resources';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Divider, Menu, SegmentedButtons, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Resource {
  id: number;
  nombre: string;
  descripcion?: string;
  capacidad: number;
  tipo_recurso_id: number;
  tipo_recurso?: { id: number; nombre: string };
  estado: number;
  ubicacion?: string;
}

export default function EditResourceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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

  const { data: resourceTypes = [] } = useQuery({
    queryKey: ['resource-types'],
    queryFn: async () => {
      const response = await api.get('/tipos-recursos');
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    },
  });

  const selectedType = resourceTypes.find((t: any) => t.id?.toString() === formData.tipo_recurso_id);

  useEffect(() => {
    if (id) {
      fetchResource();
    }
  }, [id]);

  const fetchResource = async () => {
    try {
      const response = await api.get<Resource>(`/recursos/${id}`);
      const resource = response.data;
      setFormData({
        nombre: resource.nombre,
        descripcion: resource.descripcion || '',
        capacidad: resource.capacidad.toString(),
        tipo_recurso_id: resource.tipo_recurso_id.toString(),
        estado: resource.estado.toString(),
        ubicacion: resource.ubicacion || '',
      });
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: 'Error cargando recurso',
        type: 'error',
      });
    } finally {
      setInitialLoading(false);
    }
  };

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
      await resourcesService.update(parseInt(id), {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        capacidad: parseInt(formData.capacidad),
        tipo_recurso_id: parseInt(formData.tipo_recurso_id),
        estado: parseInt(formData.estado),
        ubicacion: formData.ubicacion,
      });

      setSnackbar({ visible: true, message: 'Recurso actualizado exitosamente', type: 'success' });
      setTimeout(() => {
        router.push('/admin/resources');
      }, 1000);
    } catch (error: any) {
      console.error('Update error:', error);
      setSnackbar({
        visible: true,
        message: error.response?.data?.message || 'Error actualizando recurso',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Recurso',
      '¿Estás seguro de que deseas eliminar este recurso?',
      [
        { text: 'Cancelar', onPress: () => { } },
        {
          text: 'Eliminar',
          onPress: async () => {
            setLoading(true);
            try {
              await resourcesService.delete(parseInt(id));
              setSnackbar({ visible: true, message: 'Recurso eliminado', type: 'success' });
              setTimeout(() => {
                router.push('/admin/resources');
              }, 1000);
            } catch (error: any) {
              setSnackbar({
                visible: true,
                message: error.response?.data?.message || 'Error eliminando recurso',
                type: 'error',
              });
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>Editar Recurso</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Nombre del Recurso"
            value={formData.nombre}
            onChangeText={(text) => {
              setFormData({ ...formData, nombre: text });
              if (errors.nombre) setErrors({ ...errors, nombre: '' });
            }}
            left={<TextInput.Icon icon="folder" />}
            error={!!errors.nombre}
            style={styles.input}
            editable={!loading}
          />
          {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

          <TextInput
            label="Descripción"
            value={formData.descripcion}
            onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
            left={<TextInput.Icon icon="note-text" />}
            multiline
            numberOfLines={3}
            style={styles.input}
            editable={!loading}
          />

          <Menu
            visible={typeMenuVisible}
            onDismiss={() => setTypeMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setTypeMenuVisible(true)}
                disabled={loading}
                style={styles.typeButton}
              >
                {selectedType ? selectedType.nombre : 'Seleccionar tipo...'}
              </Button>
            }
          >
            {resourceTypes.map((type: any) => (
              <Menu.Item
                key={type.id}
                onPress={() => {
                  setFormData({ ...formData, tipo_recurso_id: type.id.toString() });
                  setTypeMenuVisible(false);
                }}
                title={type.nombre}
              />
            ))}
          </Menu>
          {errors.tipo_recurso_id && <Text style={styles.errorText}>{errors.tipo_recurso_id}</Text>}

          <Divider style={styles.divider} />

          <TextInput
            label="Ubicación"
            value={formData.ubicacion}
            onChangeText={(text) => {
              setFormData({ ...formData, ubicacion: text });
              if (errors.ubicacion) setErrors({ ...errors, ubicacion: '' });
            }}
            left={<TextInput.Icon icon="map-marker" />}
            error={!!errors.ubicacion}
            style={styles.input}
            editable={!loading}
          />
          {errors.ubicacion && <Text style={styles.errorText}>{errors.ubicacion}</Text>}

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <TextInput
                label="Capacidad"
                value={formData.capacidad}
                onChangeText={(text) => {
                  setFormData({ ...formData, capacidad: text });
                  if (errors.capacidad) setErrors({ ...errors, capacidad: '' });
                }}
                keyboardType="number-pad"
                error={!!errors.capacidad}
                style={styles.input}
                editable={!loading}
              />
              {errors.capacidad && <Text style={styles.errorText}>{errors.capacidad}</Text>}
            </View>
          </View>

          <Divider style={styles.divider} />

          <SegmentedButtons
            value={formData.estado}
            onValueChange={(value) => setFormData({ ...formData, estado: value })}
            buttons={[
              { value: '1', label: 'Disponible', icon: 'check-circle' },
              { value: '0', label: 'No disponible', icon: 'close-circle' },
            ]}
            style={styles.stateButtons}
          />
        </View>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => router.push('/admin/resources')}
            disabled={loading}
            style={styles.cancelButton}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.updateButton}
          >
            Actualizar
          </Button>
        </View>

        <Button
          mode="outlined"
          textColor={theme.colors.error}
          onPress={handleDelete}
          disabled={loading}
          style={styles.deleteButton}
        >
          Eliminar Recurso
        </Button>
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
        style={{
          backgroundColor: snackbar.type === 'success' ? theme.colors.tertiary : theme.colors.error,
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
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  form: {
    gap: 12,
    paddingVertical: 16,
  },
  input: {
    marginTop: 0,
  },
  typeButton: {
    marginVertical: 8,
    justifyContent: 'center',
    height: 56,
  },
  divider: {
    marginVertical: 8,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  stateButtons: {
    marginVertical: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -8,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingBottom: 16,
  },
  cancelButton: {
    flex: 1,
  },
  updateButton: {
    flex: 1,
  },
  deleteButton: {
    marginTop: 8,
    marginBottom: 20,
    borderColor: '#EF4444',
  },
});
