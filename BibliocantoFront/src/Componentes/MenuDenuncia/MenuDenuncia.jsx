import React, { useState, useEffect } from 'react';
import { FaEllipsisV, FaExclamationTriangle } from 'react-icons/fa';
import api from "../../services/api";
import './MenuDenuncia.css';

export default function MenuDenuncia({ tipo, idResenha, idComentario }) {
    const [menuDropDown, setMenuDropDown] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [denunciaTexto, setDenunciaTexto] = useState('');
    const [idUser, setIdUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('Id');
        setIdUser(userId);
    }, []);

    const handleMenuDropDown = () => {
        setMenuDropDown(!menuDropDown);
    };

    const fazerDenuncia = async () => {
        try {

            let verifica = {};
            console.log('Tipo:', tipo);

            if (tipo === 'resenha') {
                verifica = await api.get(
                    `api/Denuncias/GetByIdResenhaAndIdUser?idResenha=${idResenha}&idUser=${idUser}`
                );
            } else if (tipo === 'comentario') {
                verifica = await api.get(
                    `api/Denuncias/GetByIdComentarioAndIdUser?idComentario=${idComentario}&idUser=${idUser}`
                );
            }

            if (verifica.data) {

                if (tipo === 'resenha') {
                    alert('Você já fez uma denúncia para essa resenha.');
                } else {
                    alert('Você já fez uma denúncia para esse comentário.');
                }

                setMenuDropDown(false);
                return;
            }

            setModalVisible(true);
            setMenuDropDown(false);
        } catch (error) {
            console.error(error);
            alert('Erro ao verificar denúncia.');
        }
    };

    const enviarDenuncia = async () => {
        try {
            if (!denunciaTexto) {
                alert('Por favor, descreva sua denúncia.');
                return;
            }

            if (!idUser) {
                alert('Você precisa estar logado para fazer uma denúncia.');
                return;
            }

            if (tipo !== 'resenha' && tipo !== 'comentario') {
                alert('Tipo de denúncia inválido.');
                return;
            }

            const data = {
                idUser,
                idResenha: tipo === 'resenha' ? idResenha : 0,
                idComentario: tipo === 'comentario' ? idComentario : 0,
                descricao: denunciaTexto,
                dataDenuncia: new Date().toISOString(),
            };

            await api.post('api/Denuncias', data);

            alert('Sua denúncia foi recebida.');

            setModalVisible(false);
            setDenunciaTexto('');
        } catch (error) {
            console.error(error);
            alert('Não conseguimos processar sua denúncia, por favor tente novamente.');
        }
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button onClick={handleMenuDropDown} className="botoesdenuncia">
                <FaEllipsisV size={18} />
            </button>

            {menuDropDown && (
                <div style={styles.menuDrop}>
                    <button onClick={fazerDenuncia} style={styles.menuItem}>
                        <FaExclamationTriangle size={14} className="opcaodenuncia"/>
                        <span className="opcaodenuncia">Fazer Denúncia</span>
                    </button>
                </div>
            )}

            {modalVisible && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2>Descreva a denúncia</h2>
                        <textarea
                            style={styles.textArea}
                            placeholder="Digite aqui sua denúncia"
                            value={denunciaTexto}
                            onChange={(e) => setDenunciaTexto(e.target.value)}
                        />

                        <div style={styles.modalButtons}>
                            <button onClick={() => setModalVisible(false)} style={styles.cancelButton}>
                                Cancelar
                            </button>
                            <button onClick={enviarDenuncia} style={styles.submitButton}>
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    menuDrop: {
        position: 'absolute',
        top: 24,
        right: 0,
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: 4,
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        zIndex: 100,
        padding: 8,
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        background: 'none',
        border: 'none',
        padding: '6px 8px',
        cursor: 'pointer',
        width: '175px',
        textAlign: 'left',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        width: '90%',
        maxWidth: 400,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    },
    textArea: {
        width: '100%',
        height: 100,
        borderRadius: 6,
        border: '1px solid #ccc',
        padding: 10,
        resize: 'none',
        marginBottom: 15,
    },
    modalButtons: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#ccc',
        padding: '6px 12px',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
    },
    submitButton: {
        backgroundColor: '#4caf50',
        color: '#fff',
        padding: '6px 12px',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
    },
};
