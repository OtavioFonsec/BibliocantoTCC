using AutoMapper;
using Bibliocanto.Extensions;
using Bibliocanto.IServices;
using Bibliocanto.Models;
using Bibliocanto.Resources;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Bibliocanto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResenhaController : ControllerBase
    { 
        private readonly IMapper _mapper;
        private readonly IResenhaService _resenhaService;


        public ResenhaController(IMapper mapper, IResenhaService resenhaService)
        {
            _mapper = mapper;
            _resenhaService = resenhaService;
        }

        [HttpGet("ResenhaByLivro")]
        public async Task<ActionResult<IEnumerable<object>>> GetByLivro([FromQuery] int idLivro)
        {
            try
            {
                var resenhas = await _resenhaService.GetByLivro(idLivro);

                var resultado = resenhas.Select(r => new
                {
                    r.Id,
                    r.IdLivro,
                    r.IdUser,
                    r.TextoResenha,
                    Usuario = new
                    {
                        r.Usuario.Id,
                        r.Usuario.Email,
                    }
                });

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Request Inválido");
            }
        }

        [HttpGet("GetResenhaMaisCurtida")]
        public async Task<ActionResult<object>> GetResenhaMaisCurtida()
        {
            try
            {
                var resenha = await _resenhaService.GetResenhaMaisCurtida();

                if (resenha == null)
                {
                    return NotFound("Avaliação não encontrada.");
                }

                var resultado = new
                {
                    resenha.Id,
                    resenha.IdLivro,
                    resenha.IdUser,
                    resenha.TextoResenha,
                    Usuario = new
                    {
                        resenha.Usuario?.Id,
                        resenha.Usuario?.Email
                    }
                };

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Request Inválido");
            }
        }


        [HttpGet("ResenhaByUser")]
        public async Task<ActionResult<IEnumerable<object>>> GetByUser([FromQuery] string idUser)
        {
            try
            {
                var resenhas = await _resenhaService.GetByUser(idUser);

                if (resenhas == null || !resenhas.Any())
                {
                    return NotFound("Não foi encontrada nenhuma resenha desse usuário.");
                }

                var resultado = resenhas.Select(r => new
                {
                    r.Id,
                    r.IdLivro,
                    r.IdUser,
                    r.TextoResenha,
                    Usuario = new
                    {
                        r.Usuario.Id,
                        r.Usuario.Email
                    }
                });

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message); // Ajuda a debugar
                return BadRequest("Request inválido");
            }
        }

        [HttpGet("ResenhaByUserLivro")]
        public async Task<ActionResult<object>> GetByUser([FromQuery] string idUser, [FromQuery] int idLivro)
        {
            try
            {
                var r = await _resenhaService.GetByLivroUser(idUser, idLivro);

                if (r == null)
                {
                    return NotFound("Não foi encontrada avaliação para esse usuário.");
                }

                var resultado = new
                {
                    r.Id,
                    r.IdLivro,
                    r.IdUser,
                    r.TextoResenha,
                    Usuario = new
                    {
                        r.Usuario.Id,
                        r.Usuario.Email
                    }
                };

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message); // Para debug
                return BadRequest("Request Inválido");
            }
        }

        [HttpGet("{id:int}", Name = "GetLikeResenhaById")]
        public async Task<ActionResult<object>> GetById(int id)
        {
            try
            {
                var r = await _resenhaService.GetById(id);

                if (r == null)
                {
                    return NotFound("Avaliação não encontrada.");
                }

                var resultado = new
                {
                    r.Id,
                    r.IdLivro,
                    r.IdUser,
                    r.TextoResenha,
                    Usuario = new
                    {
                        r.Usuario?.Id,
                        r.Usuario?.Email
                    }
                };

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message); // para debugging
                return BadRequest("Request inválido.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] SaveResenhaResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var resenha = _mapper.Map<SaveResenhaResource, Resenha>(resource);
            var result = await _resenhaService.Create(resenha);

            if (!result.Success)
                return BadRequest(result.Message);

            var resenhaResource = _mapper.Map<Resenha, ResenhaResource>(result.Resenha);
            return Ok(resenhaResource);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SaveResenhaResource recurso)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var resenha = _mapper.Map<SaveResenhaResource, Resenha>(recurso);
            var result = await _resenhaService.Update(id, resenha);

            if (!result.Success)
                return BadRequest(result.Message);

            var resenhaResource = _mapper.Map<Resenha, ResenhaResource>(result.Resenha);
            return Ok(resenhaResource);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _resenhaService.Delete(id);

            if (!result.Success)
                return BadRequest(result.Message);

            var resenhaResource = _mapper.Map<Resenha, ResenhaResource>(result.Resenha);
            return Ok(resenhaResource);
        }
    }
}
