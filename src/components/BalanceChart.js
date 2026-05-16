import { View, Text, StyleSheet } from 'react-native'
import { BarChart } from 'react-native-chart-kit'
import { Dimensions } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { fonts, spacing, borderRadius } from '../styles/theme'
import { useData } from '../context/DataContext'

const screenWidth = Dimensions.get('window').width - 48

export default function BalanceChart() {
  const { colors } = useTheme()
  const { transacoes } = useData()

  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ]

  const dataAtual = new Date()
  const ultimos6 = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - i, 1)
    ultimos6.push({ mes: d.getMonth(), ano: d.getFullYear() })
  }

  const labels = ultimos6.map(({ mes }) => meses[mes])
  const values = ultimos6.map(({ mes, ano }) => {
    return transacoes
      .filter((t) => {
        const dt = new Date(t.data)
        return dt.getMonth() === mes && dt.getFullYear() === ano
      })
      .reduce((acc, t) => acc + (t.tipo === 'receita' ? Number(t.valor) : -Number(t.valor)), 0)
  })

  const data = {
    labels,
    datasets: [{ data: values.map((v) => Math.max(v, 0.01)) }],
  }

  const isEmpty = values.every((v) => v === 0)

  if (isEmpty) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.surface }]}>
        <Text style={{ ...fonts.medium, color: colors.textLight }}>
          Nenhum dado nos últimos meses
        </Text>
      </View>
    )
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>Evolução do Saldo</Text>
      <BarChart
        data={data}
        width={screenWidth - 32}
        height={180}
        yAxisLabel="R$"
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => colors.primary,
          labelColor: () => colors.textSecondary,
          barPercentage: 0.6,
          propsForBackgroundLines: {
            strokeDasharray: '4 4',
            stroke: colors.border,
          },
        }}
        fromZero
        showValuesOnTopOfBars={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  title: { ...fonts.medium, fontSize: 15, marginBottom: spacing.sm },
  empty: { borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: 'center' },
})
