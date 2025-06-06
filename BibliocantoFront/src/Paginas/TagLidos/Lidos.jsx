import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import "./Lidos.css";

const Lidos = () => {
  const [livrosLidos, setLivrosLidos] = useState([]);
  const [hoveredLivro, setHoveredLivro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLivrosLidos = async () => {
      const idUser = localStorage.getItem("Id");

      try {
        const response = await api.BibliotecaByUser(idUser);

        const livrosFiltrados = response.filter((item) => item.lido === 1);
        setLivrosLidos(livrosFiltrados);
      } catch (error) {
        setError("Erro ao buscar os livros lidos.");
        console.error("Erro ao buscar os livros do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLivrosLidos();
  }, []);

  return (
    <div className="biblioteca-lidos-container">
      {error && <p className="error">{error}</p>}
      {loading ? (
        <button className="btn btn-load" type="button" disabled>
          <span
            className="biblioteca-spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Carregando os livros...
        </button>
      ) : livrosLidos.length > 0 ? (
        <div className="biblioteca-livros-lidos-container">
          {livrosLidos.map((livro) => (
            <div
              key={livro.id}
              className="biblioteca-livro-lido-wrapper"
              onMouseEnter={() => setHoveredLivro(livro.id)}
              onMouseLeave={() => setHoveredLivro(null)}
            >
              <img
                className={`biblioteca-livro-lido-card ${
                  hoveredLivro === livro.id ? "hover" : ""
                }`}
                src={livro.livros.caminhoImagem}
                alt={livro.livros.titulo}
                onClick={() => navigate(`/Livro/${livro.livros.id}`)}
              />
              {hoveredLivro === livro.id && (
                <div className="biblioteca-livro-lido-overlay">
                  <p>{livro.livros.descricao}</p>
                  <div className="biblioteca-livro-lido-actions">
                    {livro.livros.linkCompra && (
                      <button
                        className="biblioteca-lido-btnIcon"
                        onClick={() => window.open(livro.livros.linkCompra, "_blank")}
                        title="Comprar Livro"
                      >
                        <FontAwesomeIcon icon={faCartShopping} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhum livro lido encontrado.</p>
      )}
    </div>
  );
};

export default Lidos;