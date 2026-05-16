import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert, Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { fonts, spacing, borderRadius } from '../styles/theme'
import { useTheme } from '../context/ThemeContext'
import { useData } from '../context/DataContext'
import { useSubscription } from '../context/SubscriptionContext'
import { PREMIUM_FEATURES } from '../utils/premiumFeatures'

const tipos = ['despesa', 'receita']

export default function AddTransactionScreen({ navigation, route }) {
  const { colors } = useTheme()
  const { addTransacao, updateTransacao, deleteTransacao, categorias, membros } = useData()
  const { isPremium } = useSubscription()
  const edit = route.params?.transacao
  const tipoPadrao = route.params?.tipo || edit?.tipo || 'despesa'

  const [descricao, setDescricao] = useState(edit?.descricao || '')
  const [valor, setValor] = useState(edit ? String(edit.valor) : '')
  const [tipo, setTipo] = useState(tipoPadrao)
  const [categoriaId, setCategoriaId] = useState(edit?.categoriaId || categorias[0]?.id || null)
  const [usuarioId, setUsuarioId] = useState(edit?.usuarioId || membros[0]?.id || null)
  const [data, setData] = useState(edit?.data || new Date().toISOString().split('T')[0])
  const [rateioAtivo, setRateioAtivo] = useState(!!edit?.rateio)
  const [rateioMembros, setRateioMembros] = useState(edit?.rateio || [])
  const [parcelas, setParcelas] = useState(edit?.parcelas || 0)
  const [foto, setFoto] = useState(edit?.foto || null)

  const handleSave = async () => {
    if (!descricao.trim() || !valor.trim()) {
      Alert.alert('Atenção', 'Preencha descrição e valor')
      return
    }
    const val = parseFloat(valor.replace(',', '.'))
    if (isNaN(val) || val <= 0) {
      Alert.alert('Atenção', 'Valor inválido')
      return
    }

    const payload = {
      descricao: descricao.trim(), valor: val, tipo, data,
      categoriaId: categoriaId || null,
      usuarioId: usuarioId || null,
      rateio: rateioAtivo ? rateioMembros : null,
      parcelas: parcelas > 1 ? parcelas : null,
      foto: foto || null,
    }
    try {
      if (edit) {
        await updateTransacao(edit.id, payload)
      } else {
        await addTransacao(payload)
      }
      navigation.goBack()
    } catch (e) {
      console.warn(e)
      Alert.alert('Erro', 'Não foi possível salvar')
    }
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permissão', 'Precisamos de acesso à sua galeria.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, base64: false })
    if (!result.canceled) {
      setFoto(result.assets[0].uri)
    }
  }

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{edit ? 'Editar' : 'Nova'} Transação</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.segmentRow}>
          {tipos.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.segment, { backgroundColor: colors.surface, borderColor: colors.border }, tipo === t && { backgroundColor: t === 'receita' ? colors.success : colors.danger, borderColor: 'transparent' }]}
              onPress={() => setTipo(t)}
            >
              <Ionicons name={t === 'receita' ? 'arrow-up-circle' : 'arrow-down-circle'} size={16} color={tipo === t ? '#FFF' : colors.textSecondary} />
              <Text style={[styles.segmentText, { color: colors.textSecondary }, tipo === t && { color: '#FFF' }]}>
                {t === 'receita' ? 'Receita' : 'Despesa'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Descrição</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
          placeholder="Ex: Salário, Aluguel..."
          placeholderTextColor={colors.textLight}
          value={descricao} onChangeText={setDescricao}
        />

        <Text style={[styles.label, { color: colors.text }]}>Valor (R$)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
          placeholder="0,00"
          placeholderTextColor={colors.textLight}
          value={valor} onChangeText={setValor}
          keyboardType="decimal-pad"
        />

        <Text style={[styles.label, { color: colors.text }]}>Data</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textLight}
          value={data} onChangeText={setData}
        />

        <Text style={[styles.label, { color: colors.text }]}>Categoria</Text>
        <View style={styles.optionsRow}>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }, categoriaId === cat.id && { backgroundColor: cat.cor + '20', borderColor: cat.cor }]}
              onPress={() => setCategoriaId(cat.id)}
            >
              <Ionicons name={cat.icone} size={14} color={categoriaId === cat.id ? cat.cor : colors.textSecondary} />
              <Text style={[styles.chipText, { color: colors.textSecondary }, categoriaId === cat.id && { color: cat.cor }]}>{cat.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Membro</Text>
        <View style={styles.optionsRow}>
          {membros.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }, usuarioId === m.id && { backgroundColor: m.cor + '20', borderColor: m.cor }]}
              onPress={() => setUsuarioId(m.id)}
            >
              <Ionicons name={m.avatar} size={14} color={usuarioId === m.id ? m.cor : colors.textSecondary} />
              <Text style={[styles.chipText, { color: colors.textSecondary }, usuarioId === m.id && { color: m.cor }]}>{m.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tipo === 'despesa' && (
          <>
            <View style={[styles.rateioHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.text }]}>Rateio</Text>
              <TouchableOpacity onPress={() => setRateioAtivo(!rateioAtivo)}>
                <Ionicons name={rateioAtivo ? 'toggle' : 'toggle-outline'} size={28} color={rateioAtivo ? colors.primary : colors.textLight} />
              </TouchableOpacity>
            </View>
            {rateioAtivo && (
              <>
                <Text style={[styles.rateioSub, { color: colors.textSecondary }]}>Dividir entre:</Text>
                <View style={styles.optionsRow}>
                  {membros.map((m) => {
                    const selected = rateioMembros.includes(m.id)
                    return (
                      <TouchableOpacity
                        key={m.id}
                        style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }, selected && { backgroundColor: m.cor + '20', borderColor: m.cor }]}
                        onPress={() => setRateioMembros((prev) => selected ? prev.filter((id) => id !== m.id) : [...prev, m.id])}
                      >
                        <Ionicons name={m.avatar} size={14} color={selected ? m.cor : colors.textSecondary} />
                        <Text style={[styles.chipText, { color: colors.textSecondary }, selected && { color: m.cor }]}>{m.nome}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </>
            )}
          </>
        )}

        {isPremium && (
          <>
            <Text style={[styles.label, { color: colors.text }]}>Parcelamento</Text>
            <View style={styles.parcelasRow}>
              {[0, 2, 3, 4, 6, 12].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.parcelaChip, { backgroundColor: colors.surface, borderColor: colors.border }, parcelas === p && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                  onPress={() => setParcelas(p)}
                >
                  <Text style={[styles.parcelaText, { color: colors.textSecondary }, parcelas === p && { color: colors.primary }]}>
                    {p === 0 ? 'À vista' : `${p}x`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Comprovante</Text>
            <TouchableOpacity style={[styles.fotoBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={pickImage}>
              <Ionicons name={foto ? 'image' : 'camera-outline'} size={22} color={colors.primary} />
              <Text style={[styles.fotoText, { color: colors.textLight }]}>
                {foto ? 'Trocar foto' : 'Anexar foto do comprovante'}
              </Text>
            </TouchableOpacity>
            {foto && (
              <View style={styles.fotoPreview}>
                <Image source={{ uri: foto }} style={styles.fotoImg} />
                <TouchableOpacity onPress={() => setFoto(null)}>
                  <Ionicons name="close-circle" size={24} color={colors.danger} />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <TouchableOpacity style={[styles.btn, { backgroundColor: tipo === 'receita' ? colors.success : colors.primary }]} onPress={handleSave}>
          <Ionicons name="checkmark-circle" size={20} color="#FFF" />
          <Text style={styles.btnText}>{edit ? 'Salvar Alterações' : 'Adicionar'}</Text>
        </TouchableOpacity>

        {edit && (
          <TouchableOpacity style={[styles.deleteBtn, { borderColor: colors.danger + '40' }]} onPress={async () => {
            await deleteTransacao(edit.id)
            navigation.goBack()
          }}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={[styles.deleteText, { color: colors.danger }]}>Excluir Transação</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: spacing.md, paddingHorizontal: spacing.md,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  form: { padding: spacing.lg },
  segmentRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  segment: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: borderRadius.md, borderWidth: 1, gap: 6,
  },
  segmentText: { fontSize: 14, fontWeight: '600' },
  label: { ...fonts.medium, fontSize: 14, marginBottom: spacing.sm, marginTop: spacing.md },
  input: {
    borderRadius: borderRadius.md, paddingHorizontal: spacing.md,
    height: 48, ...fonts.medium, fontSize: 15, borderWidth: 1,
  },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: borderRadius.sm, borderWidth: 1, gap: 4,
  },
  chipText: { fontSize: 12, fontWeight: '600' },
  rateioHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: spacing.sm },
  rateioSub: { ...fonts.small, marginBottom: spacing.sm, marginTop: spacing.sm },
  parcelasRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  parcelaChip: {
    paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: borderRadius.md, borderWidth: 1,
  },
  parcelaText: { fontSize: 14, fontWeight: '600' },
  fotoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.md, borderRadius: borderRadius.md, borderWidth: 1,
    borderStyle: 'dashed',
  },
  fotoText: { ...fonts.medium, fontSize: 14 },
  fotoPreview: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  fotoImg: { width: 60, height: 60, borderRadius: borderRadius.sm },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: borderRadius.md, marginTop: spacing.xl, gap: spacing.sm,
  },
  btnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, marginTop: spacing.md, marginBottom: 40,
    borderRadius: borderRadius.md, borderWidth: 1, gap: spacing.sm,
  },
  deleteText: { ...fonts.medium, fontSize: 15 },
})
