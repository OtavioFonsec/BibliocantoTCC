import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./recomendacao.css";

const Recomendacao = ({idLivro}) => {

    const [livrosRecomendados, setLivrosRecomendados] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecomendacoes = async () => {
            try {
                // 1. Buscar o livro atual
                const livro = await api.getLivroById(idLivro);

                // 2. Obter o ID da editora do livro
                const editoraId = livro.editoras?.id;
                if (!editoraId) return;

                // 3. Buscar os livros da editora
                const livrosDaEditora = await api.getLivrosByIdEditora(editoraId);

                // 4. Remover o livro atual da lista de recomendações
                const filtrados  = livrosDaEditora.filter(
                    (l) => l.id !== idLivro
                );

                setLivrosRecomendados(filtrados);
            } catch (error) {
                console.error("Erro ao buscar recomendações da mesma editora:", error);
            }
        };

        if (idLivro) {
            fetchRecomendacoes();
        }
    }, [idLivro]);

    return (
        <div className="recomendacoes-container">
            <h2 className="recomendacao-titulo">da mesma editora:</h2>
            <div className="livros-grid">
                {livrosRecomendados.map((livro) => (
                    <div key={livro.id} className="livro-card">
                        <img
                            src={livro.caminhoImagem}
                            alt={livro.titulo}
                            onClick={() => navigate(`/Livro/${livro.id}`)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Recomendacao;
