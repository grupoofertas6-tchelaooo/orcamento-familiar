import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'

export default function SearchBar({ value, onChangeText, tipoFiltro, onToggleTipo }) {
  return (
    <View style={styles.container}>
      <View style={styles.inputBox}>
        <Ionicons name="search" size={18} color={colors.textLight} />
        <TextInput
          style={styles.input}
          placeholder="Buscar transação..."
          placeholderTextColor={colors.textLight}
          value={value}
          onChangeText={onChangeText}
        />
        {value ? (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Ionicons name="close-circle" size={18} color={colors.textLight} />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.filtros}>
        {['todas', 'receita', 'despesa'].map((t) => {
          const ativo = tipoFiltro === t
          const cor = t === 'receita' ? colors.success : t === 'despesa' ? colors.danger : colors.primary
          return (
            <TouchableOpacity
              key={t}
              style={[styles.chip, ativo && { backgroundColor: cor + '15', borderColor: cor }]}
              onPress={() => onToggleTipo(t)}
            >
              <Ionicons
                name={t === 'todas' ? 'funnel' : t === 'receita' ? 'arrow-up-circle' : 'arrow-down-circle'}
                size={12}
                color={ativo ? cor : colors.textSecondary}
              />
              <Text style={[styles.chipText, ativo && { color: cor }]}>
                {t === 'todas' ? 'Todas' : t === 'receita' ? 'Receita' : 'Despesa'}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.background },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md, height: 42,
    borderWidth: 1, borderColor: colors.border, gap: spacing.sm,
  },
  input: { flex: 1, ...fonts.medium, fontSize: 14, color: colors.text },
  filtros: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 5, paddingHorizontal: 10,
    borderRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface, gap: 4,
  },
  chipText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
})
