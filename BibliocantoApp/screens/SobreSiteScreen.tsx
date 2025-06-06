import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function SobreSite() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Image
          source={require('../assets/BibliocantoTCC-mainlogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Sobre o Bibliocanto</Text>

        <View style={styles.content}>
          <Text style={styles.paragraph}>
            A plataforma <Text style={styles.bold}>Bibliocanto</Text> foi criada para oferecer aos leitores uma solução moderna e eficiente no gerenciamento de suas coleções literárias. Em um cenário cada vez mais digitalizado, o Bibliocanto permite que os usuários organizem suas bibliotecas de forma prática e intuitiva, cadastrando e acessando livros de maneira rápida e organizada.
          </Text>

          <Text style={styles.paragraph}>
            Além de manter suas coleções em ordem, os usuários podem interagir com uma comunidade de leitores, compartilhando resenhas, opiniões e recomendações. Essa interação contribui para o fomento da leitura crítica e a troca de conhecimentos, criando um espaço rico para o debate literário.
          </Text>

          <Text style={styles.paragraph}>
            O Bibliocanto visa não apenas a organização pessoal dos acervos, mas também a construção de um ambiente colaborativo, onde o acesso à informação é facilitado. A plataforma promove a educação de qualidade e incentiva a disseminação de conhecimento, alinhando-se aos objetivos da Agenda 2030 para o Desenvolvimento Sustentável, em especial no que se refere ao estímulo à leitura e à educação inclusiva.
          </Text>
        </View>
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
    alignItems: 'center',
    paddingBottom: 50,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black', // azul escuro para o título
  },
  content: {
    width: '100%',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'justify',
    color: '#333333', // cinza escuro para boa leitura
  },
  bold: {
    fontWeight: 'bold',
    color: '#000000', // preto para destacar
  },
});
