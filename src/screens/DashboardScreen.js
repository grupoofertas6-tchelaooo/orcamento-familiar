import { useState, useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { fonts, spacing, borderRadius } from '../styles/theme'
import { useTheme } from '../context/ThemeContext'
import SaldoResumo from '../components/SaldoResumo'
import MonthSelector from '../components/MonthSelector'
import SearchBar from '../components/SearchBar'
import TransactionCard from '../components/TransactionCard'
import CategoryPieChart from '../components/CategoryPieChart'
import BalanceChart from '../components/BalanceChart'
import PremiumGate from '../components/PremiumGate'
import { PREMIUM_FEATURES } from '../utils/premiumFeatures'
import { useData } from '../context/DataContext'

export default function DashboardScreen({ navigation }) {
  const { colors } = useTheme()
  const { transacoes, getSaldo, deleteTransacao } = useData()
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth())
  const [busca, setBusca] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('todas')

  const transacoesFiltradas = useMemo(() => {
    let lista = transacoes
    const mes = mesSelecionado
    const ano = new Date().getFullYear()
    lista = lista.filter((t) => {
      const d = new Date(t.data)
      return d.getMonth() === mes && d.getFullYear() === ano
    })
    if (busca.trim()) {
      const q = busca.toLowerCase()
      lista = lista.filter((t) => t.descricao?.toLowerCase().includes(q))
    }
    if (tipoFiltro !== 'todas') {
      lista = lista.filter((t) => t.tipo === tipoFiltro)
    }
    return lista.sort((a, b) => new Date(b.data) - new Date(a.data))
  }, [transacoes, mesSelecionado, busca, tipoFiltro])

  const saldoMes = useMemo(() => {
    const receitas = transacoesFiltradas.filter((t) => t.tipo === 'receita').reduce((a, t) => a + Number(t.valor), 0)
    const despesas = transacoesFiltradas.filter((t) => t.tipo === 'despesa').reduce((a, t) => a + Number(t.valor), 0)
    return { saldo: receitas - despesas, receitas, despesas }
  }, [transacoesFiltradas])

  const confirmDelete = (t) => {
    Alert.alert('Excluir', `Remover "${t.descricao}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteTransacao(t.id) },
    ])
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerBar, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Início</Text>
      </View>
      <MonthSelector mesSelecionado={mesSelecionado} onSelect={setMesSelecionado} />
      <SearchBar value={busca} onChangeText={setBusca} tipoFiltro={tipoFiltro} onToggleTipo={setTipoFiltro} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <SaldoResumo saldo={saldoMes.saldo} receitas={saldoMes.receitas} despesas={saldoMes.despesas} />

        <View style={styles.acoesRow}>
          <TouchableOpacity
            style={[styles.acaoBtn, { backgroundColor: colors.successLight }]}
            onPress={() => navigation.navigate('AddTransaction', { tipo: 'receita' })}
          >
            <Ionicons name="add-circle" size={22} color={colors.success} />
            <Text style={[styles.acaoText, { color: colors.success }]}>Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.acaoBtn, { backgroundColor: colors.dangerLight }]}
            onPress={() => navigation.navigate('AddTransaction', { tipo: 'despesa' })}
          >
            <Ionicons name="remove-circle" size={22} color={colors.danger} />
            <Text style={[styles.acaoText, { color: colors.danger }]}>Despesa</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginHorizontal: spacing.md, marginTop: spacing.md }}>
          <PremiumGate feature={PREMIUM_FEATURES.CHARTS}>
            <CategoryPieChart tipo="despesa" />
            <BalanceChart />
          </PremiumGate>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Extrato</Text>
          {transacoesFiltradas.length > 0 && (
            <Text style={[styles.totalCount, { color: colors.primary }]}>{transacoesFiltradas.length} registro(s)</Text>
          )}
        </View>

        {transacoesFiltradas.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={48} color={colors.textLight} />
            <Text style={[styles.emptyText, { color: colors.textLight }]}>Nenhuma transação</Text>
            <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
              {busca ? 'Nada encontrado para esta busca' : 'Adicione receitas e despesas'}
            </Text>
          </View>
        ) : (
          transacoesFiltradas.map((t) => (
            <TouchableOpacity
              key={t.id}
              onLongPress={() => confirmDelete(t)}
              onPress={() => navigation.navigate('AddTransaction', { transacao: t })}
            >
              <TransactionCard transacao={t} />
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  headerBar: {
    paddingTop: 56, paddingBottom: spacing.md, paddingHorizontal: spacing.md,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  acoesRow: {
    flexDirection: 'row', marginHorizontal: spacing.md, marginTop: spacing.md, gap: spacing.sm,
  },
  acaoBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing.md, borderRadius: borderRadius.md, gap: spacing.xs,
  },
  acaoText: { ...fonts.medium, fontSize: 15 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm,
  },
  sectionTitle: { ...fonts.large, fontSize: 18 },
  totalCount: { ...fonts.small, fontSize: 13 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { ...fonts.medium, fontSize: 16, marginTop: spacing.md },
  emptySubtext: { ...fonts.small, marginTop: 4 },
})
