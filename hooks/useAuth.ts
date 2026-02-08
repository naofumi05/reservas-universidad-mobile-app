import { CONFIG } from '@/constants/config';
import { authService } from '@/services/auth';
import { User } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';

const KEYS = {
    USER: ['user'],
};

export const useAuth = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const segments = useSegments();
    const [token, setToken] = useState<string | null>(null);

    // Query para obtener el usuario actual (desde caché o API/Storage)
    const { data: user, isLoading: isLoadingUser, isError } = useQuery({
        queryKey: KEYS.USER,
        queryFn: async () => {
            // Intentar recuperar de Storage primero si no hay en memoria
            const storedUser = await AsyncStorage.getItem(CONFIG.STORAGE_KEYS.USER);
            const storedToken = await AsyncStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);

            if (storedToken) {
                setToken(storedToken);
            }

            if (storedUser) {
                return JSON.parse(storedUser) as User;
            }
            return null;
            // O llamar a API /me si se prefiere validar token siempre
            // const user = await authService.me();
            // return user;
        },
        staleTime: Infinity, // Mantener usuario "fresco" hasta logout
    });

    // Mutation para Login
    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: async (data) => {
            await AsyncStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, data.access_token);
            await AsyncStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(data.user));
            setToken(data.access_token);

            // Actualizar caché
            queryClient.setQueryData(KEYS.USER, data.user);

            // Redirigir
            router.replace('/(tabs)');
        },
        onError: (error: any) => {
            console.error('Login error full:', error);
            if (error.response) {
                console.log('Login error status:', error.response.status);
                console.log('Login error data:', error.response.data);

                // Manejar cambio de contraseña obligatorio (403)
                if (error.response.status === 403 && error.response.data?.must_change_password) {
                    const userId = error.response.data.user_id;
                    console.log('Redirecting to change password for user:', userId);
                    router.replace({
                        pathname: '/auth/change-password',
                        params: { userId: userId }
                    });
                    return;
                }
            }
        }
    });

    // Mutation para Logout
    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        onSettled: async () => {
            await AsyncStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
            await AsyncStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
            setToken(null);
            queryClient.setQueryData(KEYS.USER, null);
            router.replace('/(auth)/login');
        },
    });

    // Efecto para protección de rutas
    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)';

        if (isLoadingUser) return;

        if (!user && !inAuthGroup) {
            // Si no hay usuario y no estamos en grupo auth, ir a login
            router.replace('/(auth)/login');
        } else if (user) {
            // Si hay usuario:
            if (user.must_change_password) {
                // Si debe cambiar contraseña, ir a pantalla de cambio
                // Evitar loop si ya estamos ahí
                // @ts-ignore
                if (segments[1] !== 'change-password') {
                    // @ts-ignore
                    router.replace('/auth/change-password');
                }
            } else if (inAuthGroup) {
                // Si no debe cambiar y está en login, ir a home
                router.replace('/(tabs)');
            }
        }
    }, [user, segments, isLoadingUser]);

    return {
        user,
        token,
        isLoading: isLoadingUser,
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        logout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending,
        error: loginMutation.error,
        isAdmin: user?.role?.nombre === 'admin' || user?.role_id === 1 || user?.role === 'admin',
    };
};
