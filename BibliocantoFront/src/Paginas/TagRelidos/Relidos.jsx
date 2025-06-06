import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import "./Relidos.css";

const Relidos = () => {
  const [livrosRelidos, setLivrosRelidos] = useState([]);
  const [hoveredLivro, setHoveredLivro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLivrosRelidos = async () => {
      const idUser = localStorage.getItem("Id");

      try {
        const response = await api.BibliotecaByUser(idUser);

        const livrosFiltrados = response.filter((item) => item.relido === 1);
        setLivrosRelidos(livrosFiltrados);
      } catch (error) {
        setError("Erro ao buscar os livros relidos.");
        console.error("Erro ao buscar os livros do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLivrosRelidos();
  }, []);

  return (
    <div className="biblioteca-relidos-container">
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
      ) : livrosRelidos.length > 0 ? (
        <div className="biblioteca-livros-relidos-container">
          {livrosRelidos.map((livro) => (
            <div
              key={livro.id}
              className="biblioteca-livro-relido-wrapper"
              onMouseEnter={() => setHoveredLivro(livro.id)}
              onMouseLeave={() => setHoveredLivro(null)}
            >
              <img
                className={`biblioteca-livro-relido-card ${
                  hoveredLivro === livro.id ? "hover" : ""
                }`}
                src={livro.livros.caminhoImagem}
                alt={livro.livros.titulo}
                onClick={() => navigate(`/Livro/${livro.livros.id}`)}
              />
              {hoveredLivro === livro.id && (
                <div className="biblioteca-livro-relido-overlay">
                  <p>{livro.livros.descricao}</p>
                  <div className="biblioteca-livro-relido-actions">
                    {livro.livros.linkCompra && (
                      <button
                        className="biblioteca-relido-btnIcon"
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
        <p>Nenhum livro relido encontrado.</p>
      )}
    </div>
  );
};

export default Relidos;