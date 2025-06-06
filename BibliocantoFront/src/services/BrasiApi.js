import axios from 'axios';

// Configuração da BrasilAPI para buscar informações usando ISBN
const BrasilAPi = axios.create({
    baseURL: "https://brasilapi.com.br/api", // Base URL da BrasilAPI
  });
  
  // Função personalizada para buscar dados da BrasilAPI com base no ISBN
  BrasilAPi.isbn = {
    getBy: async (isbn) => {
      try {
        // Faz a chamada à BrasilAPI e retorna os dados
        const response = await BrasilAPi.get(`/isbn/v1/${isbn}`);
        return response.data;
      } catch (error) {
        // Trata e exibe erros, se ocorrerem
        console.error(
          "Erro ao chamar a BrasilAPI:",
          error.response ? error.response.data : error.message
        );
        throw error;
      }
    },
  };

  export default BrasilAPi;