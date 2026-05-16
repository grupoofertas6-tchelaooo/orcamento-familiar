import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'
import { useData } from '../context/DataContext'

const coresDisponiveis = ['#4A90D9', '#E91E63', '#6C63FF', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4', '#E53935']

export default function AddMemberScreen({ navigation, route }) {
  const { addMembro, updateMembro, deleteMembro } = useData()
  const edit = route.params?.membro

  const [nome, setNome] = useState(edit?.nome || '')
  const [cor, setCor] = useState(edit?.cor || '#4A90D9')

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Preencha o nome')
      return
    }
    try {
      if (edit) {
        await updateMembro(edit.id, { nome: nome.trim(), cor })
      } else {
        await addMembro({ nome: nome.trim(), cor, avatar: 'person' })
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
        <Text style={styles.headerTitle}>{edit ? 'Editar' : 'Novo'} Membro</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} placeholder="Ex: Arthur" placeholderTextColor={colors.textLight} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Cor do Perfil</Text>
        <View style={styles.optionsRow}>
          {coresDisponiveis.map((c) => (
            <TouchableOpacity key={c} style={[styles.colorOption, { backgroundColor: c }, cor === c && styles.colorSelected]} onPress={() => setCor(c)} />
          ))}
        </View>

        <TouchableOpacity style={[styles.btn, { backgroundColor: cor }]} onPress={handleSave}>
          <Ionicons name="checkmark-circle" size={20} color="#FFF" />
          <Text style={styles.btnText}>{edit ? 'Salvar' : 'Adicionar'}</Text>
        </TouchableOpacity>

        {edit && (
          <TouchableOpacity style={styles.deleteBtn} onPress={async () => {
            await deleteMembro(edit.id)
            navigation.goBack()
          }}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={styles.deleteText}>Excluir Membro</Text>
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
  colorOption: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'transparent' },
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
