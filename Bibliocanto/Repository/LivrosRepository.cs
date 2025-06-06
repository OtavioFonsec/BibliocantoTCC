using Bibliocanto.Context;
using Bibliocanto.IRepository;
using Bibliocanto.Models;
using Microsoft.EntityFrameworkCore;

namespace Bibliocanto.Repository
{
    public class LivrosRepository : BaseRepository, ILivrosRepository
    {
        public LivrosRepository(AppDbContext context) : base(context) 
        { 
        
        }

        public async Task<IEnumerable<Livros>> GetBaseLivros()
        {
            return await _context.Livros.Include(d => d.Editoras).ToListAsync();
        }

        public async Task<Livros> GetLivroMaisLido()
        {
            var livroMaisLidoId = await _context.MeusLivros
                .Where(m => m.Lido == 1)
                .GroupBy(m => m.IdLivro)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .FirstOrDefaultAsync();

            if (livroMaisLidoId == 0)
                return null;

            return await _context.Livros.FirstOrDefaultAsync(l => l.Id == livroMaisLidoId);
        }

        public async Task<IEnumerable<Livros>> GetLivrosByNome(string nome)
        {
            return await _context.Livros.Where(l => l.Titulo.Contains(nome)).Include(d => d.Editoras).ToListAsync();
        }

        public async Task<Livros> GetLivroById(int id)
        {
            return await _context.Livros.Include(d => d.Editoras).FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<Livros> GetLivroByIsbn(string isbn)
        {
            return await _context.Livros.FirstOrDefaultAsync(l => l.Isbn == isbn);
        }

        public async Task<IEnumerable<Livros>> GetLivrosByIdUser(string idUser)
        {
            // 1. Buscar os gêneros preferidos do usuário
            var generosPreferidos = await _context.Preferencias.Where(p => p.IdUser == idUser).Select(p => p.IdGenero).ToListAsync();

            // 2. Buscar os livros que já estão na biblioteca do usuário
            var livrosSalvos = await _context.MeusLivros.Where(b => b.IdUser == idUser).Select(b => b.IdLivro).ToListAsync();

            // 3. Buscar os IDs de livros que pertencem aos gêneros preferidos e que ainda não estão na biblioteca
            var buscarIdLivros = await _context.GeneroLivro.Where(gl => generosPreferidos.Contains(gl.IdGenero) && !livrosSalvos.Contains(gl.IdLivro)).OrderBy(x => Guid.NewGuid()).Select(gl => gl.IdLivro).Take(9).ToListAsync();

            // 4. Buscar os livros correspondentes aos IDs filtrados
            var livros = await _context.Livros.Where(l => buscarIdLivros.Contains(l.Id)).ToListAsync();

            return livros;
        }


        public async Task<IEnumerable<Livros>> GetLivrosByIdEditora(int id)
        {
            return await _context.Livros.Where(l => l.EditoraId == id).ToListAsync();
        }

        public async Task AddLivro(Livros livro)
        {
            await _context.Livros.AddAsync(livro);
        }

        public void UpdateLivro(Livros livro)
        {
             _context.Livros.Update(livro);
        }

        public void Delete(Livros livro)
        {
            _context.Livros.Remove(livro);
        }
    }
}
