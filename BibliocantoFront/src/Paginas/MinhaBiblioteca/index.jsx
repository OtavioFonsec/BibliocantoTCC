import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

import "./MinhaBiblioteca.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Linha() {
  const [livros, setLivros] = useState([]);
  const [error, setError] = useState(null);
  const [hoveredLivro, setHoveredLivro] = useState(null);
  const [idBiblioteca , setIdLivroBiblioteca] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const idUser = localStorage.getItem("Id");
      if (!idUser) {
        setError("Usuário não encontrado.");
        return;
      }
  
      try {
        const livros = await api.BibliotecaByUser(idUser);
        setLivros(livros);
      } catch (err) {
        setError("Erro ao carregar os dados.");
        console.error(err);
      }
    };
  
    fetchData();
  }, []);

  const handleImageClick = (livro) => {
    navigate(`/Livro/${livro.livros.id}`);
  };

//funcao para remover o livro da biblioteca do usuario
const handleDeleteMeuLivro = async (idLivro) => {
  const idUser = localStorage.getItem("Id");

  try {
    // Buscar o ID do livro na biblioteca do usuário
    const livroBiblioteca = await api.GetMeuLivroByIdLivroIdUser(idUser, idLivro);

    const idBiblioteca = livroBiblioteca.id;

    // Excluir o livro da biblioteca
    await api.DeleteMeuLivro(idBiblioteca);

    // Atualizar a lista removendo o livro excluído
    setLivros((prevLivros) =>
      prevLivros.filter((livro) => livro.livros.id !== idLivro)
    );

  } catch (error) {
    console.error("Erro ao excluir o livro da biblioteca:", error);
    alert("Falha ao remover o livro da biblioteca.");
  }
};

  return (
    <div className="biblioteca-container">

      {error && <p className="error">{error}</p>}
      {livros.length > 0 ? (
        <div className="biblioteca-livros-container">
                  {livros.map((livro) => (
                    <div
                      key={livro.id}
                      className="biblioteca-livro-wrapper"
                      onMouseEnter={() => setHoveredLivro(livro.id)}
                      onMouseLeave={() => setHoveredLivro(null)}
                    >
                      <img
                        className={`biblioteca-livro-card ${hoveredLivro === livro.id ? "hover" : ""}`}
                        key={livro.livros.id}
                        src={livro.livros.caminhoImagem}
                        alt={livro.livros.titulo}
                        onClick={() => handleImageClick(livro)}
                      />
                      {hoveredLivro === livro.id && (
                        <div className="biblioteca-livro-overlay">
                          <p>{livro.livros.descricao}</p>
                          
                            <div className="biblioteca-livro-actions">
                              {livro.livros.linkCompra && (
                                <button
                                  className="biblioteca-btnIcon"
                                  onClick={() => window.open(livro.livros.linkCompra, "_blank")}
                                  title="Comprar Livro"
                                >
                                  <FontAwesomeIcon icon={faCartShopping} />
                                </button>
                              )}
                              <button className="biblioteca-btnIcon" onClick={() => handleDeleteMeuLivro(livro.livros.id)} title="Remover da Biblioteca">
                                <i className="bi bi-bookmark-x"></i>
                              </button>
                            </div>
                          
                        </div>
                      )}
                    </div>
                  ))}
                </div>
      ) : (
        <button className="btn btn-load" type="button" disabled>
          <span
            className="biblioteca-spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Carregando os livros...
        </button>
      )}
    </div>
  );
}
