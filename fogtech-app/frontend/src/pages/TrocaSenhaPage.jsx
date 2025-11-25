import { useState } from 'react';
import apiService from '../services/api';
import FogUtils from '../utils/FogUtils';

function TrocaSenhaPage({ onNavigate, showToast }) {
    const [formData, setFormData] = useState({
    email: '',
    senha_atual: '',
    nova_senha: '',
    confirma_senha: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState({ level: 0, text: '', color: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'nova_senha') {
      calculateStrength(value);
    }
  };

  const calculateStrength = (password) => {
    if (!password) {
      setStrength({ level: 0, text: '', color: '' });
      return;
    }

    let level = 0;
    if (password.length >= 6) level++;
    if (password.length >= 10) level++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) level++;
    if (/\d/.test(password)) level++;
    if (new RegExp(`[${FogUtils.ALLOWED.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(password)) level++;

    const strengths = [
      { level: 0, text: 'Muito fraca', color: '#ef4444' },
      { level: 1, text: 'Fraca', color: '#f97316' },
      { level: 2, text: 'Fraca', color: '#f97316' },
      { level: 3, text: 'Média', color: '#eab308' },
      { level: 4, text: 'Forte', color: '#22c55e' },
      { level: 5, text: 'Muito forte', color: '#10b981' }
    ];

    setStrength(strengths[level]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!FogUtils.isEmail(formData.email)) {
      setError('Email inválido');
      return;
    }

    const validPassword = FogUtils.validPassword(formData.nova_senha);
    if (!validPassword.ok) {
      setError(validPassword.msg);
      return;
    }

    if (formData.nova_senha !== formData.confirma_senha) {
      setError('As senhas não conferem');
      return;
    }

    setLoading(true);
    try {
      await apiService.trocarSenha(
        formData.email,
        formData.senha_atual,
        formData.nova_senha
      );
      showToast('Senha alterada com sucesso!', 'success');
      setTimeout(() => onNavigate('login'), 1500);
    } catch (err) {
      setError(err.message || 'Erro ao trocar senha');
    } finally {
      setLoading(false);
    }
  };

  const getRequirementStatus = (requirement) => {
    const password = formData.nova_senha;
    if (!password) return '';

    switch (requirement) {
      case 'length':
        return password.length >= 6 ? '✅' : '❌';
      case 'number':
        return /\d/.test(password) ? '✅' : '❌';
      case 'uppercase':
        return /[A-Z]/.test(password) ? '✅' : '❌';
      case 'special':
        return new RegExp(`[${FogUtils.ALLOWED.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(password) ? '✅' : '❌';
      case 'forbidden':
        return !new RegExp(`[${FogUtils.FORBIDDEN.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(password) ? '✅' : '❌';
      default:
        return '';
    }
  };


  return (
    <main className="container narrow">
        <section className="card password-rules">
          <h2>📋 Regras para Nova Senha</h2>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.8' }}>
            <li>{getRequirementStatus('length')} Mínimo de <strong>6 caracteres</strong></li>
            <li>{getRequirementStatus('number')} Pelo menos <strong>1 número</strong></li>
            <li>{getRequirementStatus('uppercase')} Pelo menos <strong>1 letra MAIÚSCULA</strong></li>
            <li>{getRequirementStatus('special')} Pelo menos <strong>1 caractere especial</strong> permitido: <code>{FogUtils.ALLOWED}</code></li>
            <li>{getRequirementStatus('forbidden')} <strong>NÃO PODE</strong> conter: <code>{FogUtils.FORBIDDEN}</code></li>
          </ul>
          <p className="hint">
            💡 <strong>Dica:</strong> Use uma senha forte, misturando letras, números e símbolos!
          </p>
        </section>

        <section className="card form">
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>Identificação</legend>
              
              <div className="field">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label>Senha Atual *</label>
                <input
                  type="password"
                  name="senha_atual"
                  value={formData.senha_atual}
                  onChange={handleChange}
                  required
                />
              </div>
            </fieldset>

            <fieldset>
              <legend>Nova Senha</legend>
              
              <div className="field">
                <label>Nova Senha *</label>
                <input
                  type="password"
                  name="nova_senha"
                  value={formData.nova_senha}
                  onChange={handleChange}
                  required
                />
                {formData.nova_senha && (
                  <div style={{ 
                    marginTop: '0.5rem', 
                    padding: '0.5rem', 
                    borderRadius: '0.5rem', 
                    background: strength.color + '20',
                    border: `2px solid ${strength.color}`,
                    color: strength.color,
                    fontWeight: '600'
                  }}>
                    Força: {strength.text}
                  </div>
                )}
              </div>

              <div className="field">
                <label>Confirmar Nova Senha *</label>
                <input
                  type="password"
                  name="confirma_senha"
                  value={formData.confirma_senha}
                  onChange={handleChange}
                  required
                  style={{
                    borderColor: formData.confirma_senha && formData.nova_senha !== formData.confirma_senha ? '#ef4444' : 
                                 formData.confirma_senha && formData.nova_senha === formData.confirma_senha ? '#10b981' : '#e2e8f0'
                  }}
                />
                {formData.confirma_senha && (
                  <p style={{ 
                    marginTop: '0.5rem', 
                    color: formData.nova_senha === formData.confirma_senha ? '#10b981' : '#ef4444',
                    fontWeight: '600'
                  }}>
                    {formData.nova_senha === formData.confirma_senha ? '✅ Senhas conferem' : '❌ Senhas não conferem'}
                  </p>
                )}
              </div>
            </fieldset>

            {error && <div className="msg error">{error}</div>}

            <div className="actions">
              <button type="submit" className="btn btn-ok" disabled={loading}>
                {loading ? 'Processando...' : '🔒 Trocar Senha'}
              </button>
              <button type="button" className="btn" onClick={() => onNavigate('login')}>
                ← Voltar
              </button>
            </div>
          </form>
        </section>
      </main>
  );
}

export default TrocaSenhaPage;
