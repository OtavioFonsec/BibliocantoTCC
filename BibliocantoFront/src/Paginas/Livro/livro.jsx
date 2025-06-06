import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import "./livro.css";
import ResenhaItem from "../../Componentes/Resenha/ResenhaItem";
import { Box, Rating } from "@mui/material";

import Recomendacao from "../../Componentes/RecomendacaoLivro/recomendacao";

function Livro() {
  const [EmailUser, setEmailUser] = useState(
    localStorage.getItem("email") || null
  );

  const { id: idLivro } = useParams();
  const [livro, setLivro] = useState(null);
  const [idUser, setIdUser] = useState(null);

  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);

  const [comentarios, setComentarios] = useState({});
  const [likesComentarios, setLikesComentarios] = useState({});

  const [estaNaBiblioteca, setEstaNaBiblioteca] = useState(null);
  const [RegistroLivroNaBiblioteca, setRegistroLivroNaBiblioteca] = useState(
    []
  );

  const [mediaEstrelas, setMediaEstrelas] = useState(null);
  const [totalAvaliacoes, setTotalAvaliacoes] = useState(0);
  const [atualizarAvaliacoes, setAtualizarAvaliacoes] = useState(false);
  const [avaliacaoExistente, setAvaliacaoExistente] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);

  const [idResenha, setResenhaId] = useState(null);
  const [resenha, setResenha] = useState("");
  const [resenhas, setResenhas] = useState([]);
  const [resenhaSelecionada, setResenhaSelecionada] = useState(null);
  const [mostrarEnviarResenha, setMostrarEnviarResenha] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [refreshResenhas, setRefreshResenhas] = useState(false);
  const [UsuarioJaResenhou, setUsuarioJaResenhou] = useState(false);

  const [IdsLivroAutor, setIdsLivroAutor] = useState([]);

  const [Lido, setTagLido] = useState(0);
  const [Relido, setTagRelido] = useState(0);

  //buscar id usuario
  useEffect(() => {
    setIdUser(localStorage.getItem("Id") || "");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca os dados do livro
        const data = await api.getLivroById(idLivro);
        setLivro(data);

        // Busca os autores relacionados ao livro
        const autorLivros = await api.buscarAutoresPorLivro(data.id);
        const autoresIds = autorLivros.map((autor) => autor.idAutor);
        const autoresDetalhados = await Promise.all(
          autorLivros.map(async (autorLivro) => {
            const autor = await api.buscarAutorPorId(autorLivro.idAutor);
            return autor.nomeAutor;
          })
        );
        setAutores(autoresDetalhados);

        // Função para buscar todos os livros do autor do livro em questão
        try {
          // Inicializa um array para armazenar os IDs dos livros dos autores
          const allLivrosIds = [];

          // Itera sobre cada idAutor e faz a requisição para buscar os livros
          for (let autorId of autoresIds) {
            const LivrosDoAutor = await api.buscarLivrosPorAutor(autorId);

            LivrosDoAutor.forEach((livro) => {
              //console.log(`idLivro: ${livro.idLivro}`);
            });
            const idsLivrosDoAutor = LivrosDoAutor.map(
              (livro) => livro.idLivro
            );
            allLivrosIds.push(...idsLivrosDoAutor); // Adiciona os IDs dos livros ao array final
          }

          // Atualiza o estado com todos os IDs de livros
          setIdsLivroAutor(allLivrosIds);
        } catch (error) {
          console.error("Erro ao buscar livros do autor:", error);
        }

        if (IdsLivroAutor.length > 0) {
          Promise.all(IdsLivroAutor.map((id) => api.getLivroById(id)))
            .then((livros) => {
              //console.log("Livros encontrados:", livros);
            })
            .catch((error) => {
              console.error("Erro ao buscar livros:", error);
            });
        }

        // Busca os gêneros relacionados ao livro
        const generoLivros = await api.buscarGenerosPorLivro(data.id);
        const generosDetalhados = await Promise.all(
          generoLivros.map(async (generoLivro) => {
            const genero = await api.buscarGeneroPorId(generoLivro.idGenero);
            return genero.nomegenero;
          })
        );
        setGeneros(generosDetalhados);
      } catch (error) {
        console.error(
          "Erro ao buscar dados do livro:",
          error.response?.data || error.message
        );
      }
    };

    fetchData();
  }, [idLivro]);

  // Verifica se o livro está na biblioteca do usuário, armazena como esta as tags e o id do livro na biblioteca
  useEffect(() => {
    const verificarBiblioteca = async () => {
      if (!idUser || !idLivro) return;

      try {
        const estaNaBiblioteca = await api.ConfirmaByUserLivro(idUser, idLivro);
        setEstaNaBiblioteca(estaNaBiblioteca);

        if (estaNaBiblioteca) {
          const registroLivro = await api.GetMeuLivroByIdLivroIdUser(
            idUser,
            idLivro
          );
          setRegistroLivroNaBiblioteca(registroLivro.id);
          setTagLido(registroLivro.lido === 1);
          setTagRelido(registroLivro.relido === 1);
        }
      } catch (error) {
        console.error("Erro ao verificar livro na biblioteca:", error);
      }
    };

    verificarBiblioteca();
  }, [idUser, idLivro]);

  useEffect(() => {
    const fetchResenhas = async () => {
      if (!idUser || !idLivro) return;

      try {
        const response = await api.getResenhaByIdLivro(idLivro);
        setResenhas(response);

        // Verifica se o usuário já fez uma resenha
        if (response.some((res) => res.idUser === idUser)) {
          setUsuarioJaResenhou(response.some((res) => res.idUser === idUser));
        }

        // Adiciona o email do usuário que escreveu a resenha
        const resenhasComEmail = await Promise.all(
          response.map(async (res) => {
            const usuario = await api.EmailUserByID(res.idUser);
            return { ...res, email: usuario.email };
          })
        );

        setResenhas(resenhasComEmail);
      } catch (error) {
        console.error(
          "Erro ao buscar as resenhas:",
          error.response?.data || error.message
        );
      }
    };

    fetchResenhas();
  }, [idLivro, idUser, refreshResenhas]);

  useEffect(() => {
    const fetchAvaliacao = async () => {
      if (!idLivro || !idUser) return;

      try {
        const avaliacao = await api.AvaliacaoByUserLivro(idLivro, idUser);
        setAvaliacaoExistente(avaliacao);
        setRatingValue(avaliacao?.estrelas ?? 0);
      } catch (error) {
        console.error(
          "Erro ao buscar avaliação:",
          error.response?.data || error.message
        );
      }
    };

    fetchAvaliacao();
  }, [idLivro, idUser]);

  useEffect(() => {
    // Função assíncrona para buscar as avaliações do livro
    const fetchAvaliacoes = async () => {
      try {
        // Faz a requisição para obter as avaliações do livro com o ID `idLivro`
        const avaliacoes = await api.AvaliacaoByLivro(idLivro);

        // Verifica se existem avaliações para o livro
        if (avaliacoes.length > 0) {
          // Se existirem avaliações, soma as estrelas de todas as avaliações
          const somaEstrelas = avaliacoes.reduce(
            (acc, avaliacao) => acc + avaliacao.estrelas, // Soma das estrelas
            0 // Valor inicial da soma (acumulador)
          );

          // Calcula a média das estrelas
          const media = somaEstrelas / avaliacoes.length;

          // Atualiza o estado com a média de estrelas arredondada para uma casa decimal
          setMediaEstrelas(media.toFixed(1));

          // Atualiza o estado com o total de avaliações
          setTotalAvaliacoes(avaliacoes.length);
        } else {
          // Se não houver avaliações, define a média de estrelas e o total de avaliações como 0
          setMediaEstrelas(0);
          setTotalAvaliacoes(0);
        }
      } catch (error) {
        // Em caso de erro, imprime o erro no console e define os valores como 0
        console.error("Erro ao buscar avaliações:", error);
        setMediaEstrelas(0);
        setTotalAvaliacoes(0);
      }
    };

    // Chama a função `fetchAvaliacoes` para buscar as avaliações do livro
    fetchAvaliacoes();
  }, [idLivro, atualizarAvaliacoes]);

  // Função para selecionar uma resenha para comentar
  const handleComentar = (idResenha) => {
    // Alterna a resenha selecionada: se for a mesma, deseleciona, senão seleciona a nova
    setResenhaSelecionada((prev) => (prev === idResenha ? null : idResenha));

    // Garante que exista uma entrada no estado `comentarios` para o idResenha
    setComentarios((prev) => ({
      ...prev,
      [idResenha]: prev[idResenha] || "",
    }));

    // Define o ID da resenha selecionada
    setResenhaId(idResenha);
  };

  // Função para enviar um comentário para a API
  const enviarComentario = async () => {
    // Verifica se há uma resenha selecionada antes de enviar o comentário
    if (!idResenha) {
      alert("Erro: ID da resenha não encontrado.");
      return;
    }

    // Obtém o texto do comentário e remove espaços desnecessários
    const textoComent = comentarios[idResenha]?.trim();

    // Verifica se o comentário não está vazio
    if (!textoComent) {
      alert("O comentário não pode estar vazio.");
      return;
    }

    try {
      // Monta o objeto com os dados do comentário
      const comentarioData = {
        idResenha: idResenha,
        idUser: idUser,
        textoComent: textoComent,
      };

      // Envia o comentário para a API
      await api.CadastrarComentario(comentarioData);

      // Limpa o campo de comentário após o envio
      setComentarios((prev) => ({ ...prev, [idResenha]: "" }));
    } catch (error) {
      console.error(
        "Erro ao enviar comentário:",
        error.response?.data || error
      );
      alert("Erro ao enviar o comentário. Tente novamente.");
    }
  };

  // Função para buscar os comentários de uma resenha específica
  const buscarComentarios = async (idResenha) => {
    try {
      const comentariosBuscados = await api.ComentarioByResenha(idResenha);

      return await Promise.all(
        comentariosBuscados.map(async (comentario) => ({
          ...comentario,
          emailUsuario: (await api.EmailUserByID(comentario.idUser)).email,
        }))
      );
    } catch (error) {
      //console.error("Erro ao buscar comentários:", error);
      return [];
    }
  };

  // Função para curtir ou descurtir um comentário
  const handleLikeComentario = async (idComentario) => {
    try {
      // Verifica se o usuário já curtiu o comentário
      let likeComentarioExistente;
      try {
        likeComentarioExistente = await api.LikeComentarioByUserComentario(
          idUser,
          idComentario
        );
      } catch (error) {
        // Se o erro for 404, significa que o usuário ainda não curtiu
        if (error.response && error.response.status === 404) {
          likeComentarioExistente = null;
        } else {
          console.error("Erro ao verificar o like do comentário:", error);
          return;
        }
      }

      if (likeComentarioExistente) {
        // Se o like já existir, remove o like (descurtir)
        await api.DeleteLikeComentario(likeComentarioExistente.id);
      } else {
        // Se o like não existir, adiciona o like
        const likeDataComentario = {
          idComentario: idComentario,
          idUser: idUser,
          like: 1,
        };

        await api.cadastrarLikeComentario(likeDataComentario);
      }

      // Obtém a nova contagem de likes para o comentário
      const likesAtualizados = await api.LikeComentarioByComentario(
        idComentario
      );

      // Atualiza o estado dos likes apenas para o comentário alterado
      setLikesComentarios((prev) => ({
        ...prev,
        [idComentario]: likesAtualizados.length,
      }));
    } catch (error) {
      console.error("Erro ao processar o like no comentário:", error);
    }
  };

  // Função para enviar uma nova resenha
  const enviarResenha = async () => {
    if (!idUser) {
      setMensagem("Erro: usuário não identificado.");
      return;
    }

    if (!resenha.trim()) {
      setMensagem("A resenha não pode estar vazia.");
      return;
    }

    // Verifica se o usuário já enviou uma resenha
    const resenhaExistente = resenhas.find((res) => res.idUser === idUser);
    if (resenhaExistente) {
      setMensagem("Você já enviou uma resenha para este livro.");
      return;
    }

    try {
      const resenhaData = {
        idLivro: idLivro,
        idUser: idUser,
        textoResenha: resenha,
      };

      // Chamada à função cadastrarResenha da API
      await api.cadastrarResenha(resenhaData);

      setRefreshResenhas((prev) => !prev);

      setMensagem("Resenha enviada com sucesso!");
      setResenha(""); // Limpa o campo de resenha
      setMostrarEnviarResenha(false);
    } catch (error) {
      console.error("Erro ao enviar a resenha:", error.response?.data || error);
      setMensagem("Erro ao enviar a resenha. Tente novamente.");
    }
  };

  const handleLikeResenha = async (idResenha) => {
    try {
      // Verifica se o usuário já curtiu a resenha
      let likeExistente;
      try {
        likeExistente = await api.LikeResenhaByUserResenha(idUser, idResenha);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          likeExistente = null;
        } else {
          console.error("Erro ao verificar o like da resenha:", error);
          return;
        }
      }

      if (likeExistente) {
        // Se o like já existir, exclui o like
        await api.DeleteLikeResenha(likeExistente.id);
      } else {
        // Se o like não existir, adiciona o like
        const likeDataResenha = {
          idResenha,
          idUser,
          like: 1,
        };

        await api.cadastrarLikeResenha(likeDataResenha);
      }
    } catch (error) {
      console.error("Erro ao processar o like na resenha:", error);
    }
  };

  // Função para enviar ou atualizar a avaliação do usuário
  const enviarAvaliacao = async (estrelas) => {
    if (!idUser) {
      alert("É necessário estar logado para avaliar.");
      return;
    }

    try {
      if (estrelas == null || isNaN(estrelas)) {
        console.error("Erro: Número de estrelas inválido!", estrelas);
        alert("Erro ao processar a avaliação. Número de estrelas inválido.");
        return;
      }

      const estrelasNumerico = parseInt(estrelas);

      if (avaliacaoExistente && avaliacaoExistente.id) {
        // Atualiza a avaliação existente (PUT)
        const DataAvaliacaoLivro = {
          idLivro: avaliacaoExistente.idLivro,
          idUser: avaliacaoExistente.idUser,
          estrelas: estrelasNumerico,
        };

        await api.PutAvaliacao(avaliacaoExistente.id, DataAvaliacaoLivro);

        // Atualiza o estado com a nova nota
        setAvaliacaoExistente((prev) => ({
          ...prev,
          estrelas: estrelasNumerico,
        }));
      } else {
        // Cria uma nova avaliação (POST)
        const DataAvaliacaoLivro = {
          idLivro,
          idUser,
          estrelas: estrelasNumerico,
        };

        const novaAvaliacao = await api.AvaliarLivro(DataAvaliacaoLivro);

        if (novaAvaliacao && novaAvaliacao.id) {
          setAvaliacaoExistente({
            id: novaAvaliacao.id,
            idLivro: novaAvaliacao.idLivro,
            idUser: novaAvaliacao.idUser,
            estrelas: novaAvaliacao.estrelas,
          });
        } else {
          // Caso a API não retorne o objeto corretamente
          console.warn("Avaliação enviada, mas resposta inesperada da API.");
          setAvaliacaoExistente({
            idLivro,
            idUser,
            estrelas: estrelasNumerico,
          });
        }
      }

      setRatingValue(estrelasNumerico);
      setAtualizarAvaliacoes((prev) => !prev); // Força atualização da média
    } catch (error) {
      console.error("Erro ao enviar a avaliação:", error);
      alert("Erro ao enviar a avaliação. Tente novamente.");
    }
  };

  const TagLido = async (RegistroLivroNaBiblioteca, idLivro, idUser) => {
    try {
      // Alterna o valor de Lido diretamente no estado
      const novoValorLido = Lido === 1 ? 0 : 1;

      const MeusLivrosLidoData = {
        idLivro,
        idUser,
        Lido: novoValorLido,
      };

      // Atualiza a API
      await api.putMeusLivrosLidos(
        RegistroLivroNaBiblioteca,
        MeusLivrosLidoData
      );

      // Atualiza o estado localmente para refletir a mudança na interface
      setTagLido(novoValorLido);
    } catch (error) {
      console.error("Erro ao marcar livro como lido:", error);
    }
  };

  const TagRelido = async (RegistroLivroNaBiblioteca, idLivro, idUser) => {
    try {
      // Alterna o valor de Relido diretamente no estado
      const novoValorRelido = Relido === 1 ? 0 : 1;

      const MeusLivrosLidoData = {
        idLivro,
        idUser,
        Relido: novoValorRelido,
      };

      // Atualiza a API
      await api.putMeusLivrosRelidos(
        RegistroLivroNaBiblioteca,
        MeusLivrosLidoData
      );

      // Atualiza o estado localmente para refletir a mudança na interface
      setTagRelido(novoValorRelido);
    } catch (error) {
      console.error("Erro ao marcar livro como relido:", error);
    }
  };

  const deleteResenha = async (idResenha) => {
    try {
      // Chamada à API para excluir a resenha
      await api.DeleteResenha(idResenha);

      // Remove a resenha excluída do estado local
      setResenhas((prevResenhas) =>
        prevResenhas.filter((resenha) => resenha.idResenha !== idResenha)
      );
      setRefreshResenhas((prev) => !prev);
      // Mensagem de sucesso
      setMensagem("Resenha excluída com sucesso!");
    } catch (error) {
      console.error(
        "Erro ao excluir a resenha:",
        error.response?.data || error
      );
      setMensagem("Erro ao excluir a resenha. Tente novamente.");
    }
  };

  const handleAddMeuLivro = async (livro) => {
    const idUser = localStorage.getItem("Id");

    const idLivro = livro.id;

    try {
      const data = { idUser, idLivro };
      await api.post("/api/MeusLivros", data);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao adicionar livro:", error);
      alert("Falha ao salvar livro na biblioteca!: " + error.message);
    }
  };

  //funcao para remover o livro da biblioteca do usuario
  const handleDeleteMeuLivro = async (livro) => {

    try {

      // Excluir o livro da biblioteca
      await api.DeleteMeuLivro(RegistroLivroNaBiblioteca);

      window.location.reload();

    } catch (error) {
      console.error("Erro ao excluir o livro da biblioteca:", error);
      alert("Falha ao remover o livro da biblioteca.");
    }
  };

  return (
    <Container>
      {livro && <h1 className="titulo-livro">{livro.titulo}</h1>}
      <Row>
        <Col xs={12} md={3} className="livro-coluna">
          {livro ? (
            <>
              <div>
                <img
                  className="livro-imagem"
                  src={livro.caminhoImagem}
                  alt={livro.titulo}
                />
              </div>

              <div className="div-info">
                <p>ISBN-13: {livro.isbn}</p>

                {livro && livro.editoras ? (
                  <p>Editora: {livro?.editoras?.nomeEditora}</p>
                ) : (
                  <p>Carregando editora...</p>
                )}

                {autores && autores.length > 0 ? (
                  <p>Autor(es): {autores.join(", ")}</p>
                ) : (
                  <p>Carregando autores...</p>
                )}

                {generos && generos.length > 0 ? (
                  <p>Gênero(s): {generos.join(", ")}</p>
                ) : (
                  <p>Carregando gêneros...</p>
                )}
              </div>

              {EmailUser && (
                <div className="opcoes-livro">
                  <div className="avaliacao-livro">
                    {idUser && (
                      <Box mt={2}>
                        <Rating
                          name="user-rating"
                          value={ratingValue}
                          onChange={(event, newValue) => {
                            setRatingValue(newValue);
                            enviarAvaliacao(newValue);
                          }}
                        />
                        {totalAvaliacoes > 0 ? (
                          <p>
                            Média de estrelas: {mediaEstrelas} (
                            {totalAvaliacoes} avaliações)
                          </p>
                        ) : (
                          <p>Ainda não há avaliações para este livro.</p>
                        )}
                      </Box>
                    )}
                  </div>

                  <div className="icone-linkcompra-livro">
                    {livro?.linkCompra && (
                      <button
                        className="livro-btnCompra"
                        onClick={() => window.open(livro.linkCompra, "_blank")}
                      >
                        <FontAwesomeIcon icon={faCartShopping} /> Comprar Livro
                      </button>
                    )}
                  </div>

                  {!UsuarioJaResenhou && (
                    <div className="escrever-resenha-livro">
                      <button
                        variant="contained"
                        onClick={() => setMostrarEnviarResenha(true)}
                      >
                        <i className="bi bi-pencil"></i> Escrever Resenha
                      </button>
                    </div>
                  )}

                  {estaNaBiblioteca ? (
                    <div className="tag-dellivrobiblioteca">
                      <button
                        className="botao-del-LivroBiblioteca"
                        onClick={() => handleDeleteMeuLivro(livro)}
                      >
                        <i className="bi bi-bookmark-x"></i> Remover da
                        Biblioteca
                      </button>
                    </div>
                  ) : (
                    <div className="tag-addlivrobiblioteca">
                      <button
                        className="botao-add-LivroBiblioteca"
                        onClick={() => handleAddMeuLivro(livro)}
                      >
                        <i className="bi bi-bookmark-plus"></i> Adicionar à
                        Biblioteca
                      </button>
                    </div>
                  )}

                  {estaNaBiblioteca && (
                    <>
                      <div className="tag-lido-livro">
                        <button
                          className={`btn-tag-lido-livro ${
                            Lido ? "ativo" : ""
                          }`}
                          onClick={() =>
                            TagLido(RegistroLivroNaBiblioteca, idLivro, idUser)
                          }
                        >
                          <i className={Lido ? "bi bi-bookmark-x" : "bi bi-bookmark-check"}></i> Lido
                        </button>
                      </div>

                      <div className="tag-relido-livro">
                        <button
                          className={`btn-tag-relido-livro ${
                            Relido ? "ativo" : ""
                          }`}
                          onClick={() =>
                            TagRelido(
                              RegistroLivroNaBiblioteca,
                              idLivro,
                              idUser
                            )
                          }
                        >
                          <i className={Relido ? "bi bi-bookmark-x" : "bi bi-bookmark-check"}></i> Relido
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <p>Carregando...</p>
          )}
        </Col>

        <Col xs={12} md={6} className="livro-coluna-texto">
          {livro ? (
            <div>
              <div className="livro-info">
                <p>{livro.descricao}</p>
              </div>

              <div className="resenha-container">
                <h3 className="lista-resenhas-titulo">Resenhas</h3>

                {/* escrever resenha */}
                {mostrarEnviarResenha && (
                  <div className="escrever-resenha">
                    <TextField
                      label="Escreva sua resenha"
                      multiline
                      fullWidth
                      rows={4}
                      variant="outlined"
                      value={resenha}
                      onChange={(e) => setResenha(e.target.value)}
                      style={{ marginTop: "20px" }}
                    />
                    <div className="botoes-container">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={enviarResenha}
                      >
                        Enviar Resenha
                      </Button>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setMostrarEnviarResenha(false)}
                      >
                        Cancelar Resenha
                      </Button>
                    </div>
                    {mensagem && (
                      <p style={{ marginTop: "10px", color: "red" }}>
                        {mensagem}
                      </p>
                    )}
                  </div>
                )}

                {/* listagem das resenhas */}
                {Array.isArray(resenhas) && resenhas.length > 0 ? (
                  <ul className="lista-resenhas">
                    {resenhas.map((res) => {
                      return (
                        <ResenhaItem
                          key={`resenha-${res.id}`}
                          res={res}
                          handleComentar={handleComentar}
                          resenhaSelecionada={resenhaSelecionada}
                          setComentarios={setComentarios}
                          comentarios={comentarios}
                          enviarComentario={enviarComentario}
                          buscarComentarios={buscarComentarios}
                          handleLikeResenha={() => handleLikeResenha(res.id)}
                          handleLikeComentario={handleLikeComentario}
                          likesComentarios={likesComentarios}
                          setLikesComentarios={setLikesComentarios}
                          idUser={idUser}
                          deleteResenha={deleteResenha}
                        />
                      );
                    })}
                  </ul>
                ) : (
                  <p>Ainda não há resenhas para este livro.</p>
                )}
              </div>
            </div>
          ) : (
            <p>Carregando...</p>
          )}
        </Col>

        <Col xs={12} md={3} className="livro-coluna-extra">
          <Recomendacao idLivro={idLivro} />
        </Col>
      </Row>
    </Container>
  );
}
export default Livro;
