using Bibliocanto.Communication;
using Bibliocanto.Context;
using Bibliocanto.IRepository;
using Bibliocanto.IServices;
using Bibliocanto.Models;
using Bibliocanto.Repository;
using Microsoft.EntityFrameworkCore;

namespace Bibliocanto.Services
{
    public class LivrosService : ILivrosService
    {
        private readonly ILivrosRepository _livrosRepository;
        private readonly IUnitOFWork _unitOfWork;

        public LivrosService(ILivrosRepository livrosRepository, IUnitOFWork unitOfWork)
        {
            this._livrosRepository = livrosRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Livros>> GetBaseLivros()
        {
            return await _livrosRepository.GetBaseLivros(); 
        }

        public async Task<Livros> GetLivroMaisLido()
        {
            return await _livrosRepository.GetLivroMaisLido();
        }

        public async Task<IEnumerable<Livros>> GetLivrosByIdEditora(int id)
        {
            return await _livrosRepository.GetLivrosByIdEditora(id);
        }

        public async Task<IEnumerable<Livros>> GetLivrosByIdUser(string idUser)
        {
            return await _livrosRepository.GetLivrosByIdUser(idUser);
        }

        public async Task<Livros> GetLivroById(int id)
        {
            return await _livrosRepository.GetLivroById(id);
        }

        public async Task<Livros> GetLivroByIsbn(string isbn)
        {
            return await _livrosRepository.GetLivroByIsbn(isbn);
        }

        public async Task<IEnumerable<Livros>> GetLivroByNome(string nome)
        {
            IEnumerable<Livros> baseLivros;
            if (!string.IsNullOrWhiteSpace(nome))
            {
                baseLivros = await _livrosRepository.GetLivrosByNome(nome);
            }
            else
            {
                baseLivros = await GetBaseLivros();
            }
            return baseLivros;
        }

        public async Task<LivrosResponse> AddLivro(Livros livro)
        {
            try
            {
                await _livrosRepository.AddLivro(livro);
                await _unitOfWork.CompleteAsync();

                return new LivrosResponse(livro);
            }
            catch (Exception ex)
            {
                return new LivrosResponse($"An error occurred when saving the category: {ex.Message}");
            }
        }

        public async Task<LivrosResponse> UpdateLivro(int id, Livros livro)
        {
            var exibirLivro = await _livrosRepository.GetLivroById(id);

            if (exibirLivro == null)
                return new LivrosResponse("Category not found.");

            exibirLivro.Titulo = livro.Titulo;
            exibirLivro.Descricao = livro.Descricao;
            exibirLivro.CaminhoImagem = livro.CaminhoImagem;
            exibirLivro.Isbn = livro.Isbn;
            exibirLivro.EditoraId = livro.EditoraId;
            exibirLivro.LinkCompra = livro.LinkCompra;



            try
            {
                _livrosRepository.UpdateLivro(exibirLivro);
                await _unitOfWork.CompleteAsync();

                return new LivrosResponse(exibirLivro);
            }
            catch (Exception ex)
            {
                return new LivrosResponse($"An error occurred when updating the category: {ex.Message}");
            }
        }

        public async Task<LivrosResponse> Delete(int id)
        {
            var existingCategory = await _livrosRepository.GetLivroById(id);

            if (existingCategory == null)
                return new LivrosResponse("book not found.");

            try
            {
                _livrosRepository.Delete(existingCategory);
                await _unitOfWork.CompleteAsync();

                return new LivrosResponse(existingCategory);
            }
            catch (Exception ex)
            {
                return new LivrosResponse($"An error occurred when deleting the category: {ex.Message}");
            }
        }
    }
}