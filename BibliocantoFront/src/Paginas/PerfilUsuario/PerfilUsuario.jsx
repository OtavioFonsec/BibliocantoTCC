import React, { useEffect, useState } from "react";
import api from "../../services/api"; // ajuste se necessário
import "./PerfilUsuario.css";

function PerfilUsuario() {
  const [idUser, setIdUser] = useState("");
  const [perfil, setPerfil] = useState({
    id: 0,
    idUser: "",
    nome: "",
    apelido: "",
    descricao: "",
    dataNasc: "",
  });

  const [perfilExistente, setPerfilExistente] = useState(false);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);

  // Obter ID do usuário
  useEffect(() => {
    const id = localStorage.getItem("Id") || "";
    setIdUser(id);
  }, []);

  // Buscar perfil
  useEffect(() => {
    if (idUser) {
      api
        .GetPerfilByIdUser(idUser)
        .then((res) => {
          setPerfil(res.data);
          setPerfilExistente(true);
        })
        .catch((error) => {
          if (error.response?.status === 404) {
            // Perfil ainda não existe
            setPerfil({
              id: 0,
              idUser: idUser,
              nome: "",
              apelido: "",
              descricao: "",
              dataNasc: "",
            });
            setPerfilExistente(false);
          } else {
            console.error("Erro ao buscar o perfil:", error);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [idUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil((prev) => ({ ...prev, [name]: value }));
  };

  const handleCadastrar = async (e) => {
    e.preventDefault();
    console.log("Enviando novo perfil para a API:", perfil);

    try {
      await api.cadastrarPerfilUsuario(perfil);
      alert("Perfil cadastrado com sucesso!");
      setPerfilExistente(true);
      setEditando(false);
    } catch (error) {
      console.error("Erro ao cadastrar o perfil:", error);
      alert("Erro ao cadastrar o perfil.");
    }
  };

  const handleEditar = () => setEditando(true);

  const handleSalvarEdicao = async (e) => {
    e.preventDefault();

    try {
      await api.putPerfilUsuario(perfil.id, perfil);
      window.location.reload();
      setEditando(false);
    } catch (error) {
      alert("Erro ao atualizar o perfil.");
    }
  };

  if (loading) return <p>Carregando perfil...</p>;

  return (
    <div className="perfil-container">
      <section className='perfil-section'>
      <h2 className="titulo-perfil">{perfilExistente ? "Meu Perfil" : "Cadastrar Perfil"}</h2>

      <form onSubmit={perfilExistente && !editando ? undefined : perfilExistente ? handleSalvarEdicao : handleCadastrar}>
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={perfil.nome}
            onChange={handleChange}
            disabled={!editando && perfilExistente}
            placeholder="Digite seu nome completo"
          />
        </div>

        <div className="form-group">
          <label>Apelido:</label>
          <input
            type="text"
            name="apelido"
            value={perfil.apelido}
            onChange={handleChange}
            disabled={!editando && perfilExistente}
            placeholder="Como prefere ser chamado?"
          />
        </div>

        <div className="form-group">
          <label>Descrição:</label>
          <input
            type="text"
            name="descricao"
            value={perfil.descricao}
            onChange={handleChange}
            disabled={!editando && perfilExistente}
            placeholder="Fale um pouco sobre você..."
          />
        </div>

        <div className="form-group">
          <label>Data de Nascimento:</label>
          <input
            type="date"
            name="dataNasc"
            value={perfil.dataNasc ? perfil.dataNasc.substring(0, 10) : ""}
            onChange={handleChange}
            disabled={!editando && perfilExistente}
          />
        </div>

        {/* Botões de ação */}
        <div className="btn-pagina-perfil">
        {!perfilExistente && (
          <button type="submit" className="btn-perfil btn-cadastrar-perfil">
            Cadastrar Perfil
          </button>
        )}

        {perfilExistente && !editando && (
          <button type="button" className="btn-perfil btn-editar-perfil" onClick={handleEditar}>
            Editar Perfil
          </button>
        )}

        {perfilExistente && editando && (
          <button type="submit" className="btn-perfil btn-salvar-perfil">
            Salvar Alterações
          </button>
        )}
        </div>
      </form>
      </section>
    </div>
  );
}

export default PerfilUsuario;
