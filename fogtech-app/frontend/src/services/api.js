const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.mensagem || 'Erro na requisição');
    }
    
    return data;
  }

  async request(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Erro na requisição ${endpoint}:`, error);
      throw error;
    }
  }

  async login(email, senha) {
    return await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
  }

  async trocarSenha(email, senha_atual, nova_senha) {
    return await this.request('/auth/trocar-senha', {
      method: 'POST',
      body: JSON.stringify({ email, senha_atual, nova_senha }),
    });
  }

  async cadastrarCliente(dadosCliente) {
    return await this.request('/clientes', {
      method: 'POST',
      body: JSON.stringify(dadosCliente),
    });
  }

  async listarServicos() {
    return await this.request('/servicos', {
      method: 'GET',
    });
  }

  async cadastrarServico(dadosServico) {
    return await this.request('/servicos', {
      method: 'POST',
      body: JSON.stringify(dadosServico),
    });
  }

  async listarSolicitacoes(email) {
    return await this.request(`/solicitacoes/${encodeURIComponent(email)}`, {
      method: 'GET',
    });
  }

  async atualizarSolicitacoes(email, solicitacoes) {
    return await this.request('/solicitacoes/atualizar', {
      method: 'POST',
      body: JSON.stringify({ email, solicitacoes }),
    });
  }
}

const apiService = new ApiService();
export default apiService;

export { ApiService };