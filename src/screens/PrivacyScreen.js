import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, spacing, borderRadius } from '../styles/theme'

export default function PrivacyScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Política de Privacidade</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdate}>Última atualização: 15 de Maio de 2026</Text>

        <Text style={styles.section}>1. Informações Coletadas</Text>
        <Text style={styles.text}>
          O Orçamento Familiar armazena localmente no seu dispositivo:
          {'\n'}- Dados de cadastro (nome, email)
          {'\n'}- Transações financeiras (descrição, valor, data, categoria)
          {'\n'}- Metas de poupança
          {'\n'}- Categorias personalizadas
          {'\n\n'}Nenhum dado é enviado para servidores externos.
        </Text>

        <Text style={styles.section}>2. Uso das Informações</Text>
        <Text style={styles.text}>
          Os dados coletados são utilizados exclusivamente para:
          {'\n'}- Exibir seu saldo e extrato financeiro
          {'\n'}- Calcular gastos por categoria
          {'\n'}- Acompanhar progresso de metas
          {'\n'}- Gerar relatórios financeiros
        </Text>

        <Text style={styles.section}>3. Armazenamento e Segurança</Text>
        <Text style={styles.text}>
          Todos os dados são armazenados localmente no seu dispositivo usando
          Armazenamento Seguro (AsyncStorage). Recomendamos:
          {'\n'}- Manter seu dispositivo protegido com senha
          {'\n'}- Não compartilhar seu dispositivo com pessoas não autorizadas
          {'\n'}- Fazer backup regular dos dados
        </Text>

        <Text style={styles.section}>4. Exclusão de Dados</Text>
        <Text style={styles.text}>
          Você pode excluir todos os seus dados a qualquer momento:
          {'\n'}- Dentro do aplicativo, vá em Configurações > Excluir Conta
          {'\n'}- Isso removerá permanentemente todos os dados locais
          {'\n'}- Recomendamos fazer um backup antes de excluir
        </Text>

        <Text style={styles.section}>5. Compartilhamento com Terceiros</Text>
        <Text style={styles.text}>
          Não compartilhamos, vendemos ou transferimos seus dados pessoais
          para terceiros. Seus dados financeiros são exclusivamente seus.
        </Text>

        <Text style={styles.section}>6. Alterações na Política</Text>
        <Text style={styles.text}>
          Podemos atualizar esta política periodicamente. Alterações serão
          notificadas através do aplicativo.
        </Text>

        <Text style={styles.section}>7. Contato</Text>
        <Text style={styles.text}>
          Para questões sobre privacidade: privacidade@orcamentofamiliar.app
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
