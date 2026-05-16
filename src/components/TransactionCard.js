import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { fonts, spacing, borderRadius } from '../styles/theme'
import { useTheme } from '../context/ThemeContext'
import { useData } from '../context/DataContext'

export default function TransactionCard({ transacao }) {
  const { colors } = useTheme()
  const { categorias, membros } = useData()
  const [showFoto, setShowFoto] = useState(false)
  const cat = categorias.find((c) => c.id === transacao.categoriaId)
  const membro = membros.find((m) => m.id === transacao.usuarioId)
  const isReceita = transacao.tipo === 'receita'
  const formatMoney = (v) =>
    `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const formatDate = (d) => {
    const dt = new Date(d)
    return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}`
  }

  const hasParcelas = transacao.parcelas && transacao.parcelas > 1
  const valorParcela = hasParcelas ? transacao.valor / transacao.parcelas : null

  return (
    <>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={[styles.iconBox, { backgroundColor: cat?.cor + '20' || colors.border }]}>
          <Ionicons name={cat?.icone || 'ellipsis-horizontal'} size={22} color={cat?.cor || '#999'} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.descricao, { color: colors.text }]}>{transacao.descricao}</Text>
          <Text style={[styles.meta, { color: colors.textLight }]}>
            {cat?.nome} • {membro?.nome}
          </Text>
          <View style={styles.tags}>
            {hasParcelas && (
              <View style={[styles.tag, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.tagText, { color: colors.primary }]}>{transacao.parcelas}x de {formatMoney(valorParcela)}</Text>
              </View>
            )}
            {transacao.rateio && transacao.rateio.length > 0 && (
              <View style={[styles.tag, { backgroundColor: colors.success + '15' }]}>
                <Ionicons name="people-outline" size={11} color={colors.success} />
                <Text style={[styles.tagText, { color: colors.success }]}>Rateio</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.right}>
          {transacao.foto && (
            <TouchableOpacity onPress={() => setShowFoto(true)}>
              <Image source={{ uri: transacao.foto }} style={styles.fotoThumb} />
            </TouchableOpacity>
          )}
          <Text style={[styles.valor, { color: isReceita ? colors.success : colors.danger }]}>
            {isReceita ? '+' : '-'} {formatMoney(transacao.valor)}
          </Text>
          <Text style={[styles.data, { color: colors.textLight }]}>{formatDate(transacao.data)}</Text>
        </View>
      </View>

      <Modal visible={showFoto} transparent animationType="fade" onRequestClose={() => setShowFoto(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowFoto(false)}>
          <Image source={{ uri: transacao.foto }} style={styles.fotoFull} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconBox: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1, marginLeft: spacing.md },
  descricao: { ...fonts.medium, fontSize: 15 },
  meta: { ...fonts.small, marginTop: 2 },
  tags: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, flexWrap: 'wrap' },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2,
  },
  tagText: { fontSize: 10, fontWeight: '600' },
  right: { alignItems: 'flex-end', gap: 4 },
  fotoThumb: { width: 36, height: 36, borderRadius: 6, marginBottom: 2 },
  valor: { ...fonts.medium, fontSize: 14 },
  data: { ...fonts.small, fontSize: 11 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center', alignItems: 'center',
  },
  fotoFull: { width: '90%', height: '70%' },
})
