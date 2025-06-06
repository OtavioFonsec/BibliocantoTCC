import React, { useEffect, useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../routes/StackNavigator";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import api from "../services/api";
import NavBar from "../components/NavBar";
import * as SecureStore from "expo-secure-store";
import TabBar from "../components/TabBar";

interface Livro {
  id: number;
  titulo: string;
  caminhoImagem: string;
}

interface BibliotecaLivro {
  id: number;
  idUser: string;
  lido: number;
  relido: number;
  livros: Livro;
}

export default function ReadScreen() {
  const [livros, setLivros] = useState<BibliotecaLivro[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idUser = await SecureStore.getItemAsync("IdUser");

        if (!idUser) {
          throw new Error("O ID do usuário não pode estar vazio.");
        }

        const response = await api.get("api/MeusLivros/RelidosByUser", { params: { idUser } });
        setLivros(response.data);
        
      } catch (err:any) {
        console.log(err.response.status);
        if (err.response.status === 404) {
          setError(err.response.data);
        } else if (err.response.status === 500) {
          setError("Erro interno do servidor.");
        } else {
          setError("Erro ao carregar os dados.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleImageClick = (livro: Livro) => {
    navigation.navigate("Book", { idLivro: livro.id });
  };

  return (
    <View style={styles.container}>

      <View style={{ width: "100%"}}>
        <TabBar currentScreen="Relidos"/>
      </View>

      <View style={{ flex: 1, marginBottom: 75 }}>
        {error && <Text style={styles.error}>{error}</Text>}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Carregando os livros...</Text>
          </View>
        ) : (
          <FlatList
            data={livros}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleImageClick(item.livros)}>
                <Image source={{ uri: item.livros.caminhoImagem }} style={styles.livroCard} />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.livrosContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderColor: "black",
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
