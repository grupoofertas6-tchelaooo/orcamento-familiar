import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'
import { useData } from '../context/DataContext'

export default function CategoryCard({ categoria }) {
  const { transacoes } = useData()
  const gasto = transacoes
    .filter((t) => t.categoriaId === categoria.id && t.tipo === 'despesa')
    .reduce((a, t) => a + Number(t.valor), 0)
  const percentual = (gasto / categoria.limiteMensal) * 100
  const getBarColor = () => {
    if (percentual >= 90) return colors.danger
    if (percentual >= 80) return colors.warning
    return categoria.cor
  }

  const formatMoney = (v) =>
    `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: categoria.cor + '20' }]}>
          <Ionicons name={categoria.icone} size={20} color={categoria.cor} />
        </View>
        <Text style={styles.nome}>{categoria.nome}</Text>
      </View>

      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            {
              width: `${Math.min(percentual, 100)}%`,
              backgroundColor: getBarColor(),
            },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.gasto, percentual >= 80 && { color: getBarColor() }]}>
          {formatMoney(gasto)}
        </Text>
        <Text style={styles.limite}>{formatMoney(categoria.limiteMensal)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nome: { ...fonts.medium, fontSize: 14, marginLeft: spacing.sm },
  barBg: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 4 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  gasto: { ...fonts.small, fontWeight: '600' },
  limite: { ...fonts.small },
})
