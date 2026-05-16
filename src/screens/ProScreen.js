import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'
import { useSubscription } from '../context/SubscriptionContext'
import { PREMIUM_FEATURES, FEATURE_LABELS, FREE_FEATURES } from '../utils/premiumFeatures'

const PREMIUM_LIST = Object.values(PREMIUM_FEATURES).map((k) => FEATURE_LABELS[k])

export default function ProScreen({ navigation }) {
  const { isPremium, purchase, restore, devMode, toggleDevPremium } = useSubscription()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orçamento Familiar Pro</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Ionicons name="diamond" size={48} color={colors.primary} />
          <Text style={styles.heroTitle}>Desbloqueie tudo!</Text>
          <Text style={styles.heroSub}>Tenha acesso a todos os recursos premium do app</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Você já tem acesso</Text>
          {FREE_FEATURES.map((f) => (
            <View key={f} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.section, styles.premiumSection]}>
          <Text style={styles.sectionTitle}>Recursos Pro</Text>
          {PREMIUM_LIST.map((f) => (
            <View key={f} style={styles.featureItem}>
              <Ionicons name="diamond" size={18} color={colors.primary} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {isPremium ? (
          <View style={styles.premiumBadge}>
            <Ionicons name="checkmark-circle" size={32} color={colors.success} />
            <Text style={styles.premiumBadgeText}>Você é Pro! Aproveite todos os recursos.</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.assinarBtn} onPress={purchase}>
              <Text style={styles.assinarText}>Assinar Plano Pro</Text>
              <Text style={styles.assinarSub}>R$ 9,90/mês • Cancele quando quiser</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.restoreBtn} onPress={restore}>
              <Text style={styles.restoreText}>Restaurar compras</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.devSection}>
          <Text style={styles.devTitle}>Modo Desenvolvedor</Text>
          <Text style={styles.devDesc}>Ative para testar recursos Pro sem pagar</Text>
          <TouchableOpacity
            style={[styles.devToggle, devMode && styles.devToggleActive]}
            onPress={toggleDevPremium}
          >
            <Text style={[styles.devToggleText, devMode && { color: '#FFF' }]}>
              {devMode ? 'Premium Ativado' : 'Ativar Premium (DEV)'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: spacing.md, paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  content: { padding: spacing.lg, paddingBottom: 60 },
  hero: { alignItems: 'center', marginVertical: spacing.xl },
  heroTitle: { ...fonts.large, fontSize: 26, marginTop: spacing.md, color: colors.text },
  heroSub: { ...fonts.medium, fontSize: 14, color: colors.textLight, marginTop: spacing.xs, textAlign: 'center' },
  section: { marginBottom: spacing.lg },
  premiumSection: {
    backgroundColor: colors.primary + '08',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  sectionTitle: { ...fonts.medium, fontSize: 16, marginBottom: spacing.md, color: colors.text },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 10 },
  featureText: { ...fonts.medium, fontSize: 14, color: colors.text, flex: 1 },
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.success + '12', borderRadius: borderRadius.lg,
    padding: spacing.lg, marginBottom: spacing.lg,
  },
  premiumBadgeText: { ...fonts.medium, fontSize: 15, color: colors.success, flex: 1 },
  assinarBtn: {
    backgroundColor: colors.primary, borderRadius: borderRadius.lg,
    paddingVertical: spacing.md, alignItems: 'center', marginBottom: spacing.md,
  },
  assinarText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  assinarSub: { color: '#FFF', fontSize: 12, opacity: 0.8, marginTop: 2 },
  restoreBtn: { alignItems: 'center', paddingVertical: spacing.sm, marginBottom: spacing.lg },
  restoreText: { ...fonts.medium, color: colors.primary, fontSize: 14 },
  devSection: {
    marginTop: spacing.lg, padding: spacing.lg,
    backgroundColor: '#FFF3CD', borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: '#FFC107',
  },
  devTitle: { ...fonts.medium, fontSize: 14, color: '#856404', marginBottom: 4 },
  devDesc: { ...fonts.small, fontSize: 12, color: '#856404', marginBottom: spacing.sm },
  devToggle: {
    backgroundColor: '#FFC107', borderRadius: borderRadius.md,
    paddingVertical: 10, alignItems: 'center',
  },
  devToggleActive: { backgroundColor: colors.success },
  devToggleText: { fontWeight: '600', fontSize: 14, color: '#856404' },
})
