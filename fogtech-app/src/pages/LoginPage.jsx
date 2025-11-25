import { useState } from 'react';
import apiService from '../services/api';
import FogUtils from '../utils/FogUtils';

function LoginPage({ onNavigate, onLogin, showToast }) {
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!formData.email) {
      setMessage({ text: 'O campo login deve ser preenchido.', type: 'error' });
      return;
    }

    if (!FogUtils.isEmail(formData.email)) {
      setMessage({ text: 'O login deve ter formato de e-mail válido.', type: 'error' });
      return;
    }

    if (!formData.senha) {
      setMessage({ text: 'A senha deve ser preenchida.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.login(formData.email, formData.senha);
      onLogin(response.usuario);
      showToast('Bem-vindo(a) de volta!', 'success');
      onNavigate('home');
    } catch (error) {
      const errorMsg = error.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container narrow">
      <form className="form card" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Acesso ao sistema</legend>

          <div className="field">
            <label htmlFor="lg-email">Login (e-mail)</label>
            <input
              id="lg-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="lg-senha">Senha</label>
            <input
              id="lg-senha"
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              required
            />
          </div>
        </fieldset>

        <div className="actions">
          <button type="submit" className="btn btn-ok" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <button
            type="button"
            className="btn btn-alt"
            onClick={() => setFormData({ email: '', senha: '' })}
          >
            Limpar
          </button>
        </div>

        <p className="hint">Não tem conta? <a href="#cadastro" onClick={(e) => { e.preventDefault(); onNavigate('cadastro'); }}>Cadastre-se</a>.</p>
        <p className="hint">Esqueceu a senha? <a href="#trocasenha" onClick={(e) => { e.preventDefault(); onNavigate('trocasenha'); }}>Trocar senha</a>.</p>

        {message.text && (
          <p className={`msg ${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>
            {message.text}
          </p>
        )}
      </form>
    </main>
  );
}

export default LoginPage;