using Bibliocanto.Context;
using Bibliocanto.IRepository;
using Bibliocanto.Models;
using Microsoft.EntityFrameworkCore;

namespace Bibliocanto.Repository
{
    public class ResenhaRepository : BaseRepository, IResenhaRepository
    {
        public ResenhaRepository(AppDbContext context) : base(context)
        {

        }

        public async Task<IEnumerable<Resenha>> GetByUser(string idUser)
        {
            return await _context.Resenha.Where(n => n.IdUser.Contains(idUser)).Include(n => n.Usuario).ToListAsync();
        }

        public async Task<IEnumerable<Resenha>> GetByLivro(int idLivro)
        {
            return await _context.Resenha
                .Where(n => n.IdLivro == idLivro)
                .Include(n => n.Usuario)
                .Where(n => _context.Denuncias.Count(d => d.IdResenha == n.Id) <= 3)
                .ToListAsync();
        }

        public async Task<Resenha> GetByLivroUser(string idUser, int idLivro)
        {
            return await _context.Resenha.Include(n => n.Usuario).FirstOrDefaultAsync(l => l.IdLivro == idLivro && l.IdUser == idUser);
        }

        public async Task<Resenha> GetById(int id)
        {
            return await _context.Resenha.Include(n => n.Usuario).FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<Resenha> GetResenhaMaisCurtida()
        {
            var resenhaMaisCurtida = await _context.LikeResenha.Where(m => m.Like == 1)
                    .GroupBy(m => m.IdResenha).OrderByDescending(g => g.Count()).Select(g => g.Key).FirstOrDefaultAsync();

            if (resenhaMaisCurtida == 0)
            {
                return null;
            };

            return await _context.Resenha.Include(n => n.Usuario).FirstOrDefaultAsync(l => l.Id == resenhaMaisCurtida);

        }

        public async Task Create(Resenha resenha)
        {
            await _context.Resenha.AddAsync(resenha);
        }

        public void Update(Resenha resenha)
        {
            _context.Resenha.Update(resenha);
        }

        public void Delete(Resenha resenha)
        {
            _context.Resenha.Remove(resenha);
        }
    }
}
