import React, { useEffect, useState } from "react";
import { useRoute } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import api from "../services/api";
import NavBar from "../components/NavBar";
import TabBarLivro from "../components/TabBarLivro";
import { MaterialIcons } from '@expo/vector-icons';
import MenuDenuncia from '../components/MenuDropDown';

interface Resenha {
  id: number;
  idLivro: number;
  idUser: string;
  textoResenha: string;
  usuario: Usuario;
}

interface Usuario {
  email: string;
}

export default function HomeScreen() {
  const route = useRoute();
  const { idLivro } = route.params as { idLivro: number };
  const [resenhas, setResenhas] = useState<Resenha[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await api.get("api/Resenha/ResenhaByLivro", { params: { idLivro } });
        setResenhas(response.data);
        setError(null)
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar os dados.");
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  return (
    <View style={styles.container}>
      <View style={{ width: "100%" }}>
        <TabBarLivro currentScreen="Resenha" idLivro={idLivro} />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {resenhas.length > 0 ? (
        <FlatList
          data={resenhas}
          keyExtractor={(resenha) => resenha.id.toString()}
          numColumns={1}
          renderItem={({ item }) => (
            <View style={styles.resenhaContainer}>
              <MenuDenuncia 
                tipo="resenha" 
                idResenha={item.id}
                idComentario={0}
              />
              <View style={styles.headerResenha}>
                <MaterialIcons name="person" size={20} color="#333" style={styles.userIcon} />
                <Text style={styles.userIdText}>{item.usuario.email}</Text>
              </View>
              <View style={styles.separator} />
              <Text style={styles.resenhaTexto}>{item.textoResenha}</Text>
            </View>
          )}
          contentContainerStyle={styles.livrosContainer}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Não existe resenhas para o livro.</Text>
        </View>
      )}
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  livrosContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  resenhaContainer: {
    backgroundColor: "white",
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  headerResenha: {
    flexDirection: "row",
    alignItems: "center",
  },
  userIcon: {
    marginRight: 8,
  },
  userIdText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  resenhaTexto: {
    fontSize: 15,
    color: "#444",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});