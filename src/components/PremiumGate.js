import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSubscription } from '../context/SubscriptionContext'
import { PREMIUM_FEATURES, FEATURE_LABELS } from '../utils/premiumFeatures'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'

export default function PremiumGate({ feature, children, style }) {
  const { isPremium, canAccess } = useSubscription()
  const navigation = useNavigation()
  const unlocked = canAccess(feature)

  if (unlocked) return children

  return (
    <TouchableOpacity
      style={[styles.gate, style]}
      onPress={() => navigation.navigate('Pro')}
      activeOpacity={0.7}
    >
      <View style={styles.overlay}>
        <Ionicons name="lock-closed" size={32} color={colors.primary} />
        <Text style={styles.gateText}>Recurso Pro</Text>
        <Text style={styles.gateSub}>
          {feature ? FEATURE_LABELS[feature] || 'Desbloqueie este recurso' : 'Disponível no Plano Pro'}
        </Text>
        <View style={styles.assinarBtn}>
          <Text style={styles.assinarText}>Torne-se Pro</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  gate: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.primary + '06',
    borderWidth: 2,
    borderColor: colors.primary + '20',
    borderStyle: 'dashed',
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  gateText: { ...fonts.large, fontSize: 18, color: colors.text, marginTop: spacing.xs },
  gateSub: { ...fonts.medium, fontSize: 13, color: colors.textLight, textAlign: 'center' },
  assinarBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  assinarText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
})
