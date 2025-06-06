import React, { useEffect, useState } from "react";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../routes/StackNavigator';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import api from "../services/api";
import NavBar from "../components/NavBar";

interface Livro {
  id: number;
  titulo: string;
  caminhoImagem: string;
}

export default function HomeScreen() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("api/Livros");
        setLivros(response.data);
      } catch (err) {
        setError("Erro ao carregar os dados.");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleImageClick = (livro: Livro) => {
    navigation.navigate('Book', { idLivro: livro.id });
  };

  return (
    <View style={styles.container}>
      <View style={{ flexGrow: 1, marginBottom: 75 }}>
        {error && <Text style={styles.error}>{error}</Text>}

        {livros.length > 0 ? (
          <FlatList
            data={livros}
            keyExtractor={(livro) => livro.id.toString()}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleImageClick(item)}>
                <Image source={{ uri: item.caminhoImagem }} style={styles.livroCard} />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.livrosContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Carregando os livros...</Text>
          </View>
        )}

      </View>
      <NavBar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F2F5",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  livrosContainer: {
    justifyContent: "center",
  },
  livroCard: {
    width: 120,
    height: 180,
    margin: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});