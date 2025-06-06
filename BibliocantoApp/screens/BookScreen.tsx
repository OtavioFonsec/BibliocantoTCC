import React, { useEffect, useState } from "react";
import { View, Text, Alert, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, ToastAndroid } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRoute } from '@react-navigation/native';
import api from "../services/api";
import NavBar from "../components/NavBar";
import { faBookmark, faFlag, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import StarRating from "react-native-star-rating-widget";
import TabBarLivro from "../components/TabBarLivro";

interface Livro {
    id: number;
    titulo: string;
    caminhoImagem: string;
    descricao: string;
    editoras: Editora;
    isbn: number;
}

interface Editora {
    nomeEditora: string;
}

interface Avaliacao {
    estrelas: number;
    idUsuario?: number;
}

export default function BookScreen() {
    const route = useRoute();
    const { idLivro } = route.params as { idLivro: number };
    const [error, setError] = useState<string | null>(null);
    const [selectedLivro, setSelectedLivro] = useState<Livro | null>(null);
    const [autores, setAutores] = useState<string[]>([]);
    const [generos, setGeneros] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [mediaEstrelas, setMediaEstrelas] = useState(0);
    const [totalAvaliacoes, setTotalAvaliacoes] = useState(0);
    const [atualizarAvaliacoes, setAtualizarAvaliacoes] = useState(false);
    const [tempRating, setTempRating] = useState(0);
    const [finalRating, setFinalRating] = useState(0);
    const [lido, setLido] = useState(false);
    const [relido, setRelido] = useState(false);
    const [meuLivro, setMeuLivro] = useState(false);

    useEffect(() => {
        const getToken = async () => {
            return await SecureStore.getItemAsync("token");
        };

        const fetchData = async () => {
            setLoading(true);
            try {
                const token = await getToken();
                if (!token) throw new Error("Token não encontrado");

                const headers = { Authorization: `Bearer ${token}` };

                const [dadosLivroResponse, autorLivrosResponse, generoLivrosResponse] = await Promise.all([
                    api.get(`/api/Livros/${idLivro}`, { headers }),
                    api.get(`/api/AutorLivro/livro/${idLivro}`, { headers }),
                    api.get(`/api/GenerosLivro/livro/${idLivro}`, { headers })
                ]);

                setSelectedLivro(dadosLivroResponse.data);

                console.log(dadosLivroResponse.data)

                const autoresDetalhados = await Promise.all(
                    autorLivrosResponse.data.map(async (autorLivro: any) => {
                        const autorResponse = await api.get(`/api/Autores/${autorLivro.idAutor}`, { headers });
                        return autorResponse.data.nomeAutor;
                    })
                );
                setAutores(autoresDetalhados);

                const generosDetalhados = await Promise.all(
                    generoLivrosResponse.data.map(async (generoLivro: any) => {
                        const generoResponse = await api.get(`/api/Generos/${generoLivro.idGenero}`, { headers });
                        return generoResponse.data.nomegenero;
                    })
                );
                setGeneros(generosDetalhados);

            } catch (err) {
                setError("Erro ao carregar dados do livro.");
                console.error(err, ': ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchAvaliacoes = async () => {
            try {
                const response = await api.get<Avaliacao[]>('api/Avaliacao/AvaliacaoByLivro', {
                    params: { idLivro }
                });
                const avaliacoes = response.data;
                processarAvaliacoes(avaliacoes);
            } catch (error) {
                resetarAvaliacoes();
            }
        };

        const fetchAvaliacoesUser = async () => {
            const idUser = await SecureStore.getItemAsync("IdUser");
            try {
                const response = await api.get('api/Avaliacao/AvaliacaoByUserLivro', {
                    params: { idUser, idLivro }
                });
                const avaliacaoExistente = response.data.estrelas;

                setTempRating(avaliacaoExistente);
            } catch (error: any) {
                if (error?.response?.status !== 404) {
                    throw error;
                }
            }
        };

        const processarAvaliacoes = (avaliacoes: Avaliacao[]) => {
            if (avaliacoes.length > 0) {
                const somaEstrelas = avaliacoes.reduce((acc, { estrelas }) => acc + estrelas, 0);
                setMediaEstrelas(Number((somaEstrelas / avaliacoes.length).toFixed(1)));
                setTotalAvaliacoes(avaliacoes.length);
            } else {
                resetarAvaliacoes();
            }
        };

        const resetarAvaliacoes = () => {
            setMediaEstrelas(0);
            setTotalAvaliacoes(0);
        };

        fetchAvaliacoes();
        fetchAvaliacoesUser();
    }, [idLivro, atualizarAvaliacoes]);

    useEffect(() => {
        verificaMinhaBiblioteca();
    }, []);

    const verificaMinhaBiblioteca = async () => {
        const idUser = await SecureStore.getItemAsync("IdUser");

        if (!idUser) {
            showToastWithGravityAndOffset("Erro! Usuário não encontrado");
            return;
        }

        try {
            const verifica = await api.get("api/MeusLivros/GetMeuLivroByIdLivroIdUser", { params: { idUser, idLivro } });

            if (verifica.data.id !== null) {
                setMeuLivro(true);
            }
            else {
                setMeuLivro(false);
            }

            if (verifica.data.lido === 1) {
                setLido(true);
            } else {
                setLido(false);
            }

            if (verifica.data.relido === 1) {
                setRelido(true);
            }
            else {
                setRelido(false);
            }

        } catch {
            setMeuLivro(false);
            setLido(false);
            setRelido(false);
        }
    };

    const handleAddMeuLivro = async () => {
        const idUser = await SecureStore.getItemAsync("IdUser");

        if (!idUser) {
            showToastWithGravityAndOffset("Erro! Usuário não encontrado");
            return;
        }

        if (selectedLivro) {
            const idLivro = selectedLivro.id;
            const dados = { idUser, idLivro };

            try {
                const verifica = await api.get("api/MeusLivros/GetMeuLivroByIdLivroIdUser", { params: { idUser, idLivro } });
                const id = verifica.data.id;
                try {
                    await api.delete(`/api/MeusLivros/${id}`)
                    setMeuLivro(false);
                    showToastWithGravityAndOffset("Livro removido da biblioteca!");
                } catch {
                    showToastWithGravityAndOffset("Erro! Falha ao remover livro na biblioteca!");
                }
            } catch {
                try {
                    const response = await api.post("/api/MeusLivros", dados);
                    setMeuLivro(true);
                    showToastWithGravityAndOffset("Livro adicionado à biblioteca!");

                } catch (error) {
                    showToastWithGravityAndOffset("Erro! Falha ao salvar livro na biblioteca!");
                }
            }
        } else {
            Alert.alert('Erro!', "Nenhum livro selecionado");
        }
    };

    const handleAddLido = async () => {
        try {
            const idUser = await SecureStore.getItemAsync("IdUser");
            if (!idUser) {
                showToastWithGravityAndOffset("Erro! Usuário não encontrado");
                return;
            }

            if (!selectedLivro) return;

            const idLivro = selectedLivro.id;

            // Verifica se o livro está na biblioteca do usuário
            const { data } = await api.get("api/MeusLivros/GetMeuLivroByIdLivroIdUser", {
                params: { idUser, idLivro },
            });

            const { id, lido } = data;
            const novoStatus = lido === 1 ? 0 : 1;
            const mensagem = novoStatus === 1 ? "Livro marcado como lido!" : "Livro desmarcado como lido!";

            const dataAtualizado = { idLivro, idUser, lido: novoStatus };

            if (novoStatus === 1) {
                setLido(true);
            } else if (novoStatus === 0) {
                setLido(false);
            }

            await api.put(`api/MeusLivros/lido/${id}`, dataAtualizado, {
                headers: { "Content-Type": "application/json" },
            });

            showToastWithGravityAndOffset(mensagem);
        } catch (error) {
            showToastWithGravityAndOffset("Ocorreu um problema ao atualizar o status do livro.");
        }
    };

    const handleAddRelido = async () => {
        try {
            const idUser = await SecureStore.getItemAsync("IdUser");
            if (!idUser) {
                showToastWithGravityAndOffset("Erro! Usuário não encontrado");
                return;
            }

            if (!selectedLivro) return;

            const idLivro = selectedLivro.id;

            // Verifica se o livro está na biblioteca do usuário
            const { data } = await api.get("api/MeusLivros/GetMeuLivroByIdLivroIdUser", {
                params: { idUser, idLivro },
            });

            const { id, relido } = data;
            const novoStatus = relido === 1 ? 0 : 1;
            const mensagem = novoStatus === 1 ? "Livro marcado como relido!" : "Livro desmarcado como relido!";

            const dataAtualizado = { idLivro, idUser, relido: novoStatus };

            if (novoStatus === 1) {
                setRelido(true);
            } else if (novoStatus === 0) {
                setRelido(false);
            }

            await api.put(`api/MeusLivros/relido/${id}`, dataAtualizado, {
                headers: { "Content-Type": "application/json" },
            });

            showToastWithGravityAndOffset(mensagem);
        } catch (error) {
            showToastWithGravityAndOffset("Ocorreu um problema ao atualizar o status do livro.");
        }
    };

    const handleStarPress = (newRating: number) => {
        setTempRating(newRating); // Atualiza visualmente em tempo real
    };

    const handleRatingComplete = async (newRating: number) => {

        if (newRating === finalRating) return;

        try {
            const idUser = await SecureStore.getItemAsync("IdUser");
            if (!idUser) {
                showToastWithGravityAndOffset("Erro. Você precisa estar logado para avaliar");
                return;
            }

            const avaliacaoData = {
                idLivro,
                idUser,
                estrelas: newRating
            };

            console.log(avaliacaoData);

            let avaliacaoExistente = null;

            try {
                const response = await api.get('api/Avaliacao/AvaliacaoByUserLivro', {
                    params: { idUser, idLivro }
                });
                avaliacaoExistente = response.data;
            } catch (error: any) {
                if (error?.response?.status !== 404) {
                    throw error;
                }
            }

            if (avaliacaoExistente) {
                await api.put(`api/Avaliacao/${avaliacaoExistente.id}`, avaliacaoData, {
                    headers: { "Content-Type": "application/json" },
                });
            } else {
                await api.post("api/Avaliacao", avaliacaoData);
            }

            setFinalRating(newRating);
            setAtualizarAvaliacoes(prev => !prev);

        } catch (error: any) {
            let errorMessage = "Não foi possível registrar sua avaliação";
            if (error?.response) {
                errorMessage = error?.response?.data?.message || errorMessage;
            }

            showToastWithGravityAndOffset(`Erro: ${errorMessage}`);
        }
    };

    const showToastWithGravityAndOffset = (mensagem: string) => {
        ToastAndroid.showWithGravityAndOffset(
            mensagem,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            50,
        );
    };

    return (
        <View style={styles.container}>
            <View style={{ width: "100%" }}>
                <TabBarLivro currentScreen="Book" idLivro={idLivro} />
            </View>

            <ScrollView
                contentContainerStyle={{ flexGrow: 10, paddingBottom: 80 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text style={styles.loadingText}>Carregando dados do livro...</Text>
                    </View>
                ) : (
                    <View>


                        <View style={styles.header}>
                            <Text style={styles.title}>{selectedLivro ? selectedLivro.titulo : "Livro"}</Text>
                        </View>

                        <View style={styles.body}>
                            <Image
                                source={{ uri: selectedLivro?.caminhoImagem || "https://via.placeholder.com/150" }}
                                style={styles.image}
                            />

                            <View style={styles.iconContainer}>


                                <TouchableOpacity style={styles.iconButton} onPress={handleAddMeuLivro}>
                                    {meuLivro ? (
                                        <FontAwesomeIcon icon={faSquarePlus} size={20} color="green" />
                                    ) : (
                                        <FontAwesomeIcon icon={faSquarePlus} size={20} color="black" />
                                    )}
                                    <Text style={styles.texto}>Adicionar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton} onPress={handleAddLido}>
                                    {lido ? (
                                        <FontAwesomeIcon icon={faBookmark} size={20} color="green" />
                                    ) : (
                                        <FontAwesomeIcon icon={faBookmark} size={20} color="black" />
                                    )}
                                    <Text style={styles.texto}>Lido</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton} onPress={handleAddRelido}>
                                    {relido ? (
                                        <FontAwesomeIcon icon={faFlag} size={20} color="green" />
                                    ) : (
                                        <FontAwesomeIcon icon={faFlag} size={20} color="black" />
                                    )}
                                    <Text style={styles.texto}>Relido</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.ratingContainer}>
                                <View style={styles.starRatingContainer}>
                                    <StarRating
                                        rating={tempRating}
                                        onChange={handleStarPress}
                                        onRatingEnd={handleRatingComplete}
                                        maxStars={5}
                                        starSize={32}
                                        color="#FFD700"
                                        animationConfig={{ scale: 1.1 }}
                                    />
                                </View>
                            </View>

                            <View style={styles.ratingInfo}>
                                <Text style={styles.ratingText}>
                                    {mediaEstrelas > 0 ? `Média: ${mediaEstrelas} ⭐` : "Sem avaliações"}
                                </Text>
                                <Text style={styles.ratingText}>
                                    {totalAvaliacoes > 0 ? `(${totalAvaliacoes} avaliações)` : ""}
                                </Text>
                            </View>

                            <View style={styles.infoContainer}>
                                <Text style={styles.text}>{selectedLivro ? selectedLivro.descricao : "Descrição do livro"}</Text>
                                <Text style={styles.text}>Autor(es): {autores.length > 0 ? autores.join(", ") : "Autor do livro"}</Text>
                                <Text style={styles.text}>Gênero(s): {generos.length > 0 ? generos.join(", ") : "Gênero do livro"}</Text>
                                <Text style={styles.text}>Editora: {selectedLivro?.editoras?.nomeEditora || "Editora do livro"}</Text>
                                <Text style={styles.textUltimo}>ISBN: {selectedLivro ? selectedLivro.isbn : "ISBN"}</Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            <NavBar />
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
    header: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
        marginTop: 10,
        marginHorizontal: 25,
    },
    title: {
        fontSize: 22,
        color: "#333",
        fontWeight: "bold",
    },
    body: {
        alignItems: "center",
    },
    image: {
        width: 150,
        height: 220,
        marginBottom: 10,
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "center",
        //marginBottom: 5,
        marginTop: 10, // Ajustado para ficar abaixo da capa do livro
    },
    iconButton: {
        padding: 10,
        marginHorizontal: 10,
        alignItems: 'center'
    },
    infoContainer: {
        width: "100%",
        paddingHorizontal: 20,
    },
    text: {
        marginBottom: 5,
        textAlign: "justify",
        color: "#444",
    },
    textUltimo: {
        marginBottom: 50,
        textAlign: "justify",
    },
    footer: {
        position: "relative", // Alterado para não ficar fixo na parte inferior
        marginTop: 20, // Espaçamento para separar das informações
    },
    texto: {
        fontSize: 10,
        color: "black",
    },
    ratingContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 5,
    },
    starRatingContainer: {
        alignItems: 'center',
    },
    ratingInfo: {
        width: '50%',
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-evenly',
        paddingBottom: 10,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
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