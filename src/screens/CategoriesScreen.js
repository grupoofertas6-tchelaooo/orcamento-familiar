import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'
import CategoryCard from '../components/CategoryCard'
import { useData } from '../context/DataContext'

export default function CategoriesScreen({ navigation }) {
  const { categorias, deleteCategoria } = useData()

  const confirmDelete = (cat) => {
    Alert.alert('Excluir Categoria', `Remover "${cat.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteCategoria(cat.id) },
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Categorias</Text>
        <TouchableOpacity style={styles.addHeaderBtn} onPress={() => navigation.navigate('AddCategory')}>
          <Ionicons name="add" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Acompanhe seus gastos por categoria e veja quanto ainda pode gastar.</Text>

        {categorias.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="grid-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>Nenhuma categoria</Text>
            <Text style={styles.emptySubtext}>Adicione categorias para controlar</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {categorias.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.gridItem}
                onPress={() => navigation.navigate('AddCategory', { categoria: cat })}
                onLongPress={() => confirmDelete(cat)}
              >
                <CategoryCard categoria={cat} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddCategory')}>
          <Ionicons name="add" size={20} color={colors.primary} />
          <Text style={styles.addText}>Adicionar Categoria</Text>
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
  subtitle: { ...fonts.small, marginHorizontal: spacing.md, marginTop: spacing.md, marginBottom: spacing.sm },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { ...fonts.medium, fontSize: 16, color: colors.textLight, marginTop: spacing.md },
  emptySubtext: { ...fonts.small, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.md, gap: spacing.sm },
  gridItem: { width: '47%' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: spacing.md, marginVertical: spacing.lg,
    paddingVertical: spacing.md, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.primary + '40', borderStyle: 'dashed',
  },
  addText: { ...fonts.medium, color: colors.primary, marginLeft: spacing.xs },
})
