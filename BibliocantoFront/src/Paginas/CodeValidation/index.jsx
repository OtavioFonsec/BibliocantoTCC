import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import api from '../../services/api';
import './style.css';

export default function ValidateResetCode() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = useParams();

  const validateCode = async () => {
    
    if (!code) {
      alert('Digite o código.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/api/Account/ValidateResetCode', { email, code });
      alert(response.data);
      navigate(`/reset-password/${email}/${code}`);
    } catch (error) {
      alert('Código inválido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="validate-code-container">
      <section className='form-code-validation'>
      {/* Botão de voltar */}
      <button className="voltar" onClick={() => navigate(-1)}>
        Voltar
      </button>

      <h1 className="title-code-validation">Quase lá!</h1>
      <p className="subtitle-code-validation">Digite o código enviado para seu e-mail:</p>
      <input
        type="text"
        placeholder="Código"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="input"
        inputMode="numeric"
      />
      <button className="btn-validar-codigo" onClick={validateCode} disabled={isLoading}>
        {isLoading ? 'Validando...' : 'Validar o código'}
      </button>
      </section>
    </div>
  );
}
