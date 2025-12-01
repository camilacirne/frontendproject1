import React, { useState } from 'react';
import apiService from '../services/api';

const CadastroServicoPage = ({ showToast }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    preco: '',
    prazo_dias: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!formData.codigo || !formData.nome || !formData.preco || !formData.prazo_dias) {
      setMessage({ text: 'Todos os campos obrigatórios devem ser preenchidos.', type: 'error' });
      return;
    }

    if (formData.codigo.length < 2 || formData.codigo.length > 10) {
      setMessage({ text: 'O código deve ter entre 2 e 10 caracteres.', type: 'error' });
      return;
    }

    if (formData.nome.length < 3) {
      setMessage({ text: 'O nome deve ter pelo menos 3 caracteres.', type: 'error' });
      return;
    }

    const preco = parseFloat(formData.preco);
    if (isNaN(preco) || preco <= 0) {
      setMessage({ text: 'O preço deve ser um valor positivo.', type: 'error' });
      return;
    }

    const prazo = parseInt(formData.prazo_dias);
    if (isNaN(prazo) || prazo <= 0) {
      setMessage({ text: 'O prazo deve ser um número inteiro positivo.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const dadosServico = {
        codigo: formData.codigo.toUpperCase(),
        nome: formData.nome,
        descricao: formData.descricao || null,
        preco: preco,
        prazo_dias: prazo
      };

      const response = await apiService.cadastrarServico(dadosServico);

      if (response.status === 'sucesso') {
        setMessage({ text: 'Serviço cadastrado com sucesso!', type: 'ok' });
        showToast('Serviço cadastrado com sucesso!', 'success');
        
        setFormData({
          codigo: '',
          nome: '',
          descricao: '',
          preco: '',
          prazo_dias: ''
        });
      }
    } catch (error) {
      const errorMsg = error.message || 'Erro ao cadastrar serviço. Tente novamente.';
      setMessage({ text: errorMsg, type: 'error' });
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      codigo: '',
      nome: '',
      descricao: '',
      preco: '',
      prazo_dias: ''
    });
    setMessage({ text: '', type: '' });
    showToast('Formulário limpo', 'info');
  };

  const handlePriceChange = (value) => {
    const sanitized = value.replace(/[^\d.]/g, '');
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      return;
    }
    setFormData({ ...formData, preco: sanitized });
  };

  const handlePrazoChange = (value) => {
    const sanitized = value.replace(/\D/g, '');
    setFormData({ ...formData, prazo_dias: sanitized });
  };

  return (
    <main className="container narrow">
      <div className="card" style={{ background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', borderLeft: '4px solid #0ea5e9' }}>
        <h2 style={{ color: '#0369a1' }}>ℹ️ Cadastro de Serviços de TI</h2>
        <p style={{ color: '#075985' }}>
          Preencha todos os campos obrigatórios para cadastrar um novo serviço de TI no sistema.
          O código deve ser único e será usado para identificar o serviço nas solicitações.
        </p>
      </div>

      <form className="form card" onSubmit={handleSubmit} noValidate>
        <fieldset>
          <legend>Informações do Serviço</legend>

          <div className="field">
            <label htmlFor="srv-codigo">
              Código do Serviço <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="srv-codigo"
              type="text"
              placeholder="Ex: DEV, SEC, CLOUD"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
              maxLength="10"
              required
              style={{ textTransform: 'uppercase' }}
            />
            <small className="hint">Código único de 2-10 caracteres (letras/números)</small>
          </div>

          <div className="field">
            <label htmlFor="srv-nome">
              Nome do Serviço <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="srv-nome"
              type="text"
              placeholder="Ex: Desenvolvimento Web"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              maxLength="255"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="srv-descricao">
              Descrição (opcional)
            </label>
            <textarea
              id="srv-descricao"
              rows="4"
              placeholder="Descrição detalhada do serviço..."
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: 'var(--radius-lg)',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div className="field two">
            <div>
              <label htmlFor="srv-preco">
                Preço (R$) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="srv-preco"
                type="text"
                placeholder="0.00"
                value={formData.preco}
                onChange={(e) => handlePriceChange(e.target.value)}
                required
              />
              <small className="hint">Valor em reais (ex: 8000.00)</small>
            </div>

            <div>
              <label htmlFor="srv-prazo">
                Prazo (dias) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="srv-prazo"
                type="text"
                placeholder="0"
                value={formData.prazo_dias}
                onChange={(e) => handlePrazoChange(e.target.value)}
                required
              />
              <small className="hint">Número de dias úteis</small>
            </div>
          </div>
        </fieldset>

        <div className="actions">
          <button type="submit" className="btn btn-ok" disabled={loading}>
            {loading ? 'Cadastrando...' : '✓ Cadastrar Serviço'}
          </button>
          <button type="button" className="btn btn-alt" onClick={handleClear} disabled={loading}>
            Limpar
          </button>
          <a href="#home" className="btn">
            ← Voltar
          </a>
        </div>

        {message.text && (
          <p className={`msg ${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>
            {message.text}
          </p>
        )}
      </form>
    </main>
  );
};

export default CadastroServicoPage;