import { useState } from 'react';
import apiService from '../services/api';
import FogUtils from '../utils/FogUtils';

function CadastroPage({ onNavigate, onRegister, showToast }) {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    confirma_senha: '',
    nome: '',
    cpf: '',
    data_nascimento: '',
    telefone: '',
    estado_civil: '',
    escolaridade: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'cpf') {
      finalValue = FogUtils.formatCPF(value);
    } else if (name === 'telefone') {
      finalValue = FogUtils.formatPhone(value);
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!FogUtils.isEmail(formData.email)) {
      setError('Email inválido');
      return;
    }

    const validPassword = FogUtils.validPassword(formData.senha);
    if (!validPassword.ok) {
      setError(validPassword.msg);
      return;
    }

    if (formData.senha !== formData.confirma_senha) {
      setError('As senhas não conferem');
      return;
    }

    const nomes = formData.nome.trim().split(/\s+/);
    if (nomes.length < 2) {
      setError('Nome deve conter pelo menos nome e sobrenome');
      return;
    }

    if (!FogUtils.validaCPF(formData.cpf)) {
      setError('CPF inválido');
      return;
    }

    if (!FogUtils.isAdult(formData.data_nascimento)) {
      setError('Você deve ter pelo menos 18 anos');
      return;
    }

    if (!formData.estado_civil) {
      setError('Selecione o estado civil');
      return;
    }

    if (!formData.escolaridade) {
      setError('Selecione a escolaridade');
      return;
    }

    setLoading(true);
    try {
      const dadosCadastro = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, '')
      };

      await apiService.cadastrarCliente(dadosCadastro);
      showToast('Cadastro realizado com sucesso!', 'success');
      
      const loginData = await apiService.login(formData.email, formData.senha);
      onRegister(loginData.usuario);
      
      setTimeout(() => onNavigate('home'), 1500);
    } catch (err) {
      setError(err.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container narrow">
      <section className="card form">
        <h2>Cadastro de Cliente</h2>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Credenciais de Acesso</legend>
            
            <div className="field">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="seu@email.com"
              />
            </div>

            <div className="field">
              <label>Senha *</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="field">
              <label>Confirmar Senha *</label>
              <input
                type="password"
                name="confirma_senha"
                value={formData.confirma_senha}
                onChange={handleChange}
                required
                placeholder="Repita a senha"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Dados Pessoais</legend>
            
            <div className="field">
              <label>Nome Completo *</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                placeholder="Nome e Sobrenome"
              />
              <span className="hint">Informe nome e sobrenome</span>
            </div>

            <div className="field two">
              <div>
                <label>CPF *</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  placeholder="000.000.000-00"
                  maxLength="14"
                />
              </div>
              <div>
                <label>Data de Nascimento *</label>
                <input
                  type="date"
                  name="data_nascimento"
                  value={formData.data_nascimento}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Telefone (Opcional)</label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 90000-0000"
                maxLength="15"
              />
            </div>

            <div className="field">
              <label>Estado Civil *</label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', textTransform: 'none', fontWeight: '500' }}>
                  <input
                    type="radio"
                    name="estado_civil"
                    value="Solteiro(a)"
                    checked={formData.estado_civil === 'Solteiro(a)'}
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Solteiro(a)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', textTransform: 'none', fontWeight: '500' }}>
                  <input
                    type="radio"
                    name="estado_civil"
                    value="Casado(a)"
                    checked={formData.estado_civil === 'Casado(a)'}
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Casado(a)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', textTransform: 'none', fontWeight: '500' }}>
                  <input
                    type="radio"
                    name="estado_civil"
                    value="Divorciado(a)"
                    checked={formData.estado_civil === 'Divorciado(a)'}
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Divorciado(a)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', textTransform: 'none', fontWeight: '500' }}>
                  <input
                    type="radio"
                    name="estado_civil"
                    value="Viúvo(a)"
                    checked={formData.estado_civil === 'Viúvo(a)'}
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Viúvo(a)
                </label>
              </div>
            </div>

            <div className="field">
              <label>Escolaridade *</label>
              <select
                name="escolaridade"
                value={formData.escolaridade}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                <option value="Fundamental">Ensino Fundamental</option>
                <option value="Médio">Ensino Médio</option>
                <option value="Superior">Ensino Superior</option>
                <option value="Pós-graduação">Pós-graduação</option>
                <option value="Mestrado">Mestrado</option>
                <option value="Doutorado">Doutorado</option>
              </select>
            </div>
          </fieldset>

          {error && <div className="msg error">{error}</div>}

          <div className="actions">
            <button type="submit" className="btn btn-ok" disabled={loading}>
              {loading ? 'Processando...' : '✓ Cadastrar'}
            </button>
            <button type="button" className="btn" onClick={() => onNavigate('login')}>
              ← Voltar
            </button>
          </div>

          <p style={{ marginTop: '1rem', textAlign: 'center', color: '#64748b' }}>
            Já tem uma conta?{' '}
            <a 
              href="#login" 
              onClick={(e) => { 
                e.preventDefault(); 
                onNavigate('login'); 
              }} 
              className="link"
            >
              Faça login
            </a>
          </p>
        </form>
      </section>
    </main>
  );
}

export default CadastroPage;