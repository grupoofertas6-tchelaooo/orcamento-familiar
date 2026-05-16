import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { fonts, spacing, borderRadius } from '../styles/theme'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

export default function ProfileEditScreen({ navigation }) {
  const { colors } = useTheme()
  const { user, updateProfile } = useAuth()
  const [nome, setNome] = useState(user?.nome || '')
  const [foto, setFoto] = useState(user?.foto || null)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permissão', 'Precisamos de acesso à sua galeria.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.5,
      base64: false,
      allowsEditing: true,
      aspect: [1, 1],
    })
    if (!result.canceled) {
      setFoto(result.assets[0].uri)
    }
  }

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Digite seu nome')
      return
    }
    try {
      await updateProfile(nome.trim(), foto)
      Alert.alert('Salvo!', 'Perfil atualizado com sucesso.')
      navigation.goBack()
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o perfil.')
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.fotoWrapper} onPress={pickImage}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.foto} />
          ) : (
            <View style={[styles.fotoPlaceholder, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="person" size={40} color={colors.primary} />
            </View>
          )}
          <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
            <Ionicons name="camera" size={16} color="#FFF" />
          </View>
        </TouchableOpacity>

        <Text style={[styles.label, { color: colors.text }]}>Nome</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome"
          placeholderTextColor={colors.textLight}
        />

        <Text style={[styles.label, { color: colors.text }]}>E-mail</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.textLight, borderColor: colors.border }]}
          value={user?.email || ''}
          editable={false}
        />

        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={handleSave}>
          <Ionicons name="checkmark" size={20} color="#FFF" />
          <Text style={styles.btnText}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: spacing.md, paddingHorizontal: spacing.md,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  content: { alignItems: 'center', padding: spacing.xl },
  fotoWrapper: { position: 'relative', marginBottom: spacing.xl },
  foto: { width: 100, height: 100, borderRadius: 50 },
  fotoPlaceholder: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#FFF',
  },
  label: { ...fonts.medium, fontSize: 14, alignSelf: 'flex-start', marginBottom: spacing.sm, marginTop: spacing.md, width: '100%' },
  input: {
    width: '100%', borderRadius: borderRadius.md, paddingHorizontal: spacing.md,
    height: 48, ...fonts.medium, fontSize: 15, borderWidth: 1,
  },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    width: '100%', paddingVertical: 16, borderRadius: borderRadius.md,
    marginTop: spacing.xl, gap: spacing.sm,
  },
  btnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
})
