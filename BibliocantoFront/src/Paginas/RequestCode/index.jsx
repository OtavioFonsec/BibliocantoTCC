import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';

export default function RequestResetCode() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
  
    const requestCode = async () => {
      if (!email) {
        alert('Digite seu e-mail.');
        return;
      }
  
      setIsLoading(true);
  
      try {
        const response = await api.post('/api/Account/RequestPasswordResetCode', {email});
        alert(response.data);
        navigate(`/code-validation/${email}`);
      } catch (error) {
        alert('Não foi possível enviar o código.');
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="request-reset-container">
        <section className='form-request-code'>
        <button className="voltar" onClick={() => navigate('/Login')}>
          Voltar
        </button>
  
        <h1 className="title-request-code">Problemas para entrar?</h1>
        <p className="subtitle-request-code">
          Digite seu e-mail para receber o código de redefinição de senha:
        </p>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <button className="solicitar" onClick={requestCode} disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Solicitar código'}
        </button>
        </section>
      </div>
    );
  }
