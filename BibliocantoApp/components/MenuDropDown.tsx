import React, { useState } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Modal,
    TextInput,
    Button,
    Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";
import api from "../services/api";

interface Props {
    tipo: string;
    idResenha: number;
    idComentario: number;
}

export default function MenuDenuncia({ tipo, idResenha, idComentario }: Props) {
    const [menuDropDown, setMenuDropDown] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [denunciaTexto, setDenunciaTexto] = useState('');
    const [idUser, setIdUser] = useState<string | null>(null);

    React.useEffect(() => {
        SecureStore.getItemAsync("IdUser").then(setIdUser);
    }, []);

    const handleMenuDropDown = () => {
        setMenuDropDown(!menuDropDown);
    };

    const fazerDenuncia = async () => {

        console.log(idResenha);
        console.log(idUser);

        const verificaSeJaTem = await api.get(`api/Denuncias/GetByIdResenhaAndIdUser?idResenha=${idResenha}&idUser=${idUser}`);

        console.log(verificaSeJaTem.data);

        if (verificaSeJaTem.data) {
            Alert.alert('Atenção', 'Você já fez uma denúncia para essa resenha.');
            return;
        }

        setModalVisible(true);
        setMenuDropDown(false);
    };

    const enviarDenuncia = async () => {
        try {

            if (!denunciaTexto) {
                Alert.alert('Atenção', 'Por favor, descreva sua denúncia.');
                return;
            }

            if (!idUser) {
                Alert.alert('Atenção', 'Você precisa estar logado para fazer uma denúncia.');
                return;
            }

            if (tipo !== 'resenha' && tipo !== 'comentario') {
                Alert.alert('Atenção', 'Tipo de denúncia inválido.');
                return;
            }

            if (tipo === 'resenha') {

                console.log(idResenha);

                const data = {
                    idUser: idUser,
                    idResenha: idResenha,
                    idComentario: 0,
                    descricao: denunciaTexto,
                    dataDenuncia: new Date().toISOString(),
                }

                console.log(data);

                await api.post('api/Denuncias', data);
            } else {
                const data = {
                    idUser: idUser,
                    idResenha: 0,
                    idComentario: idComentario,
                    descricao: denunciaTexto,
                    dataDenuncia: new Date().toISOString(),
                }

                await api.post('api/Denuncias', data);
            }

            Alert.alert('Sucesso', 'Sua denúncia foi recebida.');

            setModalVisible(false);
            setDenunciaTexto('');
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não conseguimos processar sua denúncia, por favor tente novamente.');
        }
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.container} />

            <View style={styles.containerHandleMenuDrop}>
                <TouchableOpacity
                    hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
                    onPress={handleMenuDropDown}
                >
                    <MaterialIcons name="more-vert" size={20} color="black" />
                </TouchableOpacity>

                {menuDropDown && (
                    <View style={styles.containerMenuDrop}>
                        <TouchableOpacity
                            onPress={fazerDenuncia}
                            hitSlop={{ top: 20, left: 15, right: 15, bottom: 5 }}
                            style={[styles.buttonMenuDrop, styles.paddingB10]}
                        >
                            <MaterialIcons name="warning" size={18} color="black" />
                            <Text style={styles.textMenuDrop}>Fazer Denúncia</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Modal da denúncia */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Descreva a denúncia</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Digite aqui sua denúncia"
                            multiline
                            value={denunciaTexto}
                            onChangeText={setDenunciaTexto}
                        />

                        <View style={styles.modalButtons}>
                            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                            <Button title="Enviar" onPress={enviarDenuncia} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginLeft: 5,
    },
    containerMenuDrop: {
        zIndex: 1,
        width: 160,
        padding: 12,
        borderRadius: 4,
        backgroundColor: '#fff',
        position: 'absolute',
        top: 30,
        right: -14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    containerHandleMenuDrop: {
        alignItems: 'flex-end',
        position: 'absolute',
        marginTop: 15,
        right: 8,
    },
    buttonMenuDrop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paddingB10: {
        paddingBottom: 10,
    },
    textMenuDrop: {
        marginLeft: 10,
        color: 'black',
        fontSize: 15,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    textInput: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
