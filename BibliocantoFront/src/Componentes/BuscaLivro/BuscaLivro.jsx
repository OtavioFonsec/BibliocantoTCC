import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./BuscaLivro.css";
import api from "../../services/api";
import { LuFilterX } from "react-icons/lu";

const BuscaLivro = ({ onResultado }) => {
  const [termo, setTermo] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [generos, setGeneros] = useState([]);
  const [editoras, setEditoras] = useState([]);
  const [mostrarSubfiltroGenero, setMostrarSubfiltroGenero] = useState(false);
  const [mostrarSubfiltroEditora, setMostrarSubfiltroEditora] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!termo.trim()) {
      onResultado([]);
      return;
    }

    const timer = setTimeout(async () => {
      setCarregando(true);
      setErro(null);

      try {
        const dados = await api.getLivroByNomeLivro(termo);
        onResultado(dados);
      } catch (error) {
        setErro("Erro ao buscar o livro. Tente novamente.");
      } finally {
        setCarregando(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [termo, onResultado]);

  const carregarGeneros = async () => {
    try {
      const lista = await api.getGeneros();
      setGeneros(lista);
    } catch (error) {
      console.error("Erro ao carregar os gêneros");
    }
  };

  const carregarEditoras = async () => {
    try {
      const lista = await api.getEditoras();
      setEditoras(lista);
    } catch (error) {
      console.error("Erro ao carregar as editoras");
    }
  };

  const handleGeneroHover = () => {
    setMostrarSubfiltroGenero(true);
    if (generos.length === 0) {
      carregarGeneros();
    }
  };

  const handleEditoraHover = () => {
    setMostrarSubfiltroEditora(true);
    if (editoras.length === 0) {
      carregarEditoras();
    }
  };

  const mostrarLimparFiltro =
    location.pathname.startsWith("/LivrosPorGenero/") ||
    location.pathname.startsWith("/LivrosPorEditora/");

  return (
    <div
      className={`busca-container ${
        location.pathname.startsWith("/LivrosPorGenero/") ||
        location.pathname.startsWith("/LivrosPorEditora/")
          ? "busca-container-pag-filtrada"
          : ""
      }`}
    >
      {location.pathname === "/" && (
        <div className="busca-input-group">
          <input
            type="text"
            className="busca-input"
            placeholder="Buscar livro pelo nome"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
          {carregando && <p className="busca-status">Buscando...</p>}
          {erro && <p className="busca-erro">{erro}</p>}
        </div>
      )}

      <div className="filtro-input-group">
        <button
          className={`FiltrarLivrosBtn ${
            location.pathname.startsWith("/LivrosPorGenero/") ||
            location.pathname.startsWith("/LivrosPorEditora/")
              ? "FiltrarLivrosBtn-pag-filtrada"
              : ""
          }`}
          onClick={() => setMostrarFiltros((prev) => !prev)}
        >
          <i
            className={
              location.pathname.startsWith("/LivrosPorGenero/") ||
              location.pathname.startsWith("/LivrosPorEditora/")
                ? "bi bi-funnel-fill"
                : "bi bi-funnel"
            }
          ></i>
        </button>

        {mostrarFiltros && (
          <div className="filtro-opcoes">
            <div
              className="genero-wrapper"
              onClick={() => {
                setMostrarSubfiltroGenero((prev) => {
                  const novoEstado = !prev;
                  if (novoEstado) {
                    setMostrarSubfiltroEditora(false);
                    if (generos.length === 0) carregarGeneros();
                  }
                  return novoEstado;
                });
              }}
            >
              <div className="filtro-item"><span>Gêneros</span> <i class="bi bi-chevron-right"></i></div>

              {mostrarSubfiltroGenero && (
                <div className="subfiltro-generos">
                  {generos.map((genero) => (
                    <div
                      key={genero.id}
                      className="subfiltro-item"
                      onClick={() => navigate(`/LivrosPorGenero/${genero.id}`)}
                    >
                      {genero.nomegenero}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="editora-wrapper"
              onClick={() => {
                setMostrarSubfiltroEditora((prev) => {
                  const novoEstado = !prev;
                  if (novoEstado) {
                    setMostrarSubfiltroGenero(false);
                    if (editoras.length === 0) carregarEditoras();
                  }
                  return novoEstado;
                });
              }}
            >
              <div className="filtro-item"><span>Editoras</span> <i class="bi bi-chevron-right"></i></div> 

              {mostrarSubfiltroEditora && (
                <div className="subfiltro-editoras">
                  {editoras.map((editora) => (
                    <div
                      key={editora.id}
                      className="subfiltro-item"
                      onClick={() =>
                        navigate(`/LivrosPorEditora/${editora.id}`)
                      }
                    >
                      {editora.nomeEditora}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {mostrarLimparFiltro && (
              <div
                className="filtro-item limpar-filtro"
                onClick={() => navigate("/")}
              >
                Limpar Filtro <LuFilterX className="icone-filtro" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuscaLivro;
