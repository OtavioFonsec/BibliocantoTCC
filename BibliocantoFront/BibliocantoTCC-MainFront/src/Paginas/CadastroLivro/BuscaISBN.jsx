import api from "../../services/api"; // Importa a configuração da API local
import BrasilAPi from "../../services/BrasiApi"; // Importa a configuração da BRASILAPI
import { useState } from "react"; // Hook para gerenciar estados locais
import { useNavigate } from "react-router-dom"; // Hook para redirecionar entre páginas
import "./BuscaISBN.css"; // Importa o arquivo de estilos

// Componente principal para buscar livros pelo ISBN
export default function BuscaLivroIsbn() {
  const navigate = useNavigate();

  const [isbn, setISBN] = useState("");
  const [selectedLivro, setSelectedLivro] = useState(null);
  const [isFromBrasilAPI, setIsFromBrasilAPI] = useState(false);
  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [livroData, setLivroData] = useState(null);
  const [livroIdLocal, setLivroIdLocal] = useState(null);

  const handleGetLivro = async (e) => {
    e.preventDefault();

    const verificaIsbn = /^(978|979)-?\d{10}$/; // Regex para ISBN-13

    if (!verificaIsbn.test(isbn)) {
      alert("ISBN inválido");
      return;
    }

    const isbnData = { isbn };

    const normalizeLivroData = (livro, provider) => ({
      isbn: livro.isbn,
      title: livro.title || livro.titulo,
      publisher: livro.publisher || livro.editoras?.nomeEditora || "",
      synopsis: livro.synopsis || livro.descricao || "",
      cover_url: livro.cover_url || livro.caminhoImagem || null,
      authors: livro.authors,
      subjects: livro.subjects,
      provider,
    });

    try {
      // Busca no banco local
      const response = await api.buscarLivroPorISBN(isbn);
      if (response.data) {
        const livroLocal = await api.getLivroById(response.data.id);
        setSelectedLivro(normalizeLivroData(livroLocal, "local"));
        setIsFromBrasilAPI(false);
        await fetchAutoresDoLivro(response.data.id);
        await fetchGenerosDoLivro(response.data.id);
        return;
      }
    } catch (error) {
      if (!(error.response && error.response.status === 404)) {
        alert("Erro inesperado ao buscar livro no banco de dados local.");
        return;
      }
    }

    try {
      // Busca na BrasilAPI
      const livroBrasilAPI = await BrasilAPi.isbn.getBy(isbn);
      setSelectedLivro(normalizeLivroData(livroBrasilAPI, "brasilapi"));
      setIsFromBrasilAPI(true);
      setAutores(livroBrasilAPI.authors || []);
      setGeneros([]);
    } catch (error) {
      alert(
        "Livro não encontrado nem no banco de dados local nem na BrasilAPI!"
      );
    }
  };

  const handleInputChange = (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 3) {
      valor = valor.substring(0, 3) + "-" + valor.substring(3);
    }
    setISBN(valor);
  };

  const fetchGenerosDoLivro = async (idLivro) => {
    try {
      // Busca os IDs dos gêneros relacionados ao livro
      const generosRelacionados = await api.buscarGenerosPorLivro(idLivro);
      const nomesGeneros = [];

      // Para cada gênero relacionado, busca o nome do gênero
      for (const genero of generosRelacionados) {
        const generoDetalhes = await api.buscarGeneroPorId(genero.idGenero);
        nomesGeneros.push(generoDetalhes.nomegenero);
      }

      setGeneros(nomesGeneros); // Armazena os nomes dos gêneros no estado
    } catch (error) {
      console.error("Erro ao processar os gêneros do livro:", error);
    }
  };

  const fetchAutoresDoLivro = async (idLivro) => {
    try {
      // Busca os IDs dos autores relacionados ao livro
      const autoresRelacionados = await api.buscarAutoresPorLivro(idLivro);
      const nomesAutores = [];

      // Para cada autor relacionado, busca o nome do autor
      for (const autor of autoresRelacionados) {
        const autorDetalhes = await api.buscarAutorPorId(autor.idAutor);
        nomesAutores.push(autorDetalhes.nomeAutor);
      }

      setAutores(nomesAutores); // Armazena os nomes dos autores no estado
    } catch (error) {
      console.error("Erro ao processar os autores do livro:", error);
    }
  };

  return (
    <div className={`divBuscaIsbn ${selectedLivro ? "divBuscaIsbnLivroSelecionado" : ""}`}>
      <div className="divTituloBuscaIsbn">
        {/* Título dinâmico baseado no estado do livro selecionado */}
        <h2 className="TituloBuscaIsbn">
          {selectedLivro
            ? isFromBrasilAPI
              ? "Cadastrar Livro"
              : "Livro já cadastrado"
            : "Digite o ISBN do livro"}
        </h2>
      </div>

      <div className={`formBuscaIsbn ${selectedLivro ? "divLivroSelecionado" : ""}`}>
        {/* Exibe o campo de entrada de ISBN enquanto nenhum livro foi selecionado */}
        {!selectedLivro && (
          <div className="divInputBuscaIsbn">
            <input
              className="isbnBusca"
              type="text"
              placeholder="ISBN"
              value={isbn}
              onChange={handleInputChange}
              maxLength={14}
              required
            />
          </div>
        )}

        {/* Botão para verificar o livro na API */}
        {!selectedLivro && (
          <button
            type="button"
            className="btnBuscaIsbn"
            onClick={handleGetLivro}
          >
            Verificar
          </button>
        )}

        {/* Exibe os detalhes do livro se ele foi encontrado */}
        {selectedLivro && (
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-4">
                {/* Exibe a imagem do livro, se disponível */}
                {selectedLivro.caminhoImagem ? (
                  <img
                    src={selectedLivro.caminhoImagem}
                    alt={selectedLivro.titulo || selectedLivro.title}
                    style={{ width: "100%" }}
                  />
                ) : selectedLivro.cover_url ? (
                  <img
                    src={selectedLivro.cover_url}
                    alt={selectedLivro.title}
                    style={{ width: "100%" }}
                  />
                ) : (
                  <img
                    src={"/assets/No Image.png"}
                    alt="Sem imagem disponível"
                    style={{ width: "100%" }}
                  />
                )}
              </div>
              <div className="col-md">
                {/* Exibe os dados do livro */}
                <div className="modal-text">
                  <strong>Título:</strong> {selectedLivro.titulo || selectedLivro.title}
                </div>
                <div className="modal-text">
                 <strong>Sinopse:</strong>  {selectedLivro.descricao || selectedLivro.synopsis}
                </div>
                <div className="modal-text">
                 <strong>Autor:</strong> {autores.join(", ") || "Autor não disponível"}
                </div>
                {!isFromBrasilAPI && (
                  <div className="modal-text">
                   <strong>Gênero:</strong>  {generos.join(", ") || "Gênero não disponível"}
                  </div>
                  
                )}
                <div className="modal-text">
                  <strong>Editora:</strong>
                  {" "}
                  {isFromBrasilAPI
                    ? selectedLivro.publisher
                    : selectedLivro?.editoras?.nomeEditora ||
                      "Editora não disponível"}
                </div>
                <div className="modal-text"> <strong>ISBN:</strong> {selectedLivro.isbn}</div>
              </div>
            </div>

            <div className="divBotoes">
              {/* Botão para retornar à busca */}
              <button
                type="button"
                className="btnRetornar"
                onClick={() => {
                  setSelectedLivro(null);
                  setISBN("");
                }}
              >
                Retornar à busca
              </button>

              {/* Botão para voltar à página inicial */}
              <button
                type="button"
                className="btnVoltarInicio"
                onClick={() => {
                  navigate("/");
                }}
              >
                Voltar ao acervo
              </button>

              {/* Botão para cadastrar o livro (apenas se veio da BrasilAPI) */}
              {isFromBrasilAPI && (
                <>
                  <button
                    type="button"
                    className="btnCadastrarLivro"
                    onClick={() =>
                      navigate(`/PreCadastrar`, {
                        state: { livroData: selectedLivro, isbn },
                      })
                    }
                  >
                    Cadastrar Livro
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Instruções sobre o ISBN, exibidas quando nenhum livro foi selecionado */}
      {!selectedLivro && (
        <div className="forminstrucaoisbn">
          <p>
            O ISBN (International Standard Book Number) é um código numérico que
            identifica livros, e pode ser encontrado em: Verso da página de
            rosto, Páginas de direitos autorais, Parte inferior da contracapa,
            Rodapé da capa protetora, Código de barras
          </p>

          <img
            className="isbn_instrucao"
            src="/assets/isbn.jpg"
            alt="ISBN"
          />
        </div>
      )}
    </div>
  );
}
