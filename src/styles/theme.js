const light = {
  primary: '#4A90D9',
  primaryLight: '#6FB1FC',
  secondary: '#6C63FF',
  success: '#4CAF50',
  successLight: '#E8F5E9',
  danger: '#E53935',
  dangerLight: '#FFEBEE',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  info: '#2196F3',
  infoLight: '#E3F2FD',

  background: '#F5F7FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',

  border: '#E5E7EB',
  divider: '#F0F0F0',

  pastel: {
    moradia: '#E3F2FD',
    alimentacao: '#FFF3E0',
    transporte: '#F3E5F5',
    educacao: '#E8F5E9',
    saude: '#FCE4EC',
    lazer: '#E0F7FA',
    outros: '#F5F5F5',
  },
}

const dark = {
  primary: '#5BA3E6',
  primaryLight: '#7EC4FF',
  secondary: '#8B83FF',
  success: '#66BB6A',
  successLight: '#1B3D1D',
  danger: '#EF5350',
  dangerLight: '#3D1B1B',
  warning: '#FFB74D',
  warningLight: '#3D2E0D',
  info: '#42A5F5',
  infoLight: '#0D213D',

  background: '#121212',
  surface: '#1E1E1E',
  card: '#252525',

  text: '#E1E1E1',
  textSecondary: '#9E9E9E',
  textLight: '#757575',

  border: '#333333',
  divider: '#2A2A2A',

  pastel: {
    moradia: '#1A2B3D',
    alimentacao: '#3D2E0D',
    transporte: '#2D1B3D',
    educacao: '#0D3D1B',
    saude: '#3D1B25',
    lazer: '#0D3D3D',
    outros: '#2A2A2A',
  },
}

export const colors = light

export function getTheme(isDark) {
  return isDark ? dark : light
}

export { light as lightColors, dark as darkColors }

export const fonts = {
  regular: { fontSize: 14, color: colors.text },
  medium: { fontSize: 16, fontWeight: '600', color: colors.text },
  large: { fontSize: 20, fontWeight: '700', color: colors.text },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  small: { fontSize: 12, color: colors.textSecondary },
  money: { fontSize: 28, fontWeight: '800', color: colors.text },
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
}
