import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import "./Nav.css";

export default function Nav() {
  const [email, setEmail] = useState(localStorage.getItem("email") || null);
  const [perfil, setPerfil] = useState({ nome: "", apelido: "" });

  const saudacao = perfil.apelido || perfil.nome || email;

  const location = useLocation();
  const history = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("expiration");
    localStorage.removeItem("Id");
    history("/login");
    window.location.reload();
  };

  const handleLogIn = () => {
    history("/login");
  };

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!email) {
        return;
      }

      try {
        const idUser = localStorage.getItem("Id");
        if (!idUser) {
          console.warn("ID do usuário não encontrado no localStorage.");
          return;
        }

        const response = await api.GetPerfilByIdUser(idUser);

        if (response && response.data) {
          const { apelido, nome } = response.data;
          setPerfil({ apelido, nome });
        }
      } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
      }
    };

    fetchPerfil();
  }, [email]);

  return (
    <div className="nav-container">
      <div className="nav-titulo">
        <img
          className="nav-logo"
          src="/assets/BibliocantoTCC-mainlogo.png"
          alt="Bibliocanto"
        />
        <h3>Bibliocanto</h3>
      </div>

      {email && (
        <div className="nav-subtitulo">
          <label>Seja bem vindo, {saudacao}!</label>
        </div>
      )}
      <div className="nav-links">
        <h5>Encontre seu Livro</h5>
        <Link
          to="/"
          title="Acervo de Livros"
          className={
            [
              "/",
              "/LivrosPorGenero",
              "/LivrosPorEditora",
            ].includes(location.pathname)
              ? "active-link"
              : ""
          }
        >
          <i className="bi bi-house"></i> Acervo de Livros
        </Link>
        {email && (
          <Link
            to="/BuscaISBN"
            title="Cadastrar Livro"
            className={
              ["/BuscaISBN", "/PreCadastrar", "/FinalizarCadastro"].includes(
                location.pathname
              )
                ? "active-link"
                : ""
            }
          >
            <i className="bi bi-journal-plus"></i> Cadastrar Livro
          </Link>
        )}
      </div>

      {email && (
        <div className="nav-links">
          <h5>Seus Livros</h5>
          <Link
            to="/MinhaBiblioteca"
            title="Minha Biblioteca"
            className={
              location.pathname === "/MinhaBiblioteca" ? "active-link" : ""
            }
          >
            <i className="bi bi-book"></i> Minha Biblioteca
          </Link>
          <Link
            to="/Lidos"
            title="Livros Lidos"
            className={location.pathname === "/Lidos" ? "active-link" : ""}
          >
            <i className="bi bi-bookmark-star"></i> Lidos
          </Link>
          <Link
            to="/Relidos"
            title="Livros Relidos"
            className={location.pathname === "/Relidos" ? "active-link" : ""}
          >
            <i className="bi bi-bookmark-heart"></i> Relidos
          </Link>
        </div>
      )}

      <div className="nav-links">
        <h5>Bibliocanto</h5>
        <Link
          to="/privacy-policy"
          title="Política de Privacidade"
          className={
            location.pathname === "/privacy-policy" ? "active-link" : ""
          }
        >
          <i className="bi bi-info-circle"></i> Política de Privacidade
        </Link>
        <Link
          to="/about"
          title="Sobre o Site"
          className={location.pathname === "/about" ? "active-link" : ""}
        >
          <i className="bi bi-globe2"></i> Sobre o Site
        </Link>
      </div>

      {email && (
        <div className="nav-links">
          <h5>Usuário</h5>

          <Link
            to="/PerfilUsuario"
            title="Meu Perfil"
            className={
              location.pathname === "/PerfilUsuario" ? "active-link" : ""
            }
          >
            <i className="bi bi-person"></i> Meu Perfil
          </Link>
          <Link
            to="/PreferenciaDeGenero"
            title="Preferências"
            className={
              location.pathname === "/PreferenciaDeGenero" ? "active-link" : ""
            }
          >
            <i className="bi bi-star"></i> Preferências
          </Link>
        </div>
      )}

      {!email && (
        <div className="aviso-restrito-login">
          <label>
            {" "}
            ⚠️ Algumas funcionalidades estão disponíveis apenas para usuários
            logados. Faça login ou crie uma conta para acessar!
          </label>
        </div>
      )}

      <div className="nav-footer">
        {email ? (
          <span className="logout-icon" onClick={handleLogout}>
           <span className="logout-text">Sair</span>
            <FontAwesomeIcon icon={faRightFromBracket} title="Sair"/>
          </span>
        ) : (
          <span className="login-icon" onClick={handleLogIn}>
            <span className="login-text">Entrar</span>
            <FontAwesomeIcon icon={faRightToBracket} title="Entrar"/>
          </span>
        )}
      </div>
    </div>
  );
}
