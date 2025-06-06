using Bibliocanto.Communication;
using Bibliocanto.IRepository;
using Bibliocanto.IServices;
using Bibliocanto.Models;
using Bibliocanto.Repository;

namespace Bibliocanto.Services
{
    public class ResenhaService : IResenhaService
    {
        private readonly IResenhaRepository _resenhaRepository;
        private readonly IUnitOFWork _unitOfWork;

        public ResenhaService(IResenhaRepository ResenhaRepository, IUnitOFWork unitOfWork)
        {
            _resenhaRepository = ResenhaRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Resenha> GetById(int id)
        {
            return await _resenhaRepository.GetById(id);
        }

        public async Task<Resenha> GetResenhaMaisCurtida()
        {
            return await _resenhaRepository.GetResenhaMaisCurtida();
        }

        public async Task<Resenha> GetByLivroUser(string idUser, int idLivro)
        {
            return await _resenhaRepository.GetByLivroUser(idUser, idLivro);
        }

        public async Task<IEnumerable<Resenha>> GetByLivro(int idLivro)
        {
            IEnumerable<Resenha> baseResenha;
            if (idLivro != null)
            {
                baseResenha = await _resenhaRepository.GetByLivro(idLivro);
            }
            else
            {
                baseResenha = null;
            }
            return baseResenha;
        }

        public async Task<IEnumerable<Resenha>> GetByUser(string idUser)
        {
            IEnumerable<Resenha> baseResenha;
            if (!string.IsNullOrWhiteSpace(idUser))
            {
                baseResenha = await _resenhaRepository.GetByUser(idUser);
            }
            else
            {
                baseResenha = null;
            }
            return baseResenha;
        }

        public async Task<ResenhaResponse> Create(Resenha Resenha)
        {
            try
            {
                await _resenhaRepository.Create(Resenha);
                await _unitOfWork.CompleteAsync();

                return new ResenhaResponse(Resenha);
            }
            catch (Exception ex)
            {
                return new ResenhaResponse($"An error occurred when saving the category: {ex.Message}");
            }
        }

        public async Task<ResenhaResponse> Update(int id, Resenha Resenha)
        {
            var ResenhaExistente = await _resenhaRepository.GetById(id);

            if (ResenhaExistente == null)
                return new ResenhaResponse("Category not found.");

            ResenhaExistente.TextoResenha = Resenha.TextoResenha;

            try
            {
                _resenhaRepository.Update(ResenhaExistente);
                await _unitOfWork.CompleteAsync();

                return new ResenhaResponse(ResenhaExistente);
            }
            catch (Exception ex)
            {
                return new ResenhaResponse($"An error occurred when updating the category: {ex.Message}");
            }
        }

        public async Task<ResenhaResponse> Delete(int id)
        {
            var deleteResenha = await _resenhaRepository.GetById(id);

            if (deleteResenha == null)
                return new ResenhaResponse("Category not found.");

            try
            {
                _resenhaRepository.Delete(deleteResenha);
                await _unitOfWork.CompleteAsync();

                return new ResenhaResponse(deleteResenha);
            }
            catch (Exception ex)
            {
                return new ResenhaResponse($"An error occurred when deleting the category: {ex.Message}");
            }
        }
    }
}
