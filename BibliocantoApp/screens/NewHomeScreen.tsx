import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList, Dimensions, ScrollView, Animated, RefreshControl } from "react-native";
import { RootStackParamList } from '../routes/StackNavigator';
import api from "../services/api";
import NavBar from "../components/NavBar";
import * as SecureStore from "expo-secure-store";
import { MaterialIcons } from '@expo/vector-icons';

// Constants
const ITEM_WIDTH = 120;
const ITEM_SPACING = 10;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CAROUSEL_OFFSET_DELAY = 100;

// Interfaces
interface Livro {
    id: number;
    titulo: string;
    caminhoImagem: string;
}

interface LivroMaisLido extends Livro {
    descricao: string;
}

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
    const [livros, setLivros] = useState<Livro[]>([]);
    const [livroMaisLido, setLivroMaisLido] = useState<LivroMaisLido | null>(null);
    const [resenhaMaisCurtida, setResenhaMaisCurtida] = useState<Resenha | null>(null);
    const [carrosselLivros, setCarrosselLivros] = useState<Livro[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const scrollX = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const flatListRef = useRef<FlatList<Livro>>(null);

    const fetchData = useCallback(async () => {
        try {
            setRefreshing(true);
            setError(null);

            // Fetch all books
            const [livrosResponse] = await Promise.all([
                api.get("api/Livros"),
            ]);

            setLivros(livrosResponse.data);

            // Fetch personalized suggestions
            try {
                const idUser = await SecureStore.getItemAsync("IdUser");
                const responseSugestao = await api.get("api/Livros/SugestaoParaUser", { params: { idUser } });
                const livrosSugestao = responseSugestao.data;

                if (livrosSugestao.length > 0) {
                    setCarrosselLivros(livrosSugestao);
                } else {
                    // Fallback to random books if no suggestions
                    const randomLivros = [...livrosResponse.data]
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 9);
                    setCarrosselLivros(randomLivros);
                }
            } catch (suggestionError) {
                console.error("Suggestion error:", suggestionError);
                // Fallback to random books if suggestion fails
                const randomLivros = [...livrosResponse.data]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 9);
                setCarrosselLivros(randomLivros);
            }
        } catch (err) {
            setError("Erro ao carregar os dados.");
            console.error(err);
        } finally {
            setRefreshing(false);
        }
    }, []);

    const carregaTopLivros = useCallback(async () => {
        try {
            const [livroMaisLidoResponse] = await Promise.all([
                api.get("api/Livros/GetLivroMaisLido"),
            ]);
            setLivroMaisLido(livroMaisLidoResponse.data);

        } catch (error) {
            console.error("Erro ao carregar o livro mais lido:", error);
        }
    }, []);

    const topResenha = useCallback(async () => {
        try {
            const [resenhaResponse] = await Promise.all([
                api.get("api/Resenha/GetResenhaMaisCurtida"),
            ]);

            console.log("Resenha mais curtida:", resenhaResponse.data);
            setResenhaMaisCurtida(resenhaResponse.data);

        } catch (error) {
            console.error("Erro ao carregar o resenha mais curtida:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
        carregaTopLivros();
        topResenha();
    }, [fetchData]);

    useEffect(() => {
        if (carrosselLivros.length > 0) {
            const timer = setTimeout(() => {
                const middleIndex = Math.floor(carrosselLivros.length / 2);
                flatListRef.current?.scrollToOffset({
                    offset: middleIndex * (ITEM_WIDTH + ITEM_SPACING),
                    animated: false,
                });
            }, CAROUSEL_OFFSET_DELAY);

            return () => clearTimeout(timer);
        }
    }, [carrosselLivros]);

    const handleImageClick = (livro: Livro) => {
        navigation.navigate('Book', { idLivro: livro.id });
    };

    const handleResenhaClick = (idLivro: number) => {
        navigation.navigate('Book', { idLivro });
    };

    const handleAcervoClick = () => {
        navigation.navigate('Home');
    };

    const onRefresh = useCallback(() => {
        fetchData();
    }, [fetchData]);

    const renderCarouselItem = ({ item, index }: { item: Livro; index: number }) => {
        const inputRange = [
            (index - 1) * (ITEM_WIDTH + ITEM_SPACING),
            index * (ITEM_WIDTH + ITEM_SPACING),
            (index + 1) * (ITEM_WIDTH + ITEM_SPACING),
        ];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity onPress={() => handleImageClick(item)} activeOpacity={0.7}>
                <Animated.View style={[styles.carouselItem, { transform: [{ scale }] }]}>
                    <Image
                        source={{ uri: item.caminhoImagem }}
                        style={styles.carouselImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.carouselTitle} numberOfLines={1}>{item.titulo}</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const renderBookItem = ({ item }: { item: Livro }) => (
        <TouchableOpacity onPress={() => handleImageClick(item)} activeOpacity={0.7}>
            <Image
                source={{ uri: item.caminhoImagem }}
                style={styles.livroCard}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );

    if (refreshing && !livros.length) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Carregando os livros...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {error && <Text style={styles.error}>{error}</Text>}

                    <Text style={styles.Titulo}>Sugestões para você</Text>

                    <Animated.FlatList
                        ref={flatListRef}
                        data={carrosselLivros}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
                        decelerationRate="fast"
                        bounces={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: true }
                        )}
                        scrollEventThrottle={16}
                        contentContainerStyle={styles.carouselContainer}
                        renderItem={renderCarouselItem}
                    />

                    <TouchableOpacity onPress={handleAcervoClick} activeOpacity={0.7}>
                        <Text style={styles.acervoTitulo}>Ver Acervo Completo</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={livros.slice(0, 3)}
                        keyExtractor={(livro) => livro.id.toString()}
                        numColumns={3}
                        renderItem={renderBookItem}
                        contentContainerStyle={styles.livrosContainer}
                        scrollEnabled={false}
                    />

                    {livroMaisLido && (
                        <View style={styles.mostReadContainer}>
                            <Text style={styles.sectionTitle}>Top 1 Livro Mais Lido</Text>
                            <TouchableOpacity
                                onPress={() => handleImageClick(livroMaisLido)}
                                style={styles.mostReadBook}
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={{ uri: livroMaisLido.caminhoImagem }}
                                    style={styles.mostReadImage}
                                    resizeMode="contain"
                                />
                                <View style={styles.mostReadDetails}>
                                    <Text style={styles.mostReadTitle}>{livroMaisLido.titulo}</Text>
                                    <Text style={styles.mostReadDescription} numberOfLines={3}>
                                        {livroMaisLido.descricao}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                    {resenhaMaisCurtida && (
                        <>
                            <Text style={styles.sectionTitle}>Resenha Mais Curtida</Text>
                            <TouchableOpacity
                                onPress={() => handleResenhaClick(resenhaMaisCurtida.idLivro)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.resenhaContainer}>
                                    <View style={styles.headerResenha}>
                                        <MaterialIcons name="person" size={20} color="#333" style={styles.userIcon} />
                                        <Text style={styles.userIdText}>{resenhaMaisCurtida.usuario.email}</Text>
                                    </View>
                                    <View style={styles.separator} />
                                    <Text style={styles.resenhaTexto}>{resenhaMaisCurtida.textoResenha}</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    )}

                </ScrollView>
            </View>
            <NavBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F2F5",
    },
    scrollContainer: {
        paddingBottom: 60,
    },
    error: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
        marginVertical: 10,
    },
    carouselContainer: {
        paddingHorizontal: (SCREEN_WIDTH - ITEM_WIDTH) / 2,
    },
    carouselItem: {
        width: ITEM_WIDTH,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginRight: ITEM_SPACING,
        marginTop: 10,
    },
    carouselImage: {
        width: '100%',
        height: 180,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000',
    },
    carouselTitle: {
        marginTop: 8,
        fontSize: 12,
        textAlign: 'center',
        width: '100%',
    },
    acervoTitulo: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'grey',
        textAlign: 'left',
        marginTop: 35,
        marginLeft: 10,
        textDecorationLine: 'underline',
    },
    livrosContainer: {
        marginTop: 5,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
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
        marginTop: 50,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    Titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'Black',
        textAlign: 'left',
        marginTop: 10,
        marginLeft: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'Black',
        marginTop: 20,
        marginLeft: 10,
        marginBottom: 5,
    },
    resenhaContainer: {
        backgroundColor: "white",
        marginTop: 1,
        padding: 12,
        borderRadius: 8,
        borderColor: "#ccc",
        borderWidth: 1,
        marginHorizontal: 10,
        marginBottom: 100
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
    mostReadContainer: {
        marginHorizontal: 10,
    },
    mostReadBook: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    mostReadImage: {
        width: 80,
        height: 120,
        borderRadius: 4,
    },
    mostReadDetails: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    mostReadTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: "#333",
    },
    mostReadDescription: {
        fontSize: 14,
        color: "#444",
    },
});