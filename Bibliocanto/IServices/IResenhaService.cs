using Bibliocanto.Communication;
using Bibliocanto.Models;

namespace Bibliocanto.IServices
{
    public interface IResenhaService
    {
        Task<IEnumerable<Resenha>> GetByLivro(int idLivro);
        Task<IEnumerable<Resenha>> GetByUser(string idUser);
        Task<Resenha> GetByLivroUser(string idUser, int idLivro);
        Task<Resenha> GetById(int id);
        Task<Resenha> GetResenhaMaisCurtida();
        Task<ResenhaResponse> Create(Resenha resenha);
        Task<ResenhaResponse> Update(int id, Resenha resenha);
        Task<ResenhaResponse> Delete(int id);
    }
}
