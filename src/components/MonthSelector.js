import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export default function MonthSelector({ mesSelecionado, onSelect }) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {meses.map((nome, i) => {
          const ativo = mesSelecionado === i
          return (
            <TouchableOpacity
              key={i}
              style={[styles.item, ativo && styles.itemAtivo]}
              onPress={() => onSelect(i)}
            >
              <Text style={[styles.texto, ativo && styles.textoAtivo]}>
                {nome.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface, paddingVertical: spacing.sm },
  scroll: { paddingHorizontal: spacing.md, gap: spacing.sm },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background,
  },
  itemAtivo: { backgroundColor: colors.primary },
  texto: { ...fonts.medium, fontSize: 13, color: colors.textSecondary },
  textoAtivo: { color: '#FFF', fontWeight: '700' },
})
