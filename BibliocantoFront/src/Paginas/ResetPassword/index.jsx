import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Eye, EyeOff } from 'lucide-react';
import './styles.css';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, code } = useParams();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const resetPassword = async () => {
    if (!newPassword) {
      alert('Digite uma nova senha.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

    if (!passwordRegex.test(newPassword)) {
      alert(
        'A senha deve conter pelo menos 10 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post(
        '/api/Account/ResetPasswordWithCode',
        { email, code, newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      alert(response.data);
      navigate('/login');
    } catch (error) {
      alert('Não foi possível redefinir a senha.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <section className="form">
        <button className="voltar" onClick={() => navigate(-1)}>
          ← Voltar
        </button>

        <h1 className="title">Escolha uma nova senha!</h1>

        <label className="label">Nova senha:</label>
        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="button" className="eye-button" onClick={togglePasswordVisibility}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <label className="label">Confirme sua nova senha:</label>
        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirme a senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="button" className="eye-button" onClick={togglePasswordVisibility}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button className="solicitar" onClick={resetPassword} disabled={isLoading}>
          {isLoading ? 'Redefinindo...' : 'Redefinir a senha'}
        </button>
      </section>
    </div>
  );
}
