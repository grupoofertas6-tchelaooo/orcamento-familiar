import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'
import GoalCard from '../components/GoalCard'
import { useData } from '../context/DataContext'

export default function GoalsScreen({ navigation }) {
  const { metas, deleteMeta } = useData()

  const confirmDelete = (meta) => {
    Alert.alert('Excluir Meta', `Remover "${meta.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteMeta(meta.id) },
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Metas</Text>
        <TouchableOpacity style={styles.addHeaderBtn} onPress={() => navigation.navigate('AddGoal')}>
          <Ionicons name="add" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Suas metas de poupança. Economize para realizar seus sonhos!</Text>

        {metas.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="flag-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>Nenhuma meta ainda</Text>
            <Text style={styles.emptySubtext}>Crie sua primeira meta</Text>
          </View>
        ) : (
          metas.map((m) => (
            <TouchableOpacity
              key={m.id}
              onPress={() => navigation.navigate('AddGoal', { meta: m })}
              onLongPress={() => confirmDelete(m)}
            >
              <GoalCard meta={m} />
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddGoal')}>
          <Ionicons name="flag" size={20} color={colors.primary} />
          <Text style={styles.addText}>Nova Meta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: spacing.md, paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  addHeaderBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  subtitle: { ...fonts.small, marginHorizontal: spacing.md, marginTop: spacing.md, marginBottom: spacing.md },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { ...fonts.medium, fontSize: 16, color: colors.textLight, marginTop: spacing.md },
  emptySubtext: { ...fonts.small, marginTop: 4 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: spacing.md, marginVertical: spacing.lg,
    paddingVertical: spacing.md, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.primary + '40', borderStyle: 'dashed',
  },
  addText: { ...fonts.medium, color: colors.primary, marginLeft: spacing.xs },
})
