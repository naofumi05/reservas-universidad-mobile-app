import { useAuth } from '@/hooks/useAuth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, TextInput, Text, useTheme, Snackbar, ActivityIndicator, Divider, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import * as config from '@/constants/config';

interface User {
  id: number;
  name: string;
  email: string;
  role?: { id: number; nombre: string };
  role_id?: number;
  estado: number;
}

export default function EditUserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'usuario',
    estado: 1,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await axios.get<User>(`${config.API_BASE_URL}/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = response.data;
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role?.nombre === 'admin' ? 'admin' : 'usuario',
        estado: user.estado,
      });
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: 'Error cargando usuario',
        type: 'error',
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!formData.email.includes('@')) newErrors.email = 'Email inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.put(
        `${config.API_BASE_URL}/usuarios/${id}`,
        {
          name: formData.name,
          email: formData.email,
          role_id: formData.role === 'admin' ? 1 : 2,
          estado: formData.estado,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSnackbar({ visible: true, message: 'Usuario actualizado exitosamente', type: 'success' });
      setTimeout(() => {
        router.push('/admin/users');
      }, 1000);
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.response?.data?.message || 'Error actualizando usuario',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Usuario',
      '¿Estás seguro de que deseas eliminar este usuario?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Eliminar',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`${config.API_BASE_URL}/usuarios/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setSnackbar({ visible: true, message: 'Usuario eliminado', type: 'success' });
              setTimeout(() => {
                router.push('/admin/users');
              }, 1000);
            } catch (error: any) {
              setSnackbar({
                visible: true,
                message: error.response?.data?.message || 'Error eliminando usuario',
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
          <Text variant="headlineSmall" style={styles.title}>Editar Usuario</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Nombre Completo"
            value={formData.name}
            onChangeText={(text) => {
              setFormData({ ...formData, name: text });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            left={<TextInput.Icon icon="account" />}
            error={!!errors.name}
            style={styles.input}
            editable={!loading}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            left={<TextInput.Icon icon="email" />}
            keyboardType="email-address"
            error={!!errors.email}
            style={styles.input}
            editable={!loading}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <Divider style={styles.divider} />

          <SegmentedButtons
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value })}
            buttons={[
              { value: 'usuario', label: 'Usuario', icon: 'account' },
              { value: 'admin', label: 'Admin', icon: 'shield-admin' },
            ]}
            style={styles.roleButtons}
            disabled={loading}
          />

          <Divider style={styles.divider} />

          <SegmentedButtons
            value={formData.estado.toString()}
            onValueChange={(value) => setFormData({ ...formData, estado: parseInt(value) })}
            buttons={[
              { value: '1', label: 'Activo', icon: 'check-circle' },
              { value: '0', label: 'Inactivo', icon: 'close-circle' },
            ]}
            style={styles.roleButtons}
            disabled={loading}
          />
        </View>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => router.push('/admin/users')}
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
          Eliminar Usuario
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
  divider: {
    marginVertical: 8,
  },
  roleButtons: {
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
