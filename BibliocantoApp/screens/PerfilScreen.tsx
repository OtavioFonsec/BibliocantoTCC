import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export default function UserProfileScreen() {
    const [nome, setNome] = useState('');
    const [apelido, setApelido] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [editando, setEditando] = useState(false);
    const [id, setId] = useState('');

    useEffect(() => {
        carregarDados();
    }, []);

    const formatarData = (data: any) => {
        // Exemplo: converter de DD/MM/AAAA para AAAA-MM-DD
        if (data && data.includes('/')) {
            const [dia, mes, ano] = data.split('/');
            return `${ano}-${mes}-${dia}`;
        }
        return data;
    };

    const formatarDataExibicao = (data: any) => {
        if (!data) return data; // Se data for null/undefined, retorna sem formatar
    
        // Verifica se é uma data no formato ISO (com 'T' e horário)
        if (data.includes('T')) {
            const [dataPart] = data.split('T'); // Pega apenas a parte da data (antes do 'T')
            const [ano, mes, dia] = dataPart.split('-');
            return `${dia}/${mes}/${ano}`;
        }
        // Verifica se é uma data no formato "YYYY-MM-DD"
        else if (data.includes('-')) {
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano}`;
        }
        // Se não for um formato reconhecido, retorna o valor original
        return data;
    };

    const handleSalvar = async () => {
        try {
            const idUser = await SecureStore.getItemAsync('IdUser');

            if (!idUser) {
                Alert.alert('Erro', 'ID do usuário não encontrado');
                return;
            }

            const dataFormatada = formatarData(dataNascimento);

            await api.put(`api/Perfil?id=${id}`, {
                idUser: idUser,
                nome: nome,
                apelido: apelido,
                descricao: descricao,
                dataNasc: dataFormatada || dataNascimento,
                fotoPerfil: '',   
            });

            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
            
            setEditando(false);
            carregarDados();    
        } catch (error: any) {
            let errorMessage = 'Não foi possível atualizar o perfil. Tente novamente mais tarde.';
            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
            }
            Alert.alert('Erro', errorMessage);
        }
    };

    const carregarDados = async () => {
        try {
            const idUser = await SecureStore.getItemAsync('IdUser');
            const response = await api.get('api/Perfil/GetByUser', { params: { idUser: idUser } });

            const dataFormatada = formatarDataExibicao(response?.data?.dataNasc);

            setNome(response?.data?.nome || '');
            setApelido(response?.data?.apelido || '');
            setDescricao(response?.data?.descricao || '');
            setDataNascimento(dataFormatada || '');
            setId(response?.data?.id || '');
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Meu Perfil</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                    editable={editando}
                    placeholder="Digite seu nome completo"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Apelido</Text>
                <TextInput
                    style={styles.input}
                    value={apelido}
                    onChangeText={setApelido}
                    editable={editando}
                    placeholder="Como prefere ser chamado?"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={descricao}
                    onChangeText={setDescricao}
                    editable={editando}
                    multiline
                    numberOfLines={4}
                    placeholder="Fale um pouco sobre você..."
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Data de Nascimento</Text>
                <TextInput
                    style={styles.input}
                    value={dataNascimento}
                    onChangeText={(text) => {
                        // Remove tudo que não é número
                        let cleanedText = text.replace(/[^0-9]/g, '');

                        // Adiciona as barras conforme o usuário digita
                        if (cleanedText.length > 2 && cleanedText.length <= 4) {
                            cleanedText = cleanedText.replace(/^(\d{2})(\d+)/, '$1/$2');
                        } else if (cleanedText.length > 4) {
                            cleanedText = cleanedText.replace(/^(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
                        }

                        // Limita a 8 dígitos (DDMMAAAA)
                        if (cleanedText.length <= 10) { // DD/MM/AAAA tem até 10 caracteres
                            setDataNascimento(cleanedText);
                        }
                    }}
                    editable={editando}
                    keyboardType="numeric"
                    placeholder="DD/MM/AAAA"
                    maxLength={10} // DD/MM/AAAA = 10 caracteres
                />
            </View>

            <View style={styles.buttonContainer}>
                {editando ? (
                    <>
                        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSalvar}>
                            <Text style={styles.buttonText}>Salvar Alterações</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setEditando(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={() => setEditando(true)}>
                        <Text style={styles.buttonText}>Editar Perfil</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontWeight: '600',
        color: '#555',
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
        fontSize: 16,
        color: 'black'
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#34C759',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});