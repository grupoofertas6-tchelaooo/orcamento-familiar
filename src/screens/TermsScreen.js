import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'

export default function TermsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Termos de Uso</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdate}>Última atualização: 15 de Maio de 2026</Text>

        <Text style={styles.section}>1. Aceitação dos Termos</Text>
        <Text style={styles.text}>
          Ao utilizar o aplicativo Orçamento Familiar, você concorda com estes Termos de Uso.
          Se não concordar, não utilize o aplicativo.
        </Text>

        <Text style={styles.section}>2. Descrição do Serviço</Text>
        <Text style={styles.text}>
          O Orçamento Familiar é um aplicativo de gerenciamento financeiro pessoal e familiar.
          Todo o processamento de dados é feito localmente no dispositivo do usuário.
          Não armazenamos seus dados financeiros em servidores externos.
        </Text>

        <Text style={styles.section}>3. Conta do Usuário</Text>
        <Text style={styles.text}>
          Você é responsável por manter a confidencialidade de sua senha.
          Os dados de conta são armazenados localmente no dispositivo.
          Recomendamos não compartilhar seu dispositivo com pessoas não autorizadas.
        </Text>

        <Text style={styles.section}>4. Uso Permitido</Text>
        <Text style={styles.text}>
          Você concorda em usar o aplicativo apenas para fins legítimos de controle financeiro
          pessoal. Não é permitido usar o aplicativo para atividades ilegais ou fraudulentas.
        </Text>

        <Text style={styles.section}>5. Limitação de Responsabilidade</Text>
        <Text style={styles.text}>
          O aplicativo é fornecido "como está", sem garantias de qualquer tipo.
          Não nos responsabilizamos por perdas financeiras decorrentes do uso do aplicativo.
          Recomendamos manter backups regulares dos seus dados.
        </Text>

        <Text style={styles.section}>6. Alterações nos Termos</Text>
        <Text style={styles.text}>
          Podemos atualizar estes termos periodicamente. Notificaremos sobre alterações
          significativas através do aplicativo.
        </Text>

        <Text style={styles.section}>7. Contato</Text>
        <Text style={styles.text}>
          Para dúvidas sobre estes termos, entre em contato pelo email:
          contato@orcamentofamiliar.app
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  content: { padding: spacing.lg },
  lastUpdate: { ...fonts.small, color: colors.textLight, marginBottom: spacing.lg },
  section: { ...fonts.medium, fontSize: 16, color: colors.primary, marginTop: spacing.lg, marginBottom: spacing.sm },
  text: { ...fonts.regular, lineHeight: 22, color: colors.textSecondary },
})
