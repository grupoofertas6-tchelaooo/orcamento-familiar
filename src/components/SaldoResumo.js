import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'

export default function SaldoResumo({ saldo, receitas, despesas }) {
  const formatMoney = (v) =>
    `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Saldo do Mês</Text>
      <Text style={[styles.saldo, { color: saldo >= 0 ? colors.success : colors.danger }]}>
        {formatMoney(saldo)}
      </Text>

      <View style={styles.row}>
        <View style={styles.item}>
          <Ionicons name="arrow-up-circle" size={20} color={colors.success} />
          <Text style={styles.itemLabel}>Receitas</Text>
          <Text style={[styles.itemValue, { color: colors.success }]}>{formatMoney(receitas)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.item}>
          <Ionicons name="arrow-down-circle" size={20} color={colors.danger} />
          <Text style={styles.itemLabel}>Despesas</Text>
          <Text style={[styles.itemValue, { color: colors.danger }]}>{formatMoney(despesas)}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  label: { ...fonts.small, marginBottom: spacing.xs },
  saldo: { ...fonts.money, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  item: { flex: 1, alignItems: 'center' },
  itemLabel: { ...fonts.small, marginTop: spacing.xs },
  itemValue: { ...fonts.medium, marginTop: 2 },
  divider: { width: 1, height: 40, backgroundColor: colors.border },
})
