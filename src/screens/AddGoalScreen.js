import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'
import { useData } from '../context/DataContext'

const iconesDisponiveis = [
  'airplane', 'shield-checkmark', 'phone-portrait', 'car', 'home',
  'school', 'medical', 'fast-food', 'gamepad', 'gift', 'fitness',
  'card', 'wallet', 'barbell', 'book', 'tv', 'headset', 'camera',
]

const coresDisponiveis = ['#6C63FF', '#4CAF50', '#FF9800', '#E53935', '#2196F3', '#9C27B0', '#00BCD4', '#E91E63']

export default function AddGoalScreen({ navigation, route }) {
  const { addMeta, updateMeta, deleteMeta } = useData()
  const edit = route.params?.meta

  const [titulo, setTitulo] = useState(edit?.titulo || '')
  const [valorObjetivo, setValorObjetivo] = useState(edit ? String(edit.valorObjetivo) : '')
  const [valorAtual, setValorAtual] = useState(edit ? String(edit.valorAtual) : '0')
  const [dataLimite, setDataLimite] = useState(edit?.dataLimite || '')
  const [icone, setIcone] = useState(edit?.icone || 'flag')
  const [cor, setCor] = useState(edit?.cor || '#6C63FF')

  const handleSave = async () => {
    if (!titulo.trim() || !valorObjetivo.trim()) {
      Alert.alert('Atenção', 'Preencha título e valor objetivo')
      return
    }
    const obj = parseFloat(valorObjetivo.replace(',', '.'))
    const atual = parseFloat(valorAtual.replace(',', '.')) || 0
    if (isNaN(obj) || obj <= 0) {
      Alert.alert('Atenção', 'Valor objetivo inválido')
      return
    }
    try {
      if (edit) {
        await updateMeta(edit.id, { titulo: titulo.trim(), valorObjetivo: obj, valorAtual: atual, dataLimite, icone, cor })
      } else {
        await addMeta({ titulo: titulo.trim(), valorObjetivo: obj, valorAtual: atual, dataLimite, icone, cor })
      }
      navigation.goBack()
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar')
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{edit ? 'Editar' : 'Nova'} Meta</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Título</Text>
        <TextInput style={styles.input} placeholder="Ex: Viagem para Gramado" placeholderTextColor={colors.textLight} value={titulo} onChangeText={setTitulo} />

        <Text style={styles.label}>Valor Objetivo (R$)</Text>
        <TextInput style={styles.input} placeholder="5000" placeholderTextColor={colors.textLight} value={valorObjetivo} onChangeText={setValorObjetivo} keyboardType="decimal-pad" />

        <Text style={styles.label}>Valor Acumulado (R$)</Text>
        <TextInput style={styles.input} placeholder="0" placeholderTextColor={colors.textLight} value={valorAtual} onChangeText={setValorAtual} keyboardType="decimal-pad" />

        <Text style={styles.label}>Data Limite</Text>
        <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textLight} value={dataLimite} onChangeText={setDataLimite} />

        <Text style={styles.label}>Ícone</Text>
        <View style={styles.optionsRow}>
          {iconesDisponiveis.map((ic) => (
            <TouchableOpacity key={ic} style={[styles.iconOption, icone === ic && { backgroundColor: cor + '20', borderColor: cor }]} onPress={() => setIcone(ic)}>
              <Ionicons name={ic} size={20} color={icone === ic ? cor : colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Cor</Text>
        <View style={styles.optionsRow}>
          {coresDisponiveis.map((c) => (
            <TouchableOpacity key={c} style={[styles.colorOption, { backgroundColor: c }, cor === c && styles.colorSelected]} onPress={() => setCor(c)} />
          ))}
        </View>

        <TouchableOpacity style={[styles.btn, { backgroundColor: cor }]} onPress={handleSave}>
          <Ionicons name="checkmark-circle" size={20} color="#FFF" />
          <Text style={styles.btnText}>{edit ? 'Salvar' : 'Criar Meta'}</Text>
        </TouchableOpacity>

        {edit && (
          <TouchableOpacity style={styles.deleteBtn} onPress={async () => {
            await deleteMeta(edit.id)
            navigation.goBack()
          }}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={styles.deleteText}>Excluir Meta</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: spacing.md, paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  form: { padding: spacing.lg },
  label: { ...fonts.medium, fontSize: 14, marginBottom: spacing.sm, marginTop: spacing.md },
  input: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md, paddingHorizontal: spacing.md,
    height: 48, ...fonts.medium, fontSize: 15, color: colors.text,
    borderWidth: 1, borderColor: colors.border,
  },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  iconOption: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  colorOption: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
  colorSelected: { borderColor: '#FFF', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: borderRadius.md, marginTop: spacing.xl, gap: spacing.sm,
  },
  btnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, marginTop: spacing.md, marginBottom: 40,
    borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.danger + '40',
    gap: spacing.sm,
  },
  deleteText: { ...fonts.medium, fontSize: 15, color: colors.danger },
})
