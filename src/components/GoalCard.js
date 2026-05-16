import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'
import { useData } from '../context/DataContext'

export default function GoalCard({ meta }) {
  const { depositarMeta } = useData()
  const progresso = (meta.valorAtual / meta.valorObjetivo) * 100
  const formatMoney = (v) =>
    `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const diasRestantes = Math.ceil(
    (new Date(meta.dataLimite) - new Date()) / (1000 * 60 * 60 * 24)
  )

  const handleDepositar = () => {
    Alert.prompt
      ? Alert.prompt('Depositar', 'Quanto deseja depositar?', [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Depositar',
            onPress: (valor) => {
              const v = parseFloat(valor?.replace(',', '.'))
              if (v && v > 0) depositarMeta(meta.id, v)
            },
          },
        ], 'plain-text', '', 'decimal-pad')
      : Alert.alert('Depositar', 'Função disponível na versão mobile')
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: meta.cor + '20' }]}>
          <Ionicons name={meta.icone} size={24} color={meta.cor} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.titulo}>{meta.titulo}</Text>
          <Text style={styles.dias}>{diasRestantes} dias restantes</Text>
        </View>
        <Text style={styles.percentual}>{Math.round(progresso)}%</Text>
      </View>

      <View style={styles.barBg}>
        <View
          style={[styles.barFill, { width: `${Math.min(progresso, 100)}%`, backgroundColor: meta.cor }]}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.acumulado}>{formatMoney(meta.valorAtual)}</Text>
        <Text style={styles.objetivo}>{formatMoney(meta.valorObjetivo)}</Text>
      </View>

      <TouchableOpacity style={styles.depositarBtn} onPress={handleDepositar}>
        <Ionicons name="add-circle" size={18} color={colors.primary} />
        <Text style={styles.depositarText}>Depositar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: { flex: 1, marginLeft: spacing.md },
  titulo: { ...fonts.medium, fontSize: 16 },
  dias: { ...fonts.small, marginTop: 2 },
  percentual: { ...fonts.title, fontSize: 22, color: metaCor },
  barBg: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 5 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  acumulado: { ...fonts.medium, fontSize: 14 },
  objetivo: { ...fonts.small, fontSize: 13 },
  depositarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.sm,
  },
  depositarText: { ...fonts.medium, fontSize: 14, color: colors.primary, marginLeft: spacing.xs },
})

const metaCor = '#6C63FF'
