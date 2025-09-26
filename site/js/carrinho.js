(function(){
    'use strict';
    
    // ===== ELEMENTOS DO DOM =====
    const tblBody = document.querySelector('#tblSolic tbody');
    const selectServico = document.getElementById('sv');
    const lblPreco = document.getElementById('lblPreco');
    const lblPrazo = document.getElementById('lblPrazo');
    const lblDataPrev = document.getElementById('lblDataPrev');
    const lblStatus = document.getElementById('lblStatus');
    const btnIncluir = document.getElementById('btnIncluirSolic');
    
    // Labels de usuário
    const lblNome = document.getElementById('lblNome');
    const lblLogin = document.getElementById('lblLogin');
    
    if (!selectServico || !tblBody) {
        console.error('Elementos obrigatórios não encontrados na página do carrinho');
        return;
    }
    
    // ===== DADOS DOS SERVIÇOS =====
    const servicosData = {
        DEV: { 
            nome: 'Desenvolvimento Web', 
            preco: 8000, 
            prazo: 20,
            descricao: 'Aplicação web completa com tecnologias modernas'
        },
        SEC: { 
            nome: 'Pentest Aplicação', 
            preco: 6500, 
            prazo: 7,
            descricao: 'Auditoria de segurança e testes de penetração'
        },
        CLOUD: { 
            nome: 'Migração para Cloud', 
            preco: 9000, 
            prazo: 30,
            descricao: 'Migração completa para infraestrutura em nuvem'
        },
        SUP: { 
            nome: 'Suporte Infraestrutural', 
            preco: 1200, 
            prazo: 3,
            descricao: 'Suporte técnico especializado 24/7'
        }
    };
    
    // ===== FUNÇÕES UTILITÁRIAS =====
    
    /**
     * Atualiza os valores exibidos baseado no serviço selecionado
     */
    function atualizarValores() {
        const servicoKey = selectServico.value;
        const servico = servicosData[servicoKey];
        
        if (!servico) return;
        
        lblPreco.textContent = window.Fog.formatCurrency ? 
            window.Fog.formatCurrency(servico.preco) : 
            `R$ ${servico.preco.toFixed(2).replace('.', ',')}`;
        
        // Atualizar prazo
        lblPrazo.textContent = `${servico.prazo} dias`;
        
        // Calcular e exibir data prevista
        const dataAtual = new Date();
        const dataPrevista = window.Fog.addDays(dataAtual, servico.prazo);
        lblDataPrev.textContent = formatarDataBrasileira(dataPrevista);
        
        // Status sempre "EM ELABORAÇÃO" para novas solicitações
        lblStatus.textContent = 'EM ELABORAÇÃO';
        
        // Adicionar feedback visual
        lblPreco.style.transform = 'scale(1.05)';
        lblPrazo.style.transform = 'scale(1.05)';
        lblDataPrev.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            lblPreco.style.transform = 'scale(1)';
            lblPrazo.style.transform = 'scale(1)';
            lblDataPrev.style.transform = 'scale(1)';
        }, 200);
    }
    
    /**
     * @param {Date} date 
     * @returns {string}
     */
    function formatarDataBrasileira(date) {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    /**
     * Gera número único para solicitação
     * @returns {number}
     */
    function gerarNumeroSolicitacao() {
        return Math.floor(1000 + Math.random() * 9000);
    }
    
    /**
     * Adiciona nova linha à tabela de solicitações
     * @param {object} solicitacao 
     */
    function adicionarLinhaSolicitacao(solicitacao) {
        const tr = document.createElement('tr');
        tr.style.opacity = '0';
        tr.style.transform = 'translateX(-20px)';
        
        const statusClass = solicitacao.status.toLowerCase().replace(/\s+/g, '-');
        
        tr.innerHTML = `
            <td>${formatarDataBrasileira(new Date(solicitacao.dataPedido))}</td>
            <td><strong>#${solicitacao.numero}</strong></td>
            <td>${solicitacao.servico}</td>
            <td><span class="status ${statusClass}">${solicitacao.status}</span></td>
            <td>${window.Fog.formatCurrency ? 
                window.Fog.formatCurrency(solicitacao.preco) : 
                `R$ ${solicitacao.preco.toFixed(2).replace('.', ',')}`}</td>
            <td>${formatarDataBrasileira(new Date(solicitacao.dataPrevista))}</td>
            <td>
                <button class="btn btn-danger btn-sm bt-del" title="Excluir solicitação">
                    🗑️ Excluir
                </button>
            </td>
        `;
        
        // Event listener para botão excluir
        const btnDelete = tr.querySelector('.bt-del');
        btnDelete.addEventListener('click', function() {
            if (confirm(`Deseja realmente excluir a solicitação #${solicitacao.numero}?`)) {
                excluirSolicitacao(tr, solicitacao);
            }
        });
        
        tblBody.appendChild(tr);
        
        // Animação de entrada
        setTimeout(() => {
            tr.style.transition = 'all 0.3s ease';
            tr.style.opacity = '1';
            tr.style.transform = 'translateX(0)';
        }, 50);
        
        // Salvar no localStorage
        salvarSolicitacoes();
    }
    
    /**
     * Remove solicitação da tabela e localStorage
     * @param {HTMLElement} tr 
     * @param {object} solicitacao 
     */
    function excluirSolicitacao(tr, solicitacao) {
        // Animação de saída
        tr.style.transition = 'all 0.3s ease';
        tr.style.opacity = '0';
        tr.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            tr.remove();
            salvarSolicitacoes();
            window.Fog.showToast('Solicitação excluída', 'info');
        }, 300);
    }
    
    /**
     * Salva todas as solicitações no localStorage
     */
    function salvarSolicitacoes() {
        const solicitacoes = [];
        const rows = tblBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 6) {
                solicitacoes.push({
                    dataPedido: cells[0].textContent,
                    numero: cells[1].textContent.replace('#', ''),
                    servico: cells[2].textContent,
                    status: cells[3].textContent,
                    preco: cells[4].textContent,
                    dataPrevista: cells[5].textContent
                });
            }
        });
        
        try {
            localStorage.setItem('fogtech_solicitacoes', JSON.stringify(solicitacoes));
        } catch (error) {
            console.error('Erro ao salvar solicitações:', error);
        }
    }
    
    /**
     * Carrega solicitações do localStorage
     */
    function carregarSolicitacoes() {
        try {
            const solicitacoesSalvas = localStorage.getItem('fogtech_solicitacoes');
            if (solicitacoesSalvas) {
                const solicitacoes = JSON.parse(solicitacoesSalvas);
                solicitacoes.forEach(sol => {
                    // Reconstruir objeto de solicitação
                    const solicitacao = {
                        dataPedido: sol.dataPedido,
                        numero: sol.numero,
                        servico: sol.servico,
                        status: sol.status,
                        preco: parseFloat(sol.preco.replace(/[R$\s.]/g, '').replace(',', '.')),
                        dataPrevista: sol.dataPrevista
                    };
                    adicionarLinhaSolicitacao(solicitacao);
                });
            } else {
                // Carregar dados mock se não houver dados salvos
                carregarDadosMock();
            }
        } catch (error) {
            console.error('Erro ao carregar solicitações:', error);
            carregarDadosMock();
        }
    }
    
    /**
     * Carrega dados fictícios para demonstração
     */
    function carregarDadosMock() {
        const mockData = [
            {
                dataPedido: '2025-09-01',
                numero: 1001,
                servico: 'Desenvolvimento Web',
                status: 'EM ANDAMENTO',
                preco: 7500,
                dataPrevista: '2025-09-25'
            },
            {
                dataPedido: '2025-09-10',
                numero: 1002,
                servico: 'Pentest Aplicação',
                status: 'APROVADO',
                preco: 6400,
                dataPrevista: '2025-09-20'
            }
        ];
        
        // Ordenar por data crescente
        const dadosOrdenados = window.Fog.sortByDateAsc ? 
            window.Fog.sortByDateAsc(mockData) : 
            mockData.sort((a, b) => new Date(a.dataPedido) - new Date(b.dataPedido));
        
        dadosOrdenados.forEach(item => {
            adicionarLinhaSolicitacao(item);
        });
    }
    
    /**
     * Cria nova solicitação baseada nos dados do formulário
     */
    function criarNovaSolicitacao() {
        const servicoKey = selectServico.value;
        const servico = servicosData[servicoKey];
        
        if (!servico) {
            window.Fog.showToast('Selecione um serviço válido', 'error');
            return;
        }
        
        const hoje = new Date();
        const dataPrevista = window.Fog.addDays(hoje, servico.prazo);
        
        const novaSolicitacao = {
            dataPedido: hoje.toISOString().split('T')[0],
            numero: gerarNumeroSolicitacao(),
            servico: servico.nome,
            status: 'EM ELABORAÇÃO',
            preco: servico.preco,
            dataPrevista: dataPrevista.toISOString().split('T')[0]
        };
        
        adicionarLinhaSolicitacao(novaSolicitacao);
        
        // Feedback para o usuário
        window.Fog.showToast(`Solicitação #${novaSolicitacao.numero} criada!`, 'success');
        
        // Scroll para a tabela para mostrar a nova linha
        const tabela = document.getElementById('tblSolic');
        if (tabela) {
            tabela.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    /**
     * Carrega informações do usuário logado
     */
    function carregarInfoUsuario() {
        const user = window.Fog.getUser();
        
        if (user) {
            if (lblNome) lblNome.textContent = user.nome || 'Usuário Logado';
            if (lblLogin) lblLogin.textContent = user.email || 'usuario@exemplo.com';
            
            // Remover hint sobre valores fixos
            const hint = document.querySelector('.hint');
            if (hint) {
                hint.textContent = '(Dados do usuário logado)';
            }
        }
    }
    
    // ===== EVENT LISTENERS =====
    
    // Mudança no select de serviços
    selectServico.addEventListener('change', atualizarValores);
    
    // Botão incluir solicitação
    if (btnIncluir) {
        btnIncluir.addEventListener('click', criarNovaSolicitacao);
    }
    
    // ===== INICIALIZAÇÃO =====
    document.addEventListener('DOMContentLoaded', function() {
        // Verificar se usuário está logado
        const user = window.Fog.getUser();
        if (!user) {
            window.Fog.showToast('Você precisa estar logado para acessar esta página', 'error');
            setTimeout(() => {
                window.location.href = 'login.html?redirect=carrinho.html';
            }, 2000);
            return;
        }
        
        // Carregar informações do usuário
        carregarInfoUsuario();
        
        // Atualizar valores iniciais
        atualizarValores();
        
        // Carregar solicitações existentes
        carregarSolicitacoes();
        
        // Animações de entrada
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
        
        // Adicionar indicador visual para campos obrigatórios
        selectServico.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
        });
        
        selectServico.addEventListener('blur', function() {
            this.style.boxShadow = '';
        });
    });
    
    // ===== FUNCIONALIDADES EXTRAS =====
    
    // Atalhos de teclado
    document.addEventListener('keydown', function(e) {
        // Ctrl + N para nova solicitação
        if (e.ctrlKey && e.key.toLowerCase() === 'n') {
            e.preventDefault();
            criarNovaSolicitacao();
        }
        
        // Ctrl + L para limpar tabela (com confirmação)
        if (e.ctrlKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            if (confirm('Deseja limpar todas as solicitações?')) {
                tblBody.innerHTML = '';
                salvarSolicitacoes();
                window.Fog.showToast('Todas as solicitações foram removidas', 'info');
            }
        }
    });
    
    // Auto-save periódico
    setInterval(salvarSolicitacoes, 30000); // Salvar a cada 30 segundos
    
    // Salvar antes de sair da página
    window.addEventListener('beforeunload', function() {
        salvarSolicitacoes();
    });
    
    // Feedback visual para hover em linhas da tabela
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TR') {
                        node.addEventListener('mouseenter', function() {
                            this.style.backgroundColor = 'rgba(14, 165, 233, 0.05)';
                            this.style.transform = 'translateX(2px)';
                        });
                        
                        node.addEventListener('mouseleave', function() {
                            this.style.backgroundColor = '';
                            this.style.transform = 'translateX(0)';
                        });
                    }
                });
            }
        });
    });
    
    observer.observe(tblBody, { childList: true });
    
})();