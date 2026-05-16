import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'
import { useData } from '../context/DataContext'

const iconesDisponiveis = [
  'home', 'fast-food', 'car', 'school', 'medical', 'gamepad',
  'cart', 'fitness', 'water', 'flash', 'tv', 'shirt',
  'paw', 'leaf', 'construct', 'ellipsis-horizontal',
]

const coresDisponiveis = ['#4A90D9', '#FF9800', '#9C27B0', '#4CAF50', '#E53935', '#00BCD4', '#E91E63', '#9E9E9E']

export default function AddCategoryScreen({ navigation, route }) {
  const { addCategoria, updateCategoria, deleteCategoria } = useData()
  const edit = route.params?.categoria

  const [nome, setNome] = useState(edit?.nome || '')
  const [limiteMensal, setLimiteMensal] = useState(edit ? String(edit.limiteMensal) : '')
  const [icone, setIcone] = useState(edit?.icone || 'ellipsis-horizontal')
  const [cor, setCor] = useState(edit?.cor || '#9E9E9E')

  const handleSave = async () => {
    if (!nome.trim() || !limiteMensal.trim()) {
      Alert.alert('Atenção', 'Preencha nome e limite mensal')
      return
    }
    const limite = parseFloat(limiteMensal.replace(',', '.'))
    if (isNaN(limite) || limite <= 0) {
      Alert.alert('Atenção', 'Limite inválido')
      return
    }
    try {
      if (edit) {
        await updateCategoria(edit.id, { nome: nome.trim(), limiteMensal: limite, icone, cor })
      } else {
        await addCategoria({ nome: nome.trim(), limiteMensal: limite, icone, cor })
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
        <Text style={styles.headerTitle}>{edit ? 'Editar' : 'Nova'} Categoria</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} placeholder="Ex: Moradia" placeholderTextColor={colors.textLight} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Limite Mensal (R$)</Text>
        <TextInput style={styles.input} placeholder="1000" placeholderTextColor={colors.textLight} value={limiteMensal} onChangeText={setLimiteMensal} keyboardType="decimal-pad" />

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
          <Text style={styles.btnText}>{edit ? 'Salvar' : 'Criar Categoria'}</Text>
        </TouchableOpacity>

        {edit && (
          <TouchableOpacity style={styles.deleteBtn} onPress={async () => {
            await deleteCategoria(edit.id)
            navigation.goBack()
          }}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={styles.deleteText}>Excluir Categoria</Text>
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
