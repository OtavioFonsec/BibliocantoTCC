import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:44331'
    //baseURL: 'https://bibliocantobackend-ejdcdghpamcydde8.brazilsouth-01.azurewebsites.net'
});

api.validarToken = async () => {
    return await api.get("/auth/validar-token", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  };

// Método para obter o token
const getToken = () => localStorage.getItem('token');

// Método GET para buscar livro por ISBN
api.buscarLivroPorISBN = async function(isbn) {
    try {
        const response = await api.get(`/api/Livros/GetLivroByIsbn?isbn=${isbn}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response; // Retorna o objeto completo, incluindo status e data
    } catch (error) {
        console.error("Erro ao buscar o livro:", error);
        throw error;
    }
};

// Função para cadastrar um único autor
api.cadastrarAutor = async (autor) => {
    try {
      const response = await api.post(
        "/api/Autores",
        autor,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json"
          }
        }
      );
      return response.data; // Retorna o autor cadastrado com o ID
    } catch (error) {
      console.error("Erro ao cadastrar autor:", error);  // Log de erro, se houver
      throw error;
    }
};
  
// Função para normalizar o nome (para autores e gêneros)
function normalizarNome(nome) {
    if (!nome) return ""; // Retorna uma string vazia se o nome for undefined ou null
    return nome
      .normalize("NFD") // Separa os acentos das letras
      .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
      .toLowerCase(); // Converte para minúsculas
  }
  
  // Função para buscar autor existente com verificação robusta e token de autenticação
api.buscarAutorPorNomeAjustado = async (nomeAutor) => {
  try {
    const response = await api.get("/api/Autores", {
      headers: {
        Authorization: `Bearer ${getToken()}` // Inclui o token de autorização
      }
    });
    const autores = response.data;
    const nomeNormalizado = normalizarNome(nomeAutor);

    // Verifica se já existe um autor com o nome normalizado
    const autorExistente = autores.find(autor => 
      normalizarNome(autor.nomeAutor) === nomeNormalizado
    );

    return autorExistente || null; // Retorna o autor encontrado ou null
  } catch (error) {
    console.error("Erro ao buscar autor:", error);
    throw error;
  }
};
  
// Função para cadastrar múltiplos autores armazenados com verificação de duplicidade
api.cadastrarAutores = async function(autoresArmazenados) {
    try {
  
      const autorIds = await Promise.all(autoresArmazenados.map(async (autor) => {
  
        const autorExistente = await api.buscarAutorPorNomeAjustado(autor.nome);
        if (autorExistente) {
          return autorExistente.id;  // Retorna o ID do autor existente
        } else {
          const novoAutor = await api.cadastrarAutor({ nomeAutor: autor.nome });
          return novoAutor.id;  // Retorna o ID do novo autor
        }
      }));

      return autorIds;
  
    } catch (error) {
      console.error('Erro ao cadastrar autores:', error);  // Log para capturar erros
      throw error;
    }
  };  

  // cadastrar na tabela LivroAutor
  api.cadastrarLivroAutor = async function (idLivro, autorIdSingle) {
    try {
        const autorLivroData = {
            idLivro: Number(idLivro),
            idAutor: Number(autorIdSingle),
        };

        const response = await axios.post('https://localhost:44331/api/AutorLivro', autorLivroData, {
            headers: {
                Authorization: `Bearer ${getToken()}` // Inclui o token de autorização
            }
        });
        return response.data.id; // Retorna o ID da associação, se necessário
    } catch (error) {
        console.error('Erro ao cadastrar Livro / Autor:', error);
        throw error; // Relança o erro para ser tratado em outro lugar, se necessário
    }
};

// cadastrar na tabela LivroGenero
api.cadastrarLivroGenero = async function (idLivro, generoIdSingle) {
    try {
        const generoLivroData = {
            idLivro: Number(idLivro),
            idGenero: Number(generoIdSingle),
        };

        const response = await axios.post('https://localhost:44331/api/GenerosLivro', generoLivroData, {
            headers: {
                Authorization: `Bearer ${getToken()}` // Inclui o token de autorização
            }
        });

        return response.data.id; // Retorna o ID da associação, se necessário
    } catch (error) {
        console.error('Erro ao associar Livro / Genero:', error);
        throw error; // Relança o erro para ser tratado em outro lugar, se necessário
    }
};


api.cadastrarEditora = async function (nomeEditora) {
    try {
        let editoraExistente;

        // Tenta verificar se a editora já existe
        try {
            const verificaExistenciaResponse = await axios.get(`https://localhost:44331/api/Editoras/EditoraByName?name=${nomeEditora}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            // Filtra as editoras retornadas para encontrar uma correspondência exata
            editoraExistente = verificaExistenciaResponse.data.find(
                editora => editora.nomeEditora.toLowerCase() === nomeEditora.toLowerCase()
            );

        } catch (error) {
            if (error.response && error.response.status === 404) {
            } else {
                console.error('Erro ao verificar editora:', error);
                throw error;
            }
        }

        // Se a editora já existe, retorna o ID
        if (editoraExistente) {
            return editoraExistente.id;
        }

        // Caso contrário, cadastra uma nova editora
        const response = await axios.post(
            'https://localhost:44331/api/Editoras',
            { nomeEditora },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
        );
        return response.data.id;

    } catch (error) {
        console.error('Erro ao verificar ou cadastrar editora:', error);
        throw error;
    }
};


api.PreCadastroLivro = async function (titulo, isbn, editoraId) {
    try {

        const response = await axios.post('https://localhost:44331/api/Livros', 
            {
                titulo: titulo,
                isbn: isbn,
                editoraId: editoraId
            },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
        );
        return response.data.id;
    } catch (error) {
        console.error('Erro ao pré-cadastrar livro:', error);
        throw error; 
    }
};

//metodo get para buscar os autores do livro
api.buscarAutoresPorLivro = async function(idLivro) {
    try {
        const response = await api.get(`https://localhost:44331/api/AutorLivro/livro/${idLivro}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data; // Retorna os IDs dos autores para esse livro
    } catch (error) {
        console.error("Erro ao buscar autores do livro:", error);
        throw error;
    }
};

//metodo get para buscar os autores do livro pelo idAutor
api.buscarLivrosPorAutor = async function(idAutor) {
    try {
        const response = await api.get(`https://localhost:44331/api/AutorLivro/autor/${idAutor}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar os livros do autor:", error);
        throw error;
    }
};

//metodo get para buscar o autor por id
api.buscarAutorPorId = async function(idAutor) {
    try {
        const response = await api.get(`/api/Autores/${idAutor}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data; // Retorna os detalhes do autor (nomeAutor)
    } catch (error) {
        console.error("Erro ao buscar autor:", error);
        throw error;
    }
};

//metodo get para buscar o genero por id do livro
api.buscarGenerosPorLivro = async function(idLivro) {
    try {
        const response = await api.get(`/api/GenerosLivro/livro/${idLivro}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data; // Retorna os IDs dos gêneros para esse livro
    } catch (error) {
        console.error("Erro ao buscar gêneros do livro:", error);
        throw error;
    }
};


//metodo get para buscar o genero por id
api.buscarGeneroPorId = async function(idGenero) {
    try {
        const response = await api.get(`/api/Generos/${idGenero}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data; // Retorna os detalhes do gênero (nomegenero)
    } catch (error) {
        console.error("Erro ao buscar gênero:", error);
        throw error;
    }
};

// Método GET para buscar ID da editora pelo nome
api.getEditoraByName = async function(nameEditora) {
    try {
        const response = await api.get(`/api/Editoras/EditoraByName?name=${nameEditora}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        if (response && response.data) {
            return response.data; // Presumindo que a resposta retorna o ID da editora
        } else {
            console.error("No data in response");
        }
    } catch (error) {
        console.error("Erro ao buscar a editora:", error);
        throw error;
    }
};

// Métodos GET para detalhes do livro pelo nome
api.getLivroByNomeLivro = async function(NomeLivro) {
    try {
        const response = await api.get(`/api/Livros/LivroByName?nome=${NomeLivro}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        if (response && response.data) {
            return response.data;
        } else {
            console.error("No data in response");
        }
    } catch (error) {
        console.error("Erro ao buscar o livro:", error);
        throw error;
    }
};

// Métodos GET para detalhes do livro
api.getLivroById = async function(id) {
    try {
        const response = await api.get(`/api/Livros/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        if (response && response.data) {
            return response.data;
        } else {
            console.error("No data in response");
        }
    } catch (error) {
        console.error("Erro ao buscar o livro:", error);
        throw error;
    }
};

api.getLivros = async function(setLivros) {
    try {
        const response = await api.get('/api/Livros', {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        if (response && response.data) {
            setLivros(response.data);
        } else {
            console.error("No data in response");
        }
    } catch (error) {
        console.error("Erro ao buscar os livros:", error);
    }
};

api.getEditoras = async function() {
    try {
        const response = await api.get('/api/Editoras', {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        if (response && response.data) {
            return response.data;
        } else {
            console.error("No data in response");
        }
    } catch (error) {
        console.error("Erro ao buscar as editoras:", error);
        throw error;
    }
};

api.getEditoraById = async function (editoraId) {
    try {
        const response = await api.get(
            `https://localhost:44331/api/Editoras/${editoraId}`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar a editora:", error);
        throw error;
    }
};

api.getLivrosByIdEditora = async function (EditoraId) {
    try {
        const response = await api.get(
            `https://localhost:44331/api/Livros/ByIdEditora?id=${EditoraId}`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar os livros do gênero:", error);
        throw error;
    }
};

api.getGeneros = async function() {
    try {
        const response = await api.get('/api/Generos', {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        if (response && response.data) {
            return response.data;
        } else {
            console.error("No data in response");
        }
    } catch (error) {
        console.error("Erro ao buscar os generos:", error);
        throw error;
    }
};

api.getTodosLivrosByGenero = async function (generoId) {
    try {
        const response = await api.get(
            `https://localhost:44331/api/GenerosLivro/genero/${generoId}`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar os livros do gênero:", error);
        throw error;
    }
};


// API para o email do usuario pelo id
api.EmailUserByID = async function(idUser) {
    try {
        const response = await api.get(`/api/Account/IdUserById?idUser=${idUser}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar o usuario:", error);
        throw error;
    }
};

api.cadastrarLivro = async function(livroData) {
    try {
        const response = await api.post('/api/Livros', livroData, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar o livro:", error);
        throw error;
    }
};

// Métodos PUT
// Função para atualizar livro
api.putLivro = async function(id, livroData) {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    };
    try {
      const response = await api.put(`/api/Livros/${id}`, livroData, config);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar o livro:", error);
      throw error;
    }
  };  

export default api;

//metodos resenha

//Metodo Post Resenha
api.cadastrarResenha = async function(resenhaData) {
    try {
        const response = await api.post('/api/Resenha', resenhaData, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao enviar a resenha:", error);
        throw error;
    }
};

// API para atualizar a resenha
api.putResenha = async function(idResenha, AtualizacaoResenhaData) {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    };
    try {
      const response = await api.put(`/api/Resenha/${idResenha}`, AtualizacaoResenhaData, config);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar a resenha:", error);
      throw error;
    }
  };  

// Métodos GET para resenhas pelo id do livro
api.getResenhaByIdLivro = async function(id) {
    try {
        const response = await api.get(`/api/Resenha/ResenhaByLivro?idLivro=${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        if (response && response.data) {
            return response.data;
        } else {
            console.error("No data in response");
        }
    } catch (error) {
        console.error("Erro ao buscar o livro:", error);
        throw error;
    }
};

// Método delete excluir resenha
api.DeleteResenha = async function (idResenha) {
    try {
        // Primeira confirmação antes de iniciar qualquer processo
        const confirmarInicial = window.confirm("Você tem certeza que deseja excluir esta resenha?");
        if (!confirmarInicial) {
            return; // Interrompe se o usuário cancelar
        }
        
        // Verifica se há comentários para a resenha
        let comentarios = [];
        try {
            comentarios = await api.ComentarioByResenha(idResenha);
        } catch (error) {
            if (error.response && error.response.status === 404) {
            } else {
                console.error("Erro ao buscar comentários:", error);
                throw error;
            }
        }

        // Segunda confirmação: Se houver comentários, perguntar novamente ao usuário
        if (comentarios && comentarios.length > 0) {
            const confirmarComentarios = window.confirm(
                `Esta resenha possui ${comentarios.length} comentário(s). Isso também excluirá os comentários e seus likes. Deseja continuar?`
            );

            if (!confirmarComentarios) {
                return; // Interrompe se o usuário cancelar
            }

            // Exclui os próprios comentários (os likes são tratados dentro da DeleteComentario)
            for (let comentario of comentarios) {
                await api.DeleteComentario(comentario.id);
            }
        }

        // Verifica se há likes para a resenha
        const likesResenha = await api.LikeResenhaByResenha(idResenha);

        if (likesResenha && likesResenha.length > 0) {
            for (let likeResenha of likesResenha) {
                await api.DeleteLikeResenha(likeResenha.id);
            }
        }

        // Prossegue com a exclusão da resenha
        const response = await api.delete(`/api/Resenha/${idResenha}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir a resenha:", error);
        throw error;
    }
};

//metodos like resenha

// Método post para dar like na resenha
api.cadastrarLikeResenha = async function(likeDataResenha) {
    try {
        const response = await api.post('/api/LikeResenha', likeDataResenha, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao enviar o like para a resenha:", error);
        throw error;
    }
};

// Método get para buscar like do usuario na resenha especifica
api.LikeResenhaByUserResenha = async function(idUser, idResenha) {
    try {
        const response = await api.get(`/api/LikeResenha/LikeByUserResenha?idUser=${idUser}&idResenha=${idResenha}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar o like do usuario na resenha:", error);
        throw error;
    }
};

// Método get para buscar likes da resenha especifica
api.LikeResenhaByResenha = async function (idResenha) {
    try {
        const response = await api.get(`/api/LikeResenha/LikeByResenha?idResenha=${idResenha}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return []; // Suppresses error logs
        }
        return [];
    }
};


// Método delete excluir like do usuario na resenha
api.DeleteLikeResenha = async function(idLikeResenha) {
    try {
        const response = await api.delete(`/api/LikeResenha/${idLikeResenha}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir o like para a resenha:", error);
        throw error;
    }
};

//metodos comentario

// API para buscar comentários em uma resenha
api.ComentarioByResenha = async function(idResenha) {
    const response = await api.get(`/api/Comentario/ComentarioByResenha?idResenha=${idResenha}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    if (!response || !response.data) {
        console.warn("Nenhum comentário encontrado.");
        return;
    }

    return response.data;
};

// API para atualizar o comentario
api.putComentario = async function(idComentario, AtualizacaoComentarioData) {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    };
    try {
      const response = await api.put(`/api/Comentario/${idComentario}`, AtualizacaoComentarioData, config);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar o comentario:", error);
      throw error;
    }
  };  

// API para submeter um comentário em uma resenha
api.CadastrarComentario = async function(ComentarioData) {
    try {
        const response = await api.post('/api/Comentario', ComentarioData, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar o comentário:", error);
        throw error;
    }
};

// API para excluir um comentário de uma resenha
api.DeleteComentario = async function(idComentario) {
    try {
        // Verifica se há likes no comentário
        const likes = await api.LikeComentarioByComentario(idComentario);
        // Se houver likes, exclui cada um deles
        if (likes && likes.length > 0) {
            for (let like of likes) {
                await api.DeleteLikeComentario(like.id);
            }
        }

        // Agora exclui o comentário
        const response = await api.delete(`/api/Comentario/${idComentario}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;

    } catch (error) {
        console.error("Erro ao excluir o comentário:", error);
        throw error;
    }
};

// API dos meus livros / biblioteca

// API para buscar os livros da biblioteca do usuario
api.BibliotecaByUser = async function (idUser) {
    try {
      const response = await api.get(`/api/MeusLivros/BibliotecaByUser?idUser=${idUser}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar os livros do usuário:", error);
      throw error;
    }
  };

  // Método delete para excluir livro da minha biblioteca
api.DeleteMeuLivro = async function(idBiblioteca) {
    try {
        const response = await api.delete(`/api/MeusLivros/${idBiblioteca}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir o Livro na biblioteca:", error);
        throw error;
    }
};

  // API para buscar o id do livro na biblioteca do usuario
api.GetMeuLivroByIdLivroIdUser = async function (idUser, idLivro) {
    try {
      const response = await api.get(`/api/MeusLivros/GetMeuLivroByIdLivroIdUser?idUser=${idUser}&idLivro=${idLivro}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar o registro do livro na biblioteca:", error);
      throw error;
    }
  };

  // API para checar se o livro esta na biblioteca do usuario
api.ConfirmaByUserLivro = async function (idUser, idLivro) {
    try {
      const response = await api.get(`/api/MeusLivros/ConfirmaByUserLivro?idLivro=${idLivro}&idUser=${idUser}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao checar se o livro esta na biblioteca do usario:", error);
      throw error;
    }
  };

  // API para atualizar o livro com as tags (lido)
  api.putMeusLivrosLidos = async function(RegistroLivroNaBiblioteca, MeusLivrosLidoData) {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    };
    try {
      const response = await api.put(`/api/MeusLivros/lido/${RegistroLivroNaBiblioteca}`, MeusLivrosLidoData, config);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar o livro da biblioteca:", error);
      throw error;
    }
  };  

  // API para atualizar o livro com as tags (relido)
  api.putMeusLivrosRelidos = async function(RegistroLivroNaBiblioteca, MeusLivrosRelidoData) {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    };
    try {
      const response = await api.put(`/api/MeusLivros/relido/${RegistroLivroNaBiblioteca}`, MeusLivrosRelidoData, config);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar o livro da biblioteca:", error);
      throw error;
    }
  }; 

// RequestsLike Comentario

// API para dar like no comentario
api.cadastrarLikeComentario = async function(likeDataComentario) {
    try {
        const response = await api.post('/api/LikeComentario', likeDataComentario, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao enviar o like para o comentario:", error);
        throw error;
    }
};

// Método get para buscar like do usuario no comentario especifico
api.LikeComentarioByUserComentario = async function(idUser, idComentario) {
    try {
        const response = await api.get(`/api/LikeComentario/LikeByUserComentario?idUser=${idUser}&idComentario=${idComentario}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar o like do usuario no Comentario:", error);
        throw error;
    }
};

// Método delete excluir like do usuario no comentario
api.DeleteLikeComentario = async function(idLikeComentario) {
    try {
        const response = await api.delete(`/api/LikeComentario/${idLikeComentario}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir o like para o comentario:", error);
        throw error;
    }
};

// Método get para buscar likes do comentario especifico
api.LikeComentarioByComentario = async function (idComentario) {
    try {
        const response = await api.get(`/api/LikeComentario/LikeByComentario?idComentario=${idComentario}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return []; // Suppresses error logs
        }
        return [];
    }
};

// Método post para avaliacao em estrelas do livro
api.AvaliarLivro = async function (DataAvaliacaoLivro) {
    try {
        const response = await api.post(`/api/Avaliacao/`, DataAvaliacaoLivro, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return []; // Suppresses error logs
        }
        return [];
    }
};

// Método get para buscar as avaliacoes do livro
api.AvaliacaoByLivro = async function (idLivro) {
    try {
        const response = await api.get(`/api/Avaliacao/AvaliacaoByLivro?idLivro=${idLivro}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return []; // Suppresses error logs
        }
        return [];
    }
};

// Método get para buscar as avaliacoes do usuario do livro
api.AvaliacaoByUserLivro = async function (idLivro, idUser) {
    try {
        const response = await api.get(`/api/Avaliacao/AvaliacaoByUserLivro?idLivro=${idLivro}&idUser=${idUser}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return []; // Suppresses error logs
        }
        return [];
    }
};

// Método get para atualizar as avaliacoes dos usuario
api.PutAvaliacao = async function(idAvaliacao, AvaliacaoData) {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    };
    try {
      const response = await api.put(`/api/Avaliacao/${idAvaliacao}`, AvaliacaoData, config);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar a avaliacao:", error);
      throw error;
    }
  };  



//perfil

// Método GET para buscar o perfil do usuario pelo id
api.GetPerfilByIdUser = async function(idUser) {
    try {
        const response = await api.get(`/api/Perfil/GetByUser?idUser=${idUser}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response;
    } catch (error) {
        console.error("Erro ao buscar o perfil:", error);
        throw error;
    }
};

// Função para cadastrar o perfil do usuario
api.cadastrarPerfilUsuario = async (perfil) => {
    try {
      const response = await api.post(
        "/api/Perfil",
        perfil,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json"
          }
        }
      );
      return response.data; 
    } catch (error) {
      console.error("Erro ao cadastrar o perfil:", error);
      throw error;
    }
};

// Função para atualizar o perfil do usuario
api.putPerfilUsuario = async function(id, PerfilData) {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    };
    try {
      const response = await api.put(`/api/Perfil?id=${id}`, PerfilData, config);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar o perfil do usuario:", error);
      throw error;
    }
  };  

//preferencias

// Método GET para buscar as preferencias do usuario pelo idUsuario
api.GetPreferenciaByIdUser = async function(idUser) {
    try {
        const response = await api.get(`/api/Preferencias/PreferenciaByUser?idUser=${idUser}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response;
    } catch (error) {
        console.error("Erro ao buscar a preferencia:", error);
        throw error;
    }
};

// Função para cadastrar a preferencia do usuario
api.cadastrarPreferenciaUsuario = async (preferencia) => {
    try {
      const response = await api.post(
        "/api/Preferencias",
        preferencia,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json"
          }
        }
      );
      return response.data; 
    } catch (error) {
      console.error("Erro ao cadastrar a preferencia:", error);
      throw error;
    }
};

// Método delete para excluir a preferencia do usuario
api.DeletePreferenciaUsuario = async function(idPreferencia) {
    try {
        const response = await api.delete(`/api/Preferencias/${idPreferencia}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir a preferencia do usuario:", error);
        throw error;
    }
};