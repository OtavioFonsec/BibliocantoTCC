import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";
import BuscaLivro from "../../Componentes/BuscaLivro/BuscaLivro";
import CarrosselLivros from '../../Componentes/CarrosselLivros/CarrosselLivros';
import "./style.css";

function Inicio() {
  const [livros, setLivros] = useState([]);
  const [livrosBiblioteca, setLivrosBiblioteca] = useState([]);
  const [error, setError] = useState(null);
  const [email] = useState(localStorage.getItem("email") || null);
  const [hoveredLivro, setHoveredLivro] = useState(null);
  const [idBiblioteca, setIdLivroBiblioteca] = useState([]);

  const [livrosBuscados, setLivrosBuscados] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await api.getLivros(setLivros);
      } catch (err) {
        setError("Erro ao carregar os dados.");
        console.error(err);
      }
    };

    fetchData();
  }, []);

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

  // Função para verificar se o livro já está na biblioteca
  const isLivroNaBiblioteca = (livroId) => {
    return livrosBiblioteca.some((livro) => livro.livros.id === livroId);
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
    <div className="inicio-linha-container">

      {/* Componente de busca */}
      <BuscaLivro onResultado={setLivrosBuscados} />

      {error && <p className="error">{error}</p>}

      {/* Componente de carrossel de livros */}
      {livrosBuscados.length === 0 && <CarrosselLivros livros={livros} />}

      {/* Exibir os livros buscados */}
      {livrosBuscados.length > 0 && (
        <div className="livros-buscados">
          {livrosBuscados.map((livro) => (
            <div
              key={livro.id}
              className="livro-buscado-wrapper"
              onMouseEnter={() => setHoveredLivro(livro.id)} // Define o livro como o ativo
              onMouseLeave={() => setHoveredLivro(null)} // Limpa o estado ao sair do livro
            >
              <img
                className={`livro-buscado-card ${
                  hoveredLivro === livro.id ? "hover" : ""
                }`} // Aplica a classe hover caso o livro esteja no estado hovered
                src={livro.caminhoImagem}
                alt={livro.titulo}
                onClick={() => navigate(`/Livro/${livro.id}`)}
              />
              {hoveredLivro === livro.id && (
                <div className="livro-buscado-overlay">
                  <p>{livro.descricao}</p>
                  <div className="inicio-livro-actions">
                    {livro.linkCompra && (
                      <button
                        className="inicio-btnIcon"
                        onClick={() => window.open(livro.linkCompra, "_blank")}
                        title="Comprar livro"
                      >
                        <FontAwesomeIcon icon={faCartShopping} />
                      </button>
                    )}

                    {email &&
                      (!isLivroNaBiblioteca(livro.id) ? (
                        <button
                          className="inicio-btnIcon"
                          onClick={() => handleAddMeuLivro(livro)}
                          title="Adicionar à Biblioteca"
                        >
                          <i className="bi bi-bookmark-plus"></i>
                        </button>
                      ) : (
                        <button
                          className="inicio-btnIcon"
                          onClick={() => handleDeleteMeuLivro(livro.id)}
                          title="Remover da Biblioteca"
                        >
                          <i className="bi bi-bookmark-x"></i>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {/* Se nenhum livro foi buscado, exibir os livros do acervo */}
      {livrosBuscados.length === 0 && (
        <div className="inicio-livros-container">
          {livros.length > 0 ? (
            livros.map((livro) => (
              <div
                key={livro.id}
                className="inicio-livro-wrapper"
                onMouseEnter={() => setHoveredLivro(livro.id)}
                onMouseLeave={() => setHoveredLivro(null)}
              >
                <img
                  className={`inicio-livro-card ${
                    hoveredLivro === livro.id ? "hover" : ""
                  }`}
                  src={livro.caminhoImagem}
                  alt={livro.titulo}
                  onClick={() => navigate(`/Livro/${livro.id}`)}
                />
                {hoveredLivro === livro.id && (
                  <div className="inicio-livro-overlay">
                    <p>{livro.descricao}</p>
                    <div className="inicio-livro-actions">
                      {livro.linkCompra && (
                        <button
                          className="inicio-btnIcon"
                          onClick={() =>
                            window.open(livro.linkCompra, "_blank")
                          }
                          title="Comprar livro"
                        >
                          <FontAwesomeIcon icon={faCartShopping} />
                        </button>
                      )}

                      {email &&
                        (!isLivroNaBiblioteca(livro.id) ? (
                          <button
                            className="inicio-btnIcon"
                            onClick={() => handleAddMeuLivro(livro)}
                            title="Adicionar à Biblioteca"
                          >
                            <i className="bi bi-bookmark-plus"></i>
                          </button>
                        ) : (
                          <button
                            className="inicio-btnIcon"
                            onClick={() => handleDeleteMeuLivro(livro.id)}
                            title="Remover da Biblioteca"
                          >
                            <i className="bi bi-bookmark-x"></i>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <button className="btn btn-load" type="button" disabled>
              <span
                className="inicio-container spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Carregando os livros...
            </button>
          )}
        </div>
      )}
    </div>
  );
}
export default Inicio;