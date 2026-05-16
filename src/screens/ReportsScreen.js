import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import { fonts, spacing, borderRadius } from '../styles/theme'
import { useTheme } from '../context/ThemeContext'
import { useData } from '../context/DataContext'
import PremiumGate from '../components/PremiumGate'
import CategoryPieChart from '../components/CategoryPieChart'
import BalanceChart from '../components/BalanceChart'
import { PREMIUM_FEATURES } from '../utils/premiumFeatures'

export default function ReportsScreen() {
  const { colors } = useTheme()
  const { getSaldo, transacoes, categorias, membros } = useData()
  const { saldo, receitas, despesas } = getSaldo()

  const formatMoney = (v) =>
    `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const getCategoriaNome = (id) => categorias.find((c) => c.id === id)?.nome || '—'
  const getMembroNome = (id) => membros.find((m) => m.id === id)?.nome || '—'

  const gerarHtml = () => {
    const linhas = transacoes
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .map(
        (t) => `
        <tr>
          <td>${t.data || '—'}</td>
          <td>${t.descricao}</td>
          <td>${getCategoriaNome(t.categoriaId)}</td>
          <td>${getMembroNome(t.usuarioId)}</td>
          <td style="color:${t.tipo === 'receita' ? '#4CAF50' : '#E53935'}">
            ${t.tipo === 'receita' ? '+' : '-'} ${formatMoney(t.valor)}
          </td>
        </tr>`
      )
      .join('')

    return `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #4A90D9; text-align: center; }
            .resumo { display: flex; justify-content: space-around; margin: 20px 0; }
            .card { text-align: center; padding: 10px; border-radius: 8px; }
            .verde { color: #4CAF50; } .vermelho { color: #E53935; } .azul { color: #4A90D9; }
            .grande { font-size: 20px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #4A90D9; color: white; padding: 8px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Orçamento Familiar</h1>
          <div class="resumo">
            <div class="card"><div class="grande verde">${formatMoney(receitas)}</div>Receitas</div>
            <div class="card"><div class="grande vermelho">${formatMoney(despesas)}</div>Despesas</div>
            <div class="card"><div class="grande azul">${formatMoney(saldo)}</div>Saldo</div>
          </div>
          <table>
            <tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Membro</th><th>Valor</th></tr>
            ${linhas}
          </table>
          <div class="footer">Relatório gerado pelo Orçamento Familiar</div>
        </body>
      </html>`
  }

  const exportarPDF = async () => {
    try {
      const html = gerarHtml()
      const { uri } = await Print.printToFileAsync({ html })
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf' })
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível exportar o PDF')
    }
  }

  const exportarCSV = async () => {
    try {
      const cabecalho = 'Data,Descrição,Categoria,Membro,Valor\n'
      const linhas = transacoes
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .map((t) =>
          [
            t.data || '',
            `"${t.descricao}"`,
            `"${getCategoriaNome(t.categoriaId)}"`,
            `"${getMembroNome(t.usuarioId)}"`,
            t.tipo === 'receita' ? t.valor : -t.valor,
          ].join(',')
        )
        .join('\n')

      const csv = cabecalho + linhas
      const uri = FileSystem.documentDirectory + 'orcamento_familiar.csv'
      await FileSystem.writeAsStringAsync(uri, csv, { encoding: FileSystem.EncodingType.UTF8 })
      await Sharing.shareAsync(uri, { mimeType: 'text/csv' })
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível exportar o CSV')
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.headerBar, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Relatórios</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Resumo Geral</Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Receitas</Text>
          <Text style={[styles.value, { color: colors.success }]}>{formatMoney(receitas)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Despesas</Text>
          <Text style={[styles.value, { color: colors.danger }]}>{formatMoney(despesas)}</Text>
        </View>
        <View style={[styles.row, styles.totalRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text }]}>Saldo</Text>
          <Text style={[styles.value, { color: saldo >= 0 ? colors.success : colors.danger, fontWeight: '800' }]}>
            {formatMoney(saldo)}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.exportBtn, { backgroundColor: colors.danger }]} onPress={exportarPDF}>
        <Ionicons name="document-text" size={20} color={colors.surface} />
        <Text style={[styles.exportText, { color: colors.surface }]}>Exportar PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.exportBtn, { backgroundColor: colors.success }]} onPress={exportarCSV}>
        <Ionicons name="grid" size={20} color={colors.surface} />
        <Text style={[styles.exportText, { color: colors.surface }]}>Exportar Excel (CSV)</Text>
      </TouchableOpacity>

      <View style={{ margin: spacing.md }}>
        <PremiumGate feature={PREMIUM_FEATURES.CHARTS}>
          <CategoryPieChart tipo="receita" />
          <View style={{ height: spacing.md }} />
          <CategoryPieChart tipo="despesa" />
          <BalanceChart />
        </PremiumGate>
      </View>

      <Text style={[styles.info, { color: colors.textLight }]}>
        Os relatórios incluem todas as transações cadastradas, independente do mês.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  headerBar: {
    paddingTop: 56, paddingBottom: spacing.md, paddingHorizontal: spacing.md,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  card: {
    borderRadius: borderRadius.lg, padding: spacing.lg,
    margin: spacing.md, shadowColor: '#000', shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 3,
  },
  cardTitle: { ...fonts.large, marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  totalRow: {
    borderTopWidth: 1, marginTop: spacing.sm, paddingTop: spacing.md,
  },
  label: { ...fonts.medium, fontSize: 15 },
  value: { ...fonts.medium, fontSize: 15 },
  exportBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: spacing.md, marginTop: spacing.md,
    paddingVertical: spacing.md, borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  exportText: { ...fonts.medium, fontSize: 16 },
  info: { ...fonts.small, textAlign: 'center', margin: spacing.md, fontSize: 12 },
})
