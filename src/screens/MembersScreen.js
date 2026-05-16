import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { fonts, spacing, borderRadius } from '../styles/theme'
import { useTheme } from '../context/ThemeContext'
import { useData } from '../context/DataContext'
import { useSubscription } from '../context/SubscriptionContext'
import MemberCard from '../components/MemberCard'

export default function MembersScreen({ navigation }) {
  const { colors } = useTheme()
  const { isPremium } = useSubscription()
  const { membros, deleteMembro } = useData()

  const confirmDelete = (m) => {
    Alert.alert('Excluir Membro', `Remover "${m.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteMembro(m.id) },
    ])
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerBar, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Família</Text>
        <TouchableOpacity style={[styles.addHeaderBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]} onPress={() => navigation.navigate('AddMember')}>
          <Ionicons name="add" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>Veja quanto cada membro da família gastou no mês.</Text>

        {membros.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={colors.textLight} />
            <Text style={[styles.emptyText, { color: colors.textLight }]}>Nenhum membro cadastrado</Text>
            <Text style={[styles.emptySubtext, { color: colors.textLight }]}>Adicione membros da família</Text>
          </View>
        ) : (
          membros.map((m) => (
            <TouchableOpacity
              key={m.id}
              onPress={() => navigation.navigate('AddMember', { membro: m })}
              onLongPress={() => confirmDelete(m)}
            >
              <MemberCard membro={m} />
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity style={[styles.addBtn, { borderColor: colors.primary + '40' }]} onPress={() => navigation.navigate('AddMember')}>
          <Ionicons name="person-add" size={20} color={colors.primary} />
          <Text style={[styles.addText, { color: colors.primary }]}>Adicionar Membro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addBtn, { borderColor: isPremium ? colors.success + '40' : colors.textLight + '40', marginTop: 0 }]}
          onPress={() => isPremium ? navigation.navigate('FamilyShare') : navigation.navigate('Pro')}
        >
          <Ionicons name={isPremium ? 'share-social' : 'lock-closed'} size={20} color={isPremium ? colors.success : colors.textLight} />
          <Text style={[styles.addText, { color: isPremium ? colors.success : colors.textLight }]}>
            {isPremium ? 'Compartilhar com Família' : 'Compartilhar (Pro)'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: spacing.md, paddingHorizontal: spacing.md,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  addHeaderBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  subtitle: { ...fonts.small, marginHorizontal: spacing.md, marginTop: spacing.md, marginBottom: spacing.sm },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { ...fonts.medium, fontSize: 16, marginTop: spacing.md },
  emptySubtext: { ...fonts.small, marginTop: 4 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: spacing.md, marginVertical: spacing.md,
    paddingVertical: spacing.md, borderRadius: borderRadius.md,
    borderWidth: 1, borderStyle: 'dashed',
  },
  addText: { ...fonts.medium, marginLeft: spacing.xs },
})
