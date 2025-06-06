import "./EditLivroStyle.css";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditarLivro() {

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isbn, setIsbn] = useState("");
  const [caminhoImagem, setCaminhoImagem] = useState("");
  const [autorId, setAutorId] = useState("");
  const [generoId, setGeneroId] = useState("");
  const [editoraId, setEditoraId] = useState("");

  const [livroEditando, setLivroEditando] = useState(null);

  const [generos, setGeneros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [editoras, setEditoras] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    api.getGeneros(setGeneros);
    api.getAutores(setAutores);
    api.getEditoras(setEditoras);
    
    if (id) {
      api.getLivroById(id).then(livro => {
        setLivroEditando(livro);
        setTitulo(livro.titulo || "");
        setDescricao(livro.descricao || "");
        setIsbn(livro.isbn || "");
        setCaminhoImagem(livro.caminhoImagem || "");
        setAutorId(livro.autores?.id?.toString() || "");
        setGeneroId(livro.generos?.id?.toString() || "");
        setEditoraId(livro.editoras?.id?.toString() || "");
      }).catch(error => console.error("Erro ao carregar o livro:", error));
    }
  }, [id]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const livroAtualizado = {
      titulo,
      descricao,
      isbn,
      caminhoImagem,
      autorId: parseInt(autorId),
      generoId: parseInt(generoId),
      editoraId: parseInt(editoraId),
    };

    try {
        if (livroEditando) {
            await api.putLivro(livroEditando.id, livroAtualizado);
            console.log("Livro atualizado com sucesso!");
        }
        resetForm();
    } catch (error) {
        console.error("Erro ao atualizar o livro:", error);
    }
  };

  const resetForm = () => {
    setTitulo("");
    setDescricao("");
    setIsbn("");
    setCaminhoImagem("");
    setAutorId("");
    setGeneroId("");
    setEditoraId("");
    setLivroEditando(null);
    navigate("/"); // Redireciona para a página inicial
  };

  return (
    <div className="Container">
      <br />
      <h2>Editar Livro</h2>
      <br />
      <div className="jumbotron jumbotron-custom">
        <form onSubmit={handleSaveChanges}>
          <div className="row">
            <div className="col-4">
              <label>Título</label>
              <input
                type="text"
                className="form-control"
                placeholder="Título do livro"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div className="col-4">
              <label>Descrição</label>
              <input
                type="text"
                className="form-control"
                placeholder="Descrição do livro"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>
            <div className="col-4">
              <label>ISBN</label>
              <input
                type="text"
                className="form-control"
                placeholder="ISBN do livro"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                required
              />
            </div>
            <div className="col-4">
              <label>Autor</label>
              <select
                className="form-control"
                value={autorId}
                onChange={(e) => setAutorId(e.target.value)}
                required
              >
                <option value="">Selecione um autor</option>
                {autores.map((autor) => (
                  <option key={autor.id} value={autor.id}>
                    {autor.nomeAutor}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-4">
              <label>Gênero</label>
              <select
                className="form-control"
                value={generoId}
                onChange={(e) => setGeneroId(e.target.value)}
                required
              >
                <option value="">Selecione um gênero</option>
                {generos.map((genero) => (
                  <option key={genero.id} value={genero.id}>
                    {genero.nomegenero}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-4">
              <label>Editora</label>
              <select
                className="form-control"
                value={editoraId}
                onChange={(e) => setEditoraId(e.target.value)}
                required
              >
                <option value="">Selecione uma editora</option>
                {editoras.map((editora) => (
                  <option key={editora.id} value={editora.id}>
                    {editora.nomeEditora}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-4">
              <label>Link da Capa</label>
              <input
                type="text"
                className="form-control"
                placeholder="Link da Capa do livro"
                value={caminhoImagem}
                onChange={(e) => setCaminhoImagem(e.target.value)}
              />
            </div>
          </div>
          <br />
          <button type="submit" className="btn btn-success btn-lg btn-block">
            Salvar Alterações
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-lg btn-block"
            onClick={resetForm} // Adiciona a navegação ao cancelar
          >
            Cancelar Edição
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditarLivro;
