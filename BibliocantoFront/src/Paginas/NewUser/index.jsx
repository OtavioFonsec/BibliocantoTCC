import React, { useState } from "react";
import "./styles.css";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function NewUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const navigate = useNavigate();

  async function createLogin(event) {
    event.preventDefault();

    // Form validation
    const data = { email, password, confirmPassword };

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    // Validate password complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        "A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial."
      );
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    // Check if email is already registered
    try {
      const verificaEmail = await api.get("/api/Account/UserByEmail", {
        params: { email },
      });

      if (!verificaEmail.data) {
        const response = await api.post("/api/Account/CreateUser", data);
        alert(response.data);
        navigate("/login");
      } else {
        alert("Usuário já cadastrado no sistema!");
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert("Erro ao criar usuário. Tente novamente.");
    }
  }

  return (
    <div className="Criar-container">

      <section className="formCriarUser">
      <button className="voltar" onClick={() => navigate('/Login')}>
          Voltar
        </button>
        
        <img
          src="/assets/BibliocantoTCC-mainlogo.png"
          alt="Logo Bibliocanto"
          className="logoBibliocantoCriarUser"
        />

        <h1 className="h1TituloCriar">Bibliocanto</h1>

        <h2 className="h2TituloCriar">
          Cadastre-se para gerenciar seus livros e compartilhar experiências
        </h2>

        <p className="h2-subtitleCriar">
          Digite seu e-mail, sua senha e confime-a para realizar seu cadastro
        </p>

        <form onSubmit={createLogin}>
          <input
            name="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="input-group">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="eye-button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="input-group">
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirme a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="eye-button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button className="buttonCriarUser" type="submit">
            Criar
          </button>
        </form>
      </section>
    </div>
  );
}
