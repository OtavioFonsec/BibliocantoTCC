import React, { useState } from 'react';
import './styles.css';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    async function login(event) {
        event.preventDefault();

        const data = { email, password };

        try {
            const response = await api.post('/api/Account/LoginUser', data);

            localStorage.setItem('email', email);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('expiration', response.data.expiration);
            
            try {
                const responseId = await api.get('/api/Account/IdUserByEmail', {
                    params: { email: email },
                });
                localStorage.setItem('Id', responseId.data.id);
            } catch (error) {
                alert(`Erro ao buscar ID do usuário: ${error.message}`);
                return; // Importante: encerra a função se falhar
            }
            
            navigate('/');
            window.location.reload();
        } catch (error) {
            let errorMessage = 'Erro desconhecido. Tente novamente.';

            console.log(error);
            
            if (error instanceof AxiosError && error.response) {
                // Se a API retornar uma mensagem de erro, usa ela
                errorMessage = error.response.data || 'Erro na autenticação';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            alert(`Falha no login: ${errorMessage}`); // Alert corrigido
            console.error("Erro completo:", error); // Para debug
        }
    };

    // Função para redirecionar para a página de criação de usuário
    const handleCreateUser = () => {
        navigate('/NewUser');
    };

    // Função para redirecionar para a página de recuperação de senha
    const handleForgotPassword = () => {
      navigate('/RequestCode');
    };

    // Simulação de login com o Google
    // const handleGoogleLogin = () => {
    //     alert("Login com o Google ainda não implementado!");
    // };

    return (
        <div className='login-container'>
          <section className='form'>
          <img src="/assets/BibliocantoTCC-mainlogo.png" alt="Logo Bibliocanto" className="logoBibliocanto"/>
            <h1 className='h1MensagemLogin'>Seja bem-vindo ao Bibliocanto !</h1>
            <p className='h2MensagemLogin'>Para continuar, digite seu e-mail e senha.</p>
            <form onSubmit={login}>
              <input 
                name='email'
                placeholder='Email' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              
              <div className="input-group">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Senha' 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="button" className="eye-button" onClick={togglePasswordVisibility}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
    
              <button className="buttonLogin" type='submit'>Entrar</button>
            </form>
        
            <div className='login-options'>
              <a href="#" onClick={handleForgotPassword} className="forgot-password">
                Esqueceu a senha?
              </a>
              <span className="divider">Ou</span>
              <a href="#" onClick={handleCreateUser} className="create-account">
                Criar Usuário
              </a>
            </div>
          </section>
        </div>
      );
}
