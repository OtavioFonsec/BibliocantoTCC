using Bibliocanto.Models;

namespace Bibliocanto.IRepository
{
    public interface ILivrosRepository
    {
        Task<IEnumerable<Livros>> GetBaseLivros();
        Task<Livros> GetLivroMaisLido();
        Task<IEnumerable<Livros>> GetLivrosByNome(string nome);
        Task<IEnumerable<Livros>> GetLivrosByIdEditora(int id);
        Task<IEnumerable<Livros>> GetLivrosByIdUser(string idUser);
        Task<Livros> GetLivroById(int id);
        Task<Livros> GetLivroByIsbn(string isbn);
        Task AddLivro(Livros livro);
        void UpdateLivro(Livros livro);
        void Delete(Livros livro);
    }
}
