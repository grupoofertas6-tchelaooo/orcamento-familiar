import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'
import { useSubscription } from '../context/SubscriptionContext'

export default function FamilyShareScreen({ navigation }) {
  const { isPremium } = useSubscription()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compartilhar com Família</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Ionicons name="people-circle" size={80} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>Convide sua família</Text>
        <Text style={[styles.sub, { color: colors.textLight }]}>
          Compartilhe o orçamento com outras pessoas. Todos veem e lançam transações em tempo real.
        </Text>

        {isPremium ? (
          <>
            <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={() => Alert.alert('Em breve', 'O convite por email será liberado em breve!')}>
              <Ionicons name="mail" size={20} color="#FFF" />
              <Text style={styles.btnText}>Convidar por E-mail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { backgroundColor: colors.success }]} onPress={() => Alert.alert('Código', 'Compartilhe este código: FAM-1234')}>
              <Ionicons name="link" size={20} color="#FFF" />
              <Text style={styles.btnText}>Código de Acesso</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.textLight }]} onPress={() => navigation.navigate('Pro')}>
            <Ionicons name="lock-closed" size={20} color="#FFF" />
            <Text style={styles.btnText}>Disponível no Plano Pro</Text>
          </TouchableOpacity>
        )}
      </View>
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
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  title: { ...fonts.large, fontSize: 24, textAlign: 'center' },
  sub: { ...fonts.medium, textAlign: 'center', lineHeight: 22 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md, gap: spacing.sm, width: '100%',
    marginTop: spacing.sm,
  },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
})
