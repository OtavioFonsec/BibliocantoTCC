import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import api from "../../services/api";
import "./CadastroLivro.css";

function CadastroLivro() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [isbn, setIsbn] = useState("");
  const [descricao, setDescricao] = useState("");
  const [linkCompra, setLinkCompra] = useState("");
  const [caminhoImagem, setCaminhoImagem] = useState("");
  const [generos, setGeneros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [editoras, setEditoras] = useState([]);
  const [idEditora, setIdEditora] = useState([]);

  // Acessa os dados passados da pag pre cadastro
  const location = useLocation();
  const livro = location.state?.livroData;
  
  useEffect(() => {
    const autoresCriados = JSON.parse(localStorage.getItem("autoresCriados")) || [];
    setAutores(autoresCriados);
  
    const generosCriados = JSON.parse(localStorage.getItem("generosCriados")) || [];
    setGeneros(generosCriados);
  }, []);
  

  useEffect(() => {
    if (livro) {
      carregarDadosLivro();
      setDescricao(livro.synopsis || "");
      setCaminhoImagem(livro.cover_url || "");
    } else {
      console.error("Nenhum dado foi recebido para carregar o livro.");
    }
  }, [livro]);


  // Função para carregar os dados do livro
  const carregarDadosLivro = async () => {
    try {
      const livroData = await api.getLivroById(livro.id);

      setTitulo(livroData.titulo || "");
      setIsbn(livroData.isbn || "");
      setIdEditora(livroData.editoras?.nomeEditora || "");

      const IdEditora = await RequisicaoEditora(
        livroData.editoras?.nomeEditora
      );
      if (IdEditora) {
        setIdEditora(IdEditora);
      }
    } catch (error) {
      console.error("Erro ao carregar o livro:", error);
    }
  };

  // Função para buscar o ID da editora pelo nome
  const RequisicaoEditora = async (editoraNome) => {
    try {
      const editoraData = await api.getEditoraByName(editoraNome);

      if (editoraData && editoraData.length > 0) {
        const editora = editoraData[0];
        if (editora.id) {
          return editora.id;
        } else {
          console.error("Editora não encontrada ou ID não disponível");
          return null;
        }
      } else {
        console.error("Editora não encontrada ou ID não disponível");
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar o ID da editora:", error);
      return null;
    }
  };

  const atualizarLivro = async () => {
    try {
      if (!livro?.id) {
        console.error("ID do livro não encontrado.");
        return;
      }

      const livroData = {
        titulo,
        descricao,
        isbn,
        linkCompra,
        caminhoImagem,
        editoraId: idEditora,
      };

      const updatedBook = await api.putLivro(livro.id, livroData);
    } catch (error) {
      console.error("Erro ao atualizar o livro:", error);
    }
  };

  const cadastrarAutoresLivro = async () => {
    try {
      const idLivro = livro.id; // Use o ID do livro recebido pelo estado

      if (Array.isArray(autores) && autores.length > 0) {

        for (const autor of autores) {
          await api.cadastrarLivroAutor(idLivro, autor.id); // Usando o ID do autor
        }
      } else {
        alert("Nenhum autor selecionado para associar ao livro.");
      }
    } catch (error) {
      console.error(
        "Erro ao associar autores ao livro:",
        error.response ? error.response.data : error.message
      );
      alert("Ocorreu um erro ao associar os autores ao livro.");
    }
  };

  const cadastrarGenerosLivro = async () => {
    try {
      const idLivro = livro.id; // Use o ID do livro recebido pelo estado

      if (Array.isArray(generos) && generos.length > 0) {
        for (const genero of generos) {
          await api.cadastrarLivroGenero(idLivro, genero.id); // Usando o ID do gênero
        }
      } else {
        alert("Nenhum genero selecionado para associar ao livro.");
      }
    } catch (error) {
      console.error(
        "Erro ao associar genero aos livro:",
        error.response ? error.response.data : error.message
      );
      alert("Ocorreu um erro ao associar o generos ao livro.");
    }
  };

  const handleClick = async (event) => {
    event.preventDefault();

    // Verificação de campos obrigatórios
  if (
    !titulo.trim() ||
    !isbn.trim() ||
    !descricao.trim() ||
    !caminhoImagem.trim() ||
    !idEditora ||
    !Array.isArray(autores) || autores.length === 0 ||
    !Array.isArray(generos) || generos.length === 0
  ) {
    alert("Por favor, preencha todos os campos obrigatórios antes de finalizar o cadastro.");
    return; // Impede o envio
  }

    await atualizarLivro();
    await cadastrarAutoresLivro();
    await cadastrarGenerosLivro();
    
    navigate(`/`);
  };

  return (
    <div className="PagFinalizarCad">
      <div>
        <h2 className="TituloFinalizarCad">Finalizar Cadastro</h2>
      </div>
    <Form className="formFinalizarCad">
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridISBN">
          <Form.Label>ISBN</Form.Label>
          <Form.Control
            type="text"
            value={isbn}
            placeholder="Enter ISBN"
            readOnly
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={titulo} // Usando o estado
            placeholder="Enter Title"
            readOnly
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="formGridSinopse">
        <Form.Label>Sinopse</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          className="sinopse-textarea"
          value={descricao} // Usando o estado descricao
          required
          placeholder="Enter Sinopse"
          onChange={(e) => setDescricao(e.target.value)} // Atualiza o estado descricao
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGridLinkCompra">
        <Form.Label>Link de Compra</Form.Label>
        <Form.Control
          type="text"
          value={linkCompra}
          placeholder="Enter Link de Compra"
          onChange={(e) => setLinkCompra(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGridCoverUrl">
        <Form.Label>Imagem</Form.Label>
        <Form.Control
          type="text"
          value={caminhoImagem}
          placeholder="Enter cover url"
          required
          onChange={(e) => setCaminhoImagem(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGridPublisher">
        <Form.Label>Publisher</Form.Label>
        <Form.Control
          type="text"
          defaultValue={livro.publisher}
          placeholder="Enter Publisher"
          readOnly
        />
      </Form.Group>

      <Row className="mb-3">
      <Form.Group as={Col} controlId="formGridAuthors">
        <Form.Label>Authors</Form.Label>
        {autores.map((author, index) => (
          <Form.Control
            key={`author-${index}`}
            type="text"
            defaultValue={author.nomeAutor}
            placeholder={`Author ${index + 1}`}
            className="mb-2"
            readOnly
          />
        ))}
      </Form.Group>

      <Form.Group as={Col} controlId="formGridSubjects">
        <Form.Label>Subjects</Form.Label>
        {generos.map((subject, index) => (
          <Form.Control
            key={`subject-${index}`}
            type="text"
            defaultValue={subject.nomegenero}
            placeholder={`Subject ${index + 1}`}
            className="mb-2"
            readOnly
          />
        ))}
      </Form.Group>
    </Row>

      <Button 
      variant="primary" 
      type="submit" 
      onClick={handleClick}
      className="btn-cadastrar-livro"
      >
        Finalizar Cadastro
      </Button>
    </Form>
    </div>
  );
}

export default CadastroLivro;