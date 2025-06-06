import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function PoliticaPrivacidade() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.h1}>Política de Privacidade</Text>

        <Text style={styles.paragraph}>
          A sua privacidade é importante para nós. Esta Política de Privacidade descreve como coletamos,
          usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nosso site
          <Text style={styles.bold}> Bibliocanto</Text>. Ao utilizar nossos serviços, você concorda com as práticas descritas
          nesta política.
        </Text>

        <Text style={styles.h2}>1. Informações Coletadas</Text>

        <Text style={styles.h3}>1.1 Informações que Você Fornece Voluntariamente</Text>
        <Text style={styles.paragraph}>
          Quando você se registra no site, cria uma conta ou interage com nossos serviços, podemos coletar as
          seguintes informações:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Nome completo</Text>
          <Text style={styles.listItem}>• Endereço de e-mail</Text>
          <Text style={styles.listItem}>• Informações de login (nome de usuário, senha)</Text>
        </View>

        <Text style={styles.h3}>1.2 Informações Coletadas Automaticamente</Text>
        <Text style={styles.paragraph}>
          Quando você utiliza nosso site, podemos coletar automaticamente certas informações, incluindo:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Endereço IP</Text>
          <Text style={styles.listItem}>• Tipo de navegador e dispositivo</Text>
          <Text style={styles.listItem}>• Páginas visitadas e tempo gasto em cada página</Text>
          <Text style={styles.listItem}>• Dados de navegação e interações com o site</Text>
        </View>

        <Text style={styles.h2}>2. Uso das Informações</Text>
        <Text style={styles.paragraph}>As informações que coletamos são utilizadas para:</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Gerenciar e personalizar sua conta e perfil</Text>
          <Text style={styles.listItem}>• Analisar o uso do site e melhorar nossos serviços</Text>
          <Text style={styles.listItem}>• Cumprir com obrigações legais</Text>
        </View>

        <Text style={styles.h2}>3. Compartilhamento de Informações</Text>
        <Text style={styles.paragraph}>
          Nós não vendemos ou compartilhamos suas informações pessoais com terceiros, exceto nas seguintes
          circunstâncias:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            • <Text style={styles.bold}>Requisitos Legais:</Text> Podemos divulgar suas informações se formos obrigados por lei ou em resposta a processos judiciais.
          </Text>
          <Text style={styles.listItem}>
            • <Text style={styles.bold}>Proteção de Direitos:</Text> Podemos compartilhar suas informações para proteger nossos direitos, segurança e propriedade.
          </Text>
        </View>

        <Text style={styles.h2}>4. Cookies e Tecnologias Semelhantes</Text>
        <Text style={styles.paragraph}>
          Nosso site pode utilizar cookies e tecnologias semelhantes para coletar informações de navegação.
          Você pode ajustar as configurações do seu navegador para desativar os cookies, mas isso pode limitar
          algumas funcionalidades do site.
        </Text>

        <Text style={styles.h2}>5. Segurança dos Dados</Text>
        <Text style={styles.paragraph}>
          Adotamos medidas de segurança técnicas e organizacionais para proteger suas informações contra
          acessos não autorizados, perda, uso indevido ou divulgação.
        </Text>

        <Text style={styles.h2}>6. Retenção de Dados</Text>
        <Text style={styles.paragraph}>
          Suas informações pessoais serão mantidas apenas enquanto forem necessárias para cumprir os propósitos
          descritos nesta Política de Privacidade, ou conforme exigido por lei.
        </Text>

        <Text style={styles.h2}>7. Seus Direitos</Text>
        <Text style={styles.paragraph}>Você tem o direito de:</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Acessar, corrigir ou atualizar suas informações pessoais</Text>
          <Text style={styles.listItem}>• Solicitar a exclusão de sua conta e dados pessoais</Text>
          <Text style={styles.listItem}>• Retirar o consentimento para o uso de suas informações</Text>
          <Text style={styles.listItem}>• Solicitar a restrição ou objeção ao processamento de seus dados pessoais</Text>
        </View>

        <Text style={styles.h2}>8. Alterações na Política de Privacidade</Text>
        <Text style={styles.paragraph}>
          Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos que você reveja esta
          página regularmente para estar informado sobre nossas práticas de privacidade. Quaisquer alterações
          entrarão em vigor imediatamente após a publicação da política revisada.
        </Text>

        {/* Comentário removido do layout visual, pode ser incluído se necessário futuramente */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  section: {
    paddingBottom: 50,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: 'black',
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    color: 'black',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'justify',
    color: '#333333',
  },
  list: {
    marginBottom: 12,
    paddingLeft: 10,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 6,
    color: '#333333',
  },
  bold: {
    fontWeight: 'bold',
    color: '#000', // pode deixar mais forte se desejar
  },
});
