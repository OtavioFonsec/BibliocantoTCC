import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { RootStackParamList } from '../routes/StackNavigator';
import api from '../services/api';
import { MaterialIcons } from '@expo/vector-icons';
import NavBar from "../components/NavBar";

export default function OpcoesScreen() {
    const [email, setEmail] = useState<string | null>(null);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    useEffect(() => {
        const fetchData = async () => {
            const userEmail = await SecureStore.getItemAsync("email");
            setEmail(userEmail);
        };
        fetchData();
    }, []);

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('email');
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('expiration');
        await SecureStore.deleteItemAsync('IdUser');

        navigation.navigate('Login');
    };

    const verificaPerfil = async () => {
        const idUser = await SecureStore.getItemAsync('IdUser');

        try {
            const response = await api.get('api/Perfil/GetByUserBoolean', {
                params: { idUser: idUser },
            });

            if (response.data === true) {
                navigation.navigate('Perfil');
            } else {
                try {

                    const data = {
                        idUser,
                        nome: "",
                        apelido: "",
                        descricao: "",
                        dataNasc: null,
                        fotoPerfil: ""
                      };
                
                    const response = await api.post('api/Perfil', data);
                
                    if (response?.status === 200) {
                        navigation.navigate('Perfil');
                    } else {
                        Alert.alert('Erro', 'Não foi possível criar o perfil. Tente novamente mais tarde.');
                    }
                } catch (error: any) {
                    Alert.alert('Erro', 'Houve um erro ao tentar criar o perfil. Tente novamente mais tarde.');
                }
                
            }
        } catch (error) {
            console.error('Erro inesperado:', error);
            Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente mais tarde.');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../assets/default-profile.png')}
                    style={styles.profileImage}
                />
                <Text style={styles.emailText}>{email || 'Email não disponível'}</Text>
            </View>

            <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.button} onPress={verificaPerfil}>
                    <MaterialIcons name="person" style={styles.iconDefault} />
                    <Text style={styles.buttonText}>Perfil do usuário</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PoliticaPrivacidade')}>
                    <MaterialIcons name="lock" style={styles.iconDefault} />
                    <Text style={styles.buttonText}>Política de privacidade</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SobreSite')}>
                    <MaterialIcons name="info" style={styles.iconDefault} />
                    <Text style={styles.buttonText}>Sobre o bibliocanto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Preferencias')}>
                    <MaterialIcons name="settings" style={styles.iconDefault} />
                    <Text style={styles.buttonText}>Preferências</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <MaterialIcons name="logout" style={styles.iconDefault} />
                    <Text style={styles.buttonText}>Sair</Text>
                </TouchableOpacity>
            </View>

            <NavBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F2F5",
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DDE5ED',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,

    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    emailText: {
        fontSize: 16,
        color: '#333',
        flexShrink: 1,
    },
    optionsContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
    },
    iconDefault: {
        fontSize: 24,
        color: '#333',
        marginRight: 10,
    },
});
