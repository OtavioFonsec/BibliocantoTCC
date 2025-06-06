import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";
import BuscaLivro from "../../Componentes/BuscaLivro/BuscaLivro";
import "./LivrosPorGenero.css";

const LivrosPorGenero = () => {
  const { id } = useParams();
  const [genero, setGenero] = useState(null);
  const [livros, setLivros] = useState([]);
  const [hoveredLivro, setHoveredLivro] = useState(null);
  const [livrosBiblioteca, setLivrosBiblioteca] = useState([]);
  const [idBiblioteca, setIdLivroBiblioteca] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGeneroELivros = async () => {
      try {
        const generoResponse = await api.get(`/api/Generos/${id}`);
        setGenero(generoResponse.data);

        const livrosIds = await api.getTodosLivrosByGenero(id);

        const livrosDetalhados = await Promise.all(
          livrosIds.map(async (livro) => {
            try {
              const livroCompleto = await api.getLivroById(livro.idLivro);
              return livroCompleto;
            } catch (error) {
              console.error(
                `Erro ao buscar dados do livro ID ${livro.id}:`,
                error
              );
              return null; // Para que o Promise.all continue mesmo se uma requisição falhar
            }
          })
        );

        const livrosFiltrados = livrosDetalhados.filter(
          (livro) => livro !== null
        );
        setLivros(livrosFiltrados);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchGeneroELivros();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const idUser = localStorage.getItem("Id");

      try {
        const LivrosBiblioteca = await api.BibliotecaByUser(idUser);
        setLivrosBiblioteca(LivrosBiblioteca);
      } catch (err) {}
    };

    fetchData();
  }, [livrosBiblioteca]);

  // Função para verificar se o livro já está na biblioteca
  const isLivroNaBiblioteca = (livroId) => {
    return livrosBiblioteca.some((livro) => livro.livros.id === livroId);
  };

  //funcao para adicionar o livro da biblioteca do usuario
  const handleAddMeuLivro = async (livro) => {
    const idUser = localStorage.getItem("Id");

    if (!idUser) {
      alert("Usuário não encontrado");
      return;
    }

    const idLivro = livro.id;

    try {
      const data = { idUser, idLivro };
      await api.post("/api/MeusLivros", data);
    } catch (error) {
      console.error("Erro ao adicionar livro:", error);
      alert("Falha ao salvar livro na biblioteca!: " + error.message);
    }
  };

  //funcao para remover o livro da biblioteca do usuario
  const handleDeleteMeuLivro = async (idLivro) => {
    const idUser = localStorage.getItem("Id");

    try {
      // Buscar o ID do livro na biblioteca do usuário
      const livroBiblioteca = await api.GetMeuLivroByIdLivroIdUser(
        idUser,
        idLivro
      );

      const idBiblioteca = livroBiblioteca.id;
      setIdLivroBiblioteca(idBiblioteca);

      // Excluir o livro da biblioteca
      await api.DeleteMeuLivro(idBiblioteca);

      // Atualizar a lista removendo o livro excluído
      setLivrosBiblioteca((prevLivros) =>
        prevLivros.filter((livro) => livro.id !== idBiblioteca)
      );
    } catch (error) {
      console.error("Erro ao excluir o livro da biblioteca:", error);
      alert("Falha ao remover o livro da biblioteca.");
    }
  };

  return (
    <div className="livrosPorGenero-linha-container">
      
      <div className="livrosPorGenero-header">
        
        <h2 className="TitulolivrosPorGenero">
          {genero ? `${genero.nomegenero}` : "Carregando..."}
        </h2>

        <div className="componente-busca-livros-LivroPorGenero">
          <BuscaLivro onResultado={(resultado) => {}} />
        </div>
      </div>

      <div className="livrosPorGenero-livros-container">
        {livros.length > 0 ? (
          livros.map((livro) => (
            <div
              key={livro.id}
              className="livrosPorGenero-livro-wrapper"
              onMouseEnter={() => setHoveredLivro(livro.id)}
              onMouseLeave={() => setHoveredLivro(null)}
            >
              <img
                src={livro.caminhoImagem}
                alt={livro.titulo}
                className="livrosPorGenero-livro-card"
                onClick={() => navigate(`/Livro/${livro.id}`)}
              />
              {hoveredLivro === livro.id && (
                <div className="livrosPorGenero-livro-overlay">
                  <p>{livro.descricao}</p>
                  <div className="livrosPorGenero-livro-actions">
                    {livro.linkCompra && (
                      <button
                        className="livrosPorGenero-btnIcon"
                        onClick={() => window.open(livro.linkCompra, "_blank")}
                        title="Comprar livro"
                      >
                        <FontAwesomeIcon icon={faCartShopping} />
                      </button>
                    )}

                    {!isLivroNaBiblioteca(livro.id) ? (
                      <button
                        className="livrosPorGenero-btnIcon"
                        onClick={() => handleAddMeuLivro(livro)}
                        title="Adicionar à Biblioteca"
                      >
                        <i className="bi bi-bookmark-plus"></i>
                      </button>
                    ) : (
                      <button
                        className="livrosPorGenero-btnIcon"
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
            Nenhum livro encontrado para este gênero.
          </p>
        )}
      </div>
    </div>
  );
};

export default LivrosPorGenero;
