import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";
import BuscaLivro from "../../Componentes/BuscaLivro/BuscaLivro";
import "./LivrosPorEditora.css";

const LivrosPorEditora = () => {
  const { id } = useParams();
  const [editora, setEditora] = useState(null);
  const [livros, setLivros] = useState([]);
  const [hoveredLivro, setHoveredLivro] = useState(null);
  const [livrosBiblioteca, setLivrosBiblioteca] = useState([]);
  const [idBiblioteca, setIdLivroBiblioteca] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEditoraELivros = async () => {
      try {
        // Buscar editora
        const editoraResponse = await api.getEditoraById(id);
        setEditora(editoraResponse);

        // Buscar livros da editora
        const livrosResponse = await api.getLivrosByIdEditora(id);
        setLivros(livrosResponse);
      } catch (error) {
        console.error("Erro ao buscar dados da editora ou livros:", error);
      }
    };

    fetchEditoraELivros();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const idUser = localStorage.getItem("Id");

      try {
        const LivrosBiblioteca = await api.BibliotecaByUser(idUser);
        setLivrosBiblioteca(LivrosBiblioteca);
      } catch (err) {
        console.error("Erro ao buscar biblioteca:", err);
      }
    };

    fetchData();
  }, [livrosBiblioteca]);

  const isLivroNaBiblioteca = (livroId) => {
    return livrosBiblioteca.some((livro) => livro.livros.id === livroId);
  };

  const handleAddMeuLivro = async (livro) => {
    const idUser = localStorage.getItem("Id");

    if (!idUser) {
      alert("Usuário não encontrado");
      return;
    }

    try {
      const data = { idUser, idLivro: livro.id };
      await api.post("/api/MeusLivros", data);
    } catch (error) {
      console.error("Erro ao adicionar livro:", error);
      alert("Falha ao salvar livro na biblioteca!: " + error.message);
    }
  };

  const handleDeleteMeuLivro = async (idLivro) => {
    const idUser = localStorage.getItem("Id");

    try {
      const livroBiblioteca = await api.GetMeuLivroByIdLivroIdUser(
        idUser,
        idLivro
      );
      const idBiblioteca = livroBiblioteca.id;
      setIdLivroBiblioteca(idBiblioteca);

      await api.DeleteMeuLivro(idBiblioteca);

      setLivrosBiblioteca((prevLivros) =>
        prevLivros.filter((livro) => livro.id !== idBiblioteca)
      );
    } catch (error) {
      console.error("Erro ao excluir o livro da biblioteca:", error);
      alert("Falha ao remover o livro da biblioteca.");
    }
  };

  return (
    <div className="LivrosPorEditora-linha-container">

      <div className="livrosPorEditora-header">
        <h2 className="TituloLivrosPorEditora">
          {editora ? `${editora.nomeEditora}` : "Carregando..."}
        </h2>
        <div className="componente-busca-livros-LivroPorEditora">
          <BuscaLivro onResultado={() => {}} />
        </div>
      </div>

      <div className="LivrosPorEditora-livros-container">
        {livros.length > 0 ? (
          livros.map((livro) => (
            <div
              key={livro.id}
              className="LivrosPorEditora-livro-wrapper"
              onMouseEnter={() => setHoveredLivro(livro.id)}
              onMouseLeave={() => setHoveredLivro(null)}
            >
              <img
                src={livro.caminhoImagem}
                alt={livro.titulo}
                className="LivrosPorEditora-livro-card"
                onClick={() => navigate(`/Livro/${livro.id}`)}
              />
              {hoveredLivro === livro.id && (
                <div className="LivrosPorEditora-livro-overlay">
                  <p>{livro.descricao}</p>
                  <div className="LivrosPorEditora-livro-actions">
                    {livro.linkCompra && (
                      <button
                        className="LivrosPorEditora-btnIcon"
                        onClick={() => window.open(livro.linkCompra, "_blank")}
                        title="Comprar livro"
                      >
                        <FontAwesomeIcon icon={faCartShopping} />
                      </button>
                    )}

                    {!isLivroNaBiblioteca(livro.id) ? (
                      <button
                        className="LivrosPorEditora-btnIcon"
                        onClick={() => handleAddMeuLivro(livro)}
                        title="Adicionar à Biblioteca"
                      >
                        <i className="bi bi-bookmark-plus"></i>
                      </button>
                    ) : (
                      <button
                        className="LivrosPorEditora-btnIcon"
                        onClick={() => handleDeleteMeuLivro(livro.id)}
                        title="Remover da Biblioteca"
                      >
                        <i className="bi bi-bookmark-x"></i>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ marginTop: "20px" }}>
            Nenhum livro encontrado para esta editora.
          </p>
        )}
      </div>
    </div>
  );
};

export default LivrosPorEditora;
