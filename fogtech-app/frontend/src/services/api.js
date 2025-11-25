// ========================================
// API SERVICE - Chamadas HTTP para o Backend
// ========================================

const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  // ========================================
  // MÉTODOS AUXILIARES
  // ========================================
  
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

  // ========================================
  // AUTENTICAÇÃO
  // ========================================

  /**
   * Realiza login do usuário
   * @param {string} email 
   * @param {string} senha 
   * @returns {Promise<Object>} { status, mensagem, cliente }
   */
  async login(email, senha) {
    return await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
  }

  /**
   * Troca a senha do usuário
   * @param {string} email 
   * @param {string} senha_atual 
   * @param {string} nova_senha 
   * @returns {Promise<Object>} { status, mensagem }
   */
  async trocarSenha(email, senha_atual, nova_senha) {
    return await this.request('/auth/trocar-senha', {
      method: 'POST',
      body: JSON.stringify({ email, senha_atual, nova_senha }),
    });
  }

  // ========================================
  // CLIENTES
  // ========================================

  /**
   * Cadastra um novo cliente
   * @param {Object} dadosCliente 
   * @returns {Promise<Object>} { status, mensagem, cliente_id }
   */
  async cadastrarCliente(dadosCliente) {
    return await this.request('/clientes', {
      method: 'POST',
      body: JSON.stringify(dadosCliente),
    });
  }

  // ========================================
  // SERVIÇOS DE TI
  // ========================================

  /**
   * Lista todos os serviços de TI
   * @returns {Promise<Object>} { status, servicos }
   */
  async listarServicos() {
    return await this.request('/servicos', {
      method: 'GET',
    });
  }

  /**
   * Cadastra um novo serviço de TI
   * @param {Object} dadosServico 
   * @returns {Promise<Object>} { status, mensagem, servico_id }
   */
  async cadastrarServico(dadosServico) {
    return await this.request('/servicos', {
      method: 'POST',
      body: JSON.stringify(dadosServico),
    });
  }

  // ========================================
  // SOLICITAÇÕES
  // ========================================

  /**
   * Lista solicitações de um usuário
   * @param {string} email 
   * @returns {Promise<Object>} { status, solicitacoes }
   */
  async listarSolicitacoes(email) {
    return await this.request(`/solicitacoes/${encodeURIComponent(email)}`, {
      method: 'GET',
    });
  }

  /**
   * Atualiza solicitações de um usuário
   * @param {string} email 
   * @param {Array} solicitacoes 
   * @returns {Promise<Object>} { status, mensagem }
   */
  async atualizarSolicitacoes(email, solicitacoes) {
    return await this.request('/solicitacoes/atualizar', {
      method: 'POST',
      body: JSON.stringify({ email, solicitacoes }),
    });
  }
}

// Exportar instância única
const apiService = new ApiService();
export default apiService;

// Também exportar a classe para testes
export { ApiService };