import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

// Paleta de colores - Verde Esmeralda (Diseño Web Easy-Reservas)
export const colors = {
  primary: '#10B981',       // Verde Esmeralda (Emerald-500) - Color principal web
  primaryDark: '#059669',   // Emerald-600
  primaryLight: '#34D399',  // Emerald-400
  onPrimary: '#FFFFFF',
  primaryContainer: '#D1FAE5', // Emerald-100
  onPrimaryContainer: '#064E3B', // Emerald-900

  secondary: '#6B7280',     // Gris (Gray-500)
  secondaryDark: '#4B5563', // Gray-600
  secondaryLight: '#9CA3AF', // Gray-400
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E5E7EB',
  onSecondaryContainer: '#1F2937',

  tertiary: '#3B82F6',      // Azul (Blue-500) para acentos
  tertiaryDark: '#2563EB',  // Blue-600
  onTertiary: '#FFFFFF',

  background: '#F9FAFB',    // Fondo gris claro (como web)
  onBackground: '#1F2937',

  surface: '#FFFFFF',       // Superficies blancas
  onSurface: '#111827',     // Texto oscuro

  error: '#EF4444',         // Red-500
  onError: '#FFFFFF',
  errorContainer: '#FEE2E2', // Red-100

  success: '#10B981',       // Mismo que primary
  info: '#3B82F6',          // Blue-500
  warning: '#F59E0B',       // Amber-500

  outline: '#D1D5DB',       // Gray-300
  border: '#E5E7EB',        // Gray-200

  // Grises para UI
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

// Gradientes (para LinearGradient)
export const gradients = {
  primary: ['#10B981', '#059669'],           // Verde gradient (como header web)
  success: ['#10B981', '#059669'],           // Igual que primary
  header: ['#10B981', '#059669'],            // Header verde (como web)
  background: ['#F9FAFB', '#FFFFFF'],        // Fondo sutil
  accent: ['#3B82F6', '#2563EB'],            // Azul para acentos
};

// Espaciado (como rem del web, pero en números)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,    // 1rem
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

// Border Radius (como rounded-* del web)
export const borderRadius = {
  none: 0,
  sm: 4,       // rounded-sm
  base: 6,     // rounded
  md: 8,       // rounded-md
  lg: 12,      // rounded-lg
  xl: 16,      // rounded-xl
  '2xl': 24,   // rounded-2xl
  full: 9999,  // rounded-full
};

// Sombras (emulando shadow-* de TailwindCSS)
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 12,
  },
};

// Tipografía
export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

// Tema para React Native Paper
export const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
};
