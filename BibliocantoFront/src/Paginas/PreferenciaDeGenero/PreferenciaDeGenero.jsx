import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./PreferenciaDeGenero.css";

const PreferenciaDeGenero = () => {
  const [generos, setGeneros] = useState([]);
  const [idsSelecionados, setIdsSelecionados] = useState([]);
  const [preferenciasUsuario, setPreferenciasUsuario] = useState([]);

  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const resposta = await api.getGeneros();
        setGeneros(resposta);
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
      }
    };

    const fetchPreferenciasUsuario = async () => {
      const idUser = localStorage.getItem("Id");

      try {
        const resposta = await api.GetPreferenciaByIdUser(idUser);

        const preferencias = resposta.data;

        const ids = preferencias.map((p) => p.idGenero);
        setIdsSelecionados(ids);
        setPreferenciasUsuario(preferencias); // Armazena preferências antigas para comparação
      } catch (error) {
        console.error("❌ Erro ao buscar preferências do usuário:", error);
      }
    };

    fetchGeneros();
    fetchPreferenciasUsuario();
  }, [reloadTrigger]);

  const toggleGenero = (id) => {
    const jaSelecionado = idsSelecionados.includes(id);

    if (jaSelecionado) {
      setIdsSelecionados(idsSelecionados.filter((itemId) => itemId !== id));
    } else {
      if (idsSelecionados.length < 5) {
        setIdsSelecionados([...idsSelecionados, id]);
      } else {
        alert("Você pode selecionar no máximo 5 gêneros.");
      }
    }
  };

  const confirmarPreferencias = async () => {
    const idUser = localStorage.getItem("Id");

    // Preferências atuais no banco de dados
    const idsBanco = preferenciasUsuario.map((p) => p.idGenero);

    // Preferências novas marcadas
    const novos = idsSelecionados.filter((id) => !idsBanco.includes(id));
    // Preferências removidas
    const removidos = preferenciasUsuario.filter((p) => !idsSelecionados.includes(p.idGenero));

    // Adiciona novas preferências
    for (const idGenero of novos) {
      try {
        await api.cadastrarPreferenciaUsuario({ idUser, idGenero });
      } catch (error) {
        console.error(` Erro ao adicionar preferência ${idGenero}:`, error);
      }
    }

    // Remove desmarcadas
    for (const preferencia of removidos) {
      try {
        await api.DeletePreferenciaUsuario(preferencia.id);
      } catch (error) {
        console.error(` Erro ao excluir preferência ${preferencia.id}:`, error);
      }
    }
    setReloadTrigger((prev) => prev + 1);
    alert("Preferências atualizadas com sucesso!");
  };

  return (
    <div className="generos-container">
      <h2 className="titulo">Escolha até 5 gêneros preferidos</h2>
      <div className="retangulos-container">
        {generos.map((genero) => (
          <div
            className={`retangulo-genero ${
              idsSelecionados.includes(genero.id) ? "selecionado" : ""
            }`}
            key={genero.id}
            onClick={() => toggleGenero(genero.id)}
          >
            {genero.nomegenero}
          </div>
        ))}
      </div>

      <div className="selecionados-info">
        <button onClick={confirmarPreferencias} className="btn-confirmar-preferencias">
          Confirmar preferências
        </button>
      </div>
    </div>
  );
};

export default PreferenciaDeGenero;