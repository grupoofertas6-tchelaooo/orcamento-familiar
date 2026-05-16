import { View, Text, StyleSheet } from 'react-native'
import { PieChart } from 'react-native-chart-kit'
import { Dimensions } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { fonts, spacing, borderRadius } from '../styles/theme'
import { useData } from '../context/DataContext'

const screenWidth = Dimensions.get('window').width - 48

const PALETA = ['#4A90D9', '#4CAF50', '#FF9800', '#E53935', '#9C27B0', '#00BCD4', '#F48FB1', '#8BC34A']

export default function CategoryPieChart({ tipo }) {
  const { colors } = useTheme()
  const { transacoes, categorias } = useData()

  const filtradas = transacoes.filter((t) => t.tipo === tipo)

  const agrupado = {}
  filtradas.forEach((t) => {
    const nome = categorias.find((c) => c.id === t.categoriaId)?.nome || 'Sem categoria'
    agrupado[nome] = (agrupado[nome] || 0) + Number(t.valor)
  })

  const dados = Object.entries(agrupado)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value], i) => ({
      name: name.length > 12 ? name.slice(0, 12) + '…' : name,
      value: Math.round(value * 100) / 100,
      color: PALETA[i % PALETA.length],
      legendFontColor: colors.text,
      legendFontSize: 12,
    }))

  if (!dados.length) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.surface }]}>
        <Text style={{ ...fonts.medium, color: colors.textLight }}>
          Nenhuma {tipo === 'receita' ? 'receita' : 'despesa'} neste período
        </Text>
      </View>
    )
  }

  const total = dados.reduce((s, d) => s + d.value, 0)

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {tipo === 'receita' ? 'Receitas' : 'Despesas'} por Categoria
      </Text>
      <PieChart
        data={dados}
        width={screenWidth - 32}
        height={180}
        chartConfig={{
          color: () => colors.text,
          labelColor: () => colors.text,
        }}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="0"
        hasLegend={false}
        absolute
      />
      <View style={styles.legend}>
        {dados.map((d, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: d.color }]} />
            <Text style={[styles.legendText, { color: colors.text }]} numberOfLines={1}>
              {d.name}
            </Text>
            <Text style={[styles.legendValue, { color: colors.textSecondary }]}>
              R$ {d.value.toFixed(0)}
            </Text>
          </View>
        ))}
      </View>
      <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
        <Text style={[styles.totalValue, { color: tipo === 'receita' ? colors.success : colors.danger }]}>
          R$ {total.toFixed(2)}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  title: { ...fonts.medium, fontSize: 15, marginBottom: spacing.sm },
  empty: { borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: 'center' },
  legend: { marginTop: spacing.sm, gap: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { flex: 1, ...fonts.small },
  legendValue: { ...fonts.small, fontWeight: '600' },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, marginTop: spacing.sm, paddingTop: spacing.sm,
  },
  totalLabel: { ...fonts.medium },
  totalValue: { ...fonts.medium, fontWeight: '700' },
})
