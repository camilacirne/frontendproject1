import { useState, useEffect } from 'react';
import apiService from '../services/api';
import FogUtils from '../utils/FogUtils';

function CarrinhoPage({ user, onNavigate, showToast }) {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, [user]);

  const carregarDados = async () => {
    try {
      setLoading(true);

      const resServicos = await apiService.listarServicos();
      console.log('Serviços carregados:', resServicos);
      
      if (resServicos.servicos && resServicos.servicos.length > 0) {
        setServicos(resServicos.servicos);
        setServicoSelecionado(resServicos.servicos[0].codigo);
      }

      if (user?.email) {
        const resSolicitacoes = await apiService.listarSolicitacoes(user.email);
        console.log('Solicitações carregadas:', resSolicitacoes);
        
        if (resSolicitacoes.solicitacoes) {
          setSolicitacoes(resSolicitacoes.solicitacoes);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showToast('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  };

  const servico = servicos.find(s => s.codigo === servicoSelecionado);
  const dataPrevista = servico ? FogUtils.addDays(new Date(), servico.prazo_dias) : new Date();

  const handleIncluir = async () => {
    if (!servico) {
      showToast('Selecione um serviço', 'error');
      return;
    }

    try {
      let numeroSolicitacao;
      do {
        numeroSolicitacao = Math.floor(1000 + Math.random() * 9000);
      } while (solicitacoes.some(s => s.numero_solicitacao === numeroSolicitacao));

      const novaSolicitacao = {
        id: Date.now(),
        numero_solicitacao: numeroSolicitacao,
        servico_codigo: servico.codigo,
        servico_nome: servico.nome,
        servico_ti_id: servico.id,
        status: 'EM ELABORAÇÃO',
        data_pedido: new Date().toISOString().split('T')[0],
        data_prevista: dataPrevista.toISOString().split('T')[0],
        preco: servico.preco
      };

      const novasSolicitacoes = [...solicitacoes, novaSolicitacao];

      const solicitacoesParaApi = novasSolicitacoes.map(sol => ({
        servico_ti_id: sol.servico_ti_id,
        numero_solicitacao: sol.numero_solicitacao.toString(),
        status: sol.status || 'Pendente',
        data_pedido: sol.data_pedido,
        data_prevista: sol.data_prevista,
        preco: parseFloat(sol.preco)
      }));

      await apiService.atualizarSolicitacoes(user.email, solicitacoesParaApi);
      setSolicitacoes(novasSolicitacoes);
      showToast(`Solicitação #${novaSolicitacao.numero_solicitacao} adicionada!`, 'success');
    } catch (error) {
      console.error('❌ Erro ao incluir:', error);
      showToast(error.message || 'Erro ao incluir solicitação', 'error');
    }
  };

  const handleExcluir = async (numero) => {
    if (window.confirm(`Deseja excluir a solicitação #${numero}?`)) {
      try {
        const novasSolicitacoes = solicitacoes.filter(s => s.numero_solicitacao !== numero);
        
        const solicitacoesParaApi = novasSolicitacoes.map(sol => {
          let servicoId = sol.servico_ti_id;
          
          if (!servicoId) {
            const servicoEncontrado = servicos.find(s => s.codigo === sol.servico_codigo);
            if (!servicoEncontrado) {
              throw new Error(`Serviço ${sol.servico_codigo} não encontrado`);
            }
            servicoId = servicoEncontrado.id;
          }
          
          return {
            servico_ti_id: servicoId,
            numero_solicitacao: sol.numero_solicitacao.toString(),
            status: sol.status || 'Pendente',
            data_pedido: sol.data_pedido,
            data_prevista: sol.data_prevista,
            preco: parseFloat(sol.preco)
          };
        });

        await apiService.atualizarSolicitacoes(user.email, solicitacoesParaApi);
        setSolicitacoes(novasSolicitacoes);
        showToast('Solicitação excluída com sucesso!', 'success');
      } catch (error) {
        console.error('❌ Erro ao excluir:', error);
        showToast(error.message || 'Erro ao excluir solicitação', 'error');
      }
    }
  };

  if (loading) {
    return (
      <main className="container">
        <div className="card">
          <p style={{ textAlign: 'center', padding: '2rem' }}>⏳ Carregando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <section className="card">
        <h2>Cliente</h2>
        <p>Nome: <strong>{user?.nome || 'Usuário'}</strong></p>
        <p>Email: <strong>{user?.email || 'usuario@fogtech.com.br'}</strong></p>
      </section>

      <section className="card">
        <h2>Solicitações existentes</h2>
        <table className="tabela-solic">
          <thead>
            <tr>
              <th>Data</th>
              <th>Nº</th>
              <th>Serviço</th>
              <th>Status</th>
              <th>Preço</th>
              <th>Previsão</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {solicitacoes.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  📋 Nenhuma solicitação ainda. Use o formulário abaixo para adicionar.
                </td>
              </tr>
            ) : (
              solicitacoes.map((sol) => (
                <tr key={sol.id || sol.numero_solicitacao}>
                  <td>{FogUtils.formatDate(sol.data_pedido)}</td>
                  <td><strong>#{sol.numero_solicitacao}</strong></td>
                  <td>{sol.servico_nome}</td>
                  <td>
                    <span className="status" style={{
                      background: sol.status === 'EM ELABORAÇÃO' ? '#fef3c7' : '#e0f2fe',
                      color: sol.status === 'EM ELABORAÇÃO' ? '#92400e' : '#0369a1'
                    }}>
                      {sol.status}
                    </span>
                  </td>
                  <td>{FogUtils.formatCurrency(sol.preco)}</td>
                  <td>{FogUtils.formatDate(sol.data_prevista)}</td>
                  <td>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleExcluir(sol.numero_solicitacao)}
                      title="Excluir solicitação"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="card form">
        <h2>Nova solicitação</h2>
        
        <div className="field">
          <label htmlFor="sv">Serviço de TI</label>
          <select
            id="sv"
            value={servicoSelecionado || ''}
            onChange={(e) => setServicoSelecionado(e.target.value)}
          >
            {servicos.map(s => (
              <option key={s.codigo} value={s.codigo}>
                {s.nome}
              </option>
            ))}
          </select>
        </div>

        {servico && (
          <>
            <div className="field two">
              <div>
                <label>Preço</label>
                <span className="pill">{FogUtils.formatCurrency(servico.preco)}</span>
              </div>
              <div>
                <label>Prazo</label>
                <span className="pill">{servico.prazo_dias} dias</span>
              </div>
            </div>

            <div className="field">
              <label>Data prevista</label>
              <span className="pill">{FogUtils.formatDate(dataPrevista)}</span>
            </div>
          </>
        )}

        <div className="actions">
          <button className="btn btn-ok" onClick={handleIncluir}>
            + Adicionar Solicitação
          </button>
        </div>
      </section>
    </main>
  );
}

export default CarrinhoPage;
