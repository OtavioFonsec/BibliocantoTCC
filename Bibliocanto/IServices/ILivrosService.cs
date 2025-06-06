using Bibliocanto.Communication;
using Bibliocanto.Models;

namespace Bibliocanto.IServices
{
    public interface ILivrosService
    {
        Task<IEnumerable<Livros>> GetBaseLivros();
        Task<Livros> GetLivroMaisLido();
        Task<IEnumerable<Livros>> GetLivrosByIdEditora(int id);
        Task<IEnumerable<Livros>> GetLivrosByIdUser(string idUser);
        Task<Livros> GetLivroById(int id);
        Task<Livros> GetLivroByIsbn(string isbn);
        Task<IEnumerable<Livros>> GetLivroByNome(string nome);
        Task<LivrosResponse> AddLivro(Livros livro);
        Task<LivrosResponse> UpdateLivro(int id, Livros livro);
        Task<LivrosResponse> Delete(int id);
    }
}