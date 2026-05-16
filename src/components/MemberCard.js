import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'
import { useData } from '../context/DataContext'

export default function MemberCard({ membro }) {
  const { transacoes } = useData()
  const totalGasto = transacoes
    .filter((t) => t.usuarioId === membro.id && t.tipo === 'despesa')
    .reduce((a, t) => a + Number(t.valor), 0)
  const formatMoney = (v) =>
    `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <View style={styles.card}>
      <View style={[styles.avatar, { backgroundColor: membro.cor + '20' }]}>
        <Ionicons name={membro.avatar} size={24} color={membro.cor} />
      </View>
      <View style={styles.info}>
        <Text style={styles.nome}>{membro.nome}</Text>
        <Text style={styles.totalLabel}>Total gasto no mês</Text>
      </View>
      <Text style={[styles.valor, { color: colors.danger }]}>
        {formatMoney(totalGasto)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, marginLeft: spacing.md },
  nome: { ...fonts.medium, fontSize: 15 },
  totalLabel: { ...fonts.small, marginTop: 2 },
  valor: { ...fonts.medium, fontSize: 15 },
})
