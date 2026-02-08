import { useAuth } from '@/hooks/useAuth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, TextInput, Text, useTheme, Snackbar, ActivityIndicator, Divider, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import * as config from '@/constants/config';

export default function CreateUserScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'usuario',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!formData.email.includes('@')) newErrors.email = 'Email inválido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    if (formData.password.length < 6) newErrors.password = 'Minimo 6 caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/usuarios`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role_id: formData.role === 'admin' ? 1 : 2,
          estado: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSnackbar({ visible: true, message: 'Usuario creado exitosamente', type: 'success' });
      setTimeout(() => {
        router.push('/admin/users');
      }, 1000);
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.response?.data?.message || 'Error creando usuario',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>Crear Nuevo Usuario</Text>
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
              {
                value: 'usuario',
                label: 'Usuario',
                icon: 'account',
              },
              {
                value: 'admin',
                label: 'Administrador',
                icon: 'shield-admin',
              },
            ]}
            style={styles.roleButtons}
            disabled={loading}
          />

          <Divider style={styles.divider} />

          <TextInput
            label="Contraseña"
            value={formData.password}
            onChangeText={(text) => {
              setFormData({ ...formData, password: text });
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
            left={<TextInput.Icon icon="lock" />}
            secureTextEntry
            error={!!errors.password}
            style={styles.input}
            editable={!loading}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TextInput
            label="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChangeText={(text) => {
              setFormData({ ...formData, confirmPassword: text });
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
            }}
            left={<TextInput.Icon icon="lock-check" />}
            secureTextEntry
            error={!!errors.confirmPassword}
            style={styles.input}
            editable={!loading}
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
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
            style={styles.createButton}
          >
            Crear Usuario
          </Button>
        </View>
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
  createButton: {
    flex: 1,
  },
});
