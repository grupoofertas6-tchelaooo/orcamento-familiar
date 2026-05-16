import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { deleteUser } from 'firebase/auth'
import { auth } from '../services/firebase'
import { fonts, spacing, borderRadius } from '../styles/theme'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../context/SubscriptionContext'
import { agendarLembreteMensal, agendarLembreteSemanal } from '../services/notifications'

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useAuth()
  const { isPremium, devMode } = useSubscription()
  const { isDark, colors, toggleTheme } = useTheme()
  const [lembreteMensal, setLembreteMensal] = useState(false)
  const [lembreteSemanal, setLembreteSemanal] = useState(false)

  const handleExcluirConta = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza? Todos os seus dados serão permanentemente removidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              if (auth?.currentUser) {
                await deleteUser(auth.currentUser)
              }
              const raw = await AsyncStorage.getItem('@family_budget_users')
              const users = raw ? JSON.parse(raw) : []
              const updated = users.filter((u) => u.email !== user.email)
              await AsyncStorage.setItem('@family_budget_users', JSON.stringify(updated))
              await AsyncStorage.multiRemove([
                '@family_budget_session',
                '@family_budget_transacoes',
                '@family_budget_categorias',
                '@family_budget_metas',
                '@family_budget_membros',
              ])
            } catch {} finally {
              await logout()
            }
          },
        },
      ]
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Conta</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={[styles.profileCard, { backgroundColor: colors.surface }]} onPress={() => navigation.navigate('ProfileEdit')}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '15' }]}>
            {user?.foto ? (
              <Image source={{ uri: user.foto }} style={styles.avatarImg} />
            ) : (
              <Ionicons name="person" size={32} color={colors.primary} />
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>{user?.nome || 'Usuário'}</Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Conta</Text>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.surface }]} onPress={() => navigation.navigate('Terms')}>
          <Ionicons name="document-text-outline" size={22} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Termos de Uso</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.surface }]} onPress={() => navigation.navigate('Privacy')}>
          <Ionicons name="shield-checkmark-outline" size={22} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Política de Privacidade</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: isPremium ? '#FFF3CD' : colors.surface }, isPremium && { borderWidth: 1, borderColor: '#FFC107' }]}
          onPress={() => navigation.navigate('Pro')}
        >
          <Ionicons name="diamond" size={22} color={isPremium ? '#FFC107' : colors.textLight} />
          <Text style={[styles.menuText, { color: isPremium ? '#FFC107' : colors.text }]}>
            {isPremium ? 'Plano Pro Ativo' : 'Torne-se Pro'}
          </Text>
          {devMode && (
            <View style={styles.devBadge}>
              <Text style={styles.devBadgeText}>DEV</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Aparência</Text>

        <View style={[styles.switchItem, { backgroundColor: colors.surface }]}>
          <View style={styles.switchInfo}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>Modo escuro</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary + '60' }}
            thumbColor={isDark ? colors.primary : '#f4f3f4'}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Notificações</Text>

        <View style={[styles.switchItem, { backgroundColor: colors.surface }]}>
          <View style={styles.switchInfo}>
            <Ionicons name="calendar-outline" size={22} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>Lembrete mensal</Text>
          </View>
          <Switch
            value={lembreteMensal}
            onValueChange={async (v) => {
              setLembreteMensal(v)
              if (v) await agendarLembreteMensal()
            }}
            trackColor={{ false: colors.border, true: colors.primary + '60' }}
            thumbColor={lembreteMensal ? colors.primary : '#f4f3f4'}
          />
        </View>

        <View style={[styles.switchItem, { backgroundColor: colors.surface }]}>
          <View style={styles.switchInfo}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>Lembrete semanal</Text>
          </View>
          <Switch
            value={lembreteSemanal}
            onValueChange={async (v) => {
              setLembreteSemanal(v)
              if (v) await agendarLembreteSemanal()
            }}
            trackColor={{ false: colors.border, true: colors.primary + '60' }}
            thumbColor={lembreteSemanal ? colors.primary : '#f4f3f4'}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Ações</Text>

        <TouchableOpacity style={[styles.menuItem, styles.excluirBtn, { backgroundColor: colors.surface }]} onPress={handleExcluirConta}>
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
          <Text style={[styles.menuText, { color: colors.danger }]}>Excluir Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.logoutBtn, { borderColor: colors.danger + '40' }]} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Sair da Conta</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textLight }]}>Orçamento Familiar v1.0.0</Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  content: { padding: spacing.lg },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 56, height: 56, borderRadius: 28 },
  profileInfo: { marginLeft: spacing.md, flex: 1 },
  profileName: { ...fonts.large, fontSize: 18 },
  profileEmail: { ...fonts.small, marginTop: 2 },
  sectionTitle: { ...fonts.medium, fontSize: 14, marginBottom: spacing.sm, marginTop: spacing.md },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  menuText: { flex: 1, ...fonts.medium, fontSize: 15, marginLeft: spacing.md },
  switchItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: borderRadius.md,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  switchInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  devBadge: {
    backgroundColor: '#FFC107', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginLeft: spacing.sm,
  },
  devBadgeText: { fontSize: 10, fontWeight: '700', color: '#856404' },
  divider: { height: 1, marginVertical: spacing.md },
  excluirBtn: { marginTop: spacing.sm },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  logoutText: { ...fonts.medium, fontSize: 15 },
  version: { ...fonts.small, textAlign: 'center', marginTop: spacing.xl, fontSize: 12 },
})
