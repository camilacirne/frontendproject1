(function(){
    'use strict';
    
    // ===== ELEMENTOS DO DOM =====
    const form = document.getElementById('formTroca');
    const msgElement = document.getElementById('trocaMsg');
    const btnLimpar = document.getElementById('btnLimparTroca');
    const btnVoltar = document.getElementById('btnVoltarTroca');
    
    const emailInput = document.getElementById('ts-email');
    const senhaInput = document.getElementById('ts-senha');
    const confirmInput = document.getElementById('ts-conf');
    
    if (!form || !msgElement || !emailInput || !senhaInput || !confirmInput) {
        console.error('Elementos obrigatórios não encontrados na página de troca de senha');
        return;
    }
    
    // ===== FUNÇÕES UTILITÁRIAS =====
    
    /**
     * Exibe mensagem para o usuário
     * @param {string} text - Texto da mensagem
     * @param {boolean} isSuccess - Se é mensagem de sucesso
     */
    function setMessage(text, isSuccess = false) {
        msgElement.textContent = text;
        msgElement.className = `msg ${isSuccess ? 'ok' : 'error'}`;
        msgElement.setAttribute('role', isSuccess ? 'status' : 'alert');
        
        // Auto-clear mensagens de erro após alguns segundos
        if (!isSuccess) {
            setTimeout(() => {
                if (msgElement.classList.contains('error')) {
                    clearMessage();
                }
            }, 8000);
        }
    }
    
    /**
     * Limpa a mensagem exibida
     */
    function clearMessage() {
        msgElement.textContent = '';
        msgElement.className = 'msg';
        msgElement.removeAttribute('role');
    }
    
    /**
     * Valida todos os campos do formulário
     * @returns {boolean} True se válido, false caso contrário
     */
    function validarFormulario() {
        clearMessage();
        
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        const confirmacao = confirmInput.value.trim();
        
        // Validar email
        if (!email) {
            setMessage('O campo login (e-mail) deve ser preenchido.');
            emailInput.focus();
            return false;
        }
        
        if (!window.Fog.isEmail(email)) {
            setMessage('O login deve ter formato de e-mail válido.');
            emailInput.focus();
            return false;
        }
        
        // Validar senha
        if (!senha) {
            setMessage('A nova senha deve ser preenchida.');
            senhaInput.focus();
            return false;
        }
        
        const validacaoSenha = window.Fog.validPassword(senha);
        if (!validacaoSenha.ok) {
            setMessage(validacaoSenha.msg);
            senhaInput.focus();
            return false;
        }
        
        // Validar confirmação
        if (!confirmacao) {
            setMessage('A confirmação de senha deve ser preenchida.');
            confirmInput.focus();
            return false;
        }
        
        if (senha !== confirmacao) {
            setMessage('A senha e a confirmação devem ser idênticas.');
            confirmInput.focus();
            return false;
        }
        
        return true;
    }
    
    /**
     * Simula processo de troca de senha
     * @param {string} email 
     * @param {string} novaSenha 
     */
    function realizarTrocaSenha(email, novaSenha) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processando...';
        
        // Simular delay de rede e validação
        setTimeout(() => {
            try {
                // Em um sistema real, aqui faria verificação se o email existe
                // e enviaria um código de verificação, etc.
                
                // Para este projeto acadêmico, simular sucesso
                const usuarios = JSON.parse(localStorage.getItem('fogtech_usuarios') || '[]');
                const usuarioIndex = usuarios.findIndex(user => user.email === email);
                
                if (usuarioIndex === -1) {
                    setMessage('E-mail não encontrado em nosso sistema.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    emailInput.focus();
                    return;
                }
                
                // Simular atualização da senha (em sistema real seria hash)
                usuarios[usuarioIndex].senha = novaSenha; // Apenas para demo
                usuarios[usuarioIndex].ultimaTrocaSenha = new Date().toISOString();
                
                localStorage.setItem('fogtech_usuarios', JSON.stringify(usuarios));
                
                setMessage('Senha alterada com sucesso! Você será redirecionado.', true);
                window.Fog.showToast('Senha atualizada com sucesso!', 'success');
                
                // Redirecionar após sucesso
                setTimeout(() => {
                    // Voltar para página anterior ou login se não houver histórico
                    if (window.history.length > 1) {
                        window.history.back();
                    } else {
                        window.location.href = 'login.html';
                    }
                }, 2000);
                
            } catch (error) {
                console.error('Erro na troca de senha:', error);
                setMessage('Erro interno. Tente novamente mais tarde.');
                
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }, 1200);
    }
    
    /**
     * Limpa todos os campos do formulário
     */
    function limparFormulario() {
        emailInput.value = '';
        senhaInput.value = '';
        confirmInput.value = '';
        clearMessage();
        
        // Limpar indicadores visuais
        [emailInput, senhaInput, confirmInput].forEach(input => {
            input.style.borderColor = '';
        });
        
        emailInput.focus();
        window.Fog.showToast('Formulário limpo', 'info');
    }
    
    /**
     * Verifica força da senha em tempo real
     * @param {string} senha 
     * @returns {object}
     */
    function verificarForcaSenha(senha) {
        let pontuacao = 0;
        const requisitos = {
            tamanho: senha.length >= 6,
            numero: /\d/.test(senha),
            maiuscula: /[A-Z]/.test(senha),
            especial: new RegExp(`[${window.Fog.ALLOWED.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(senha),
            proibidos: !new RegExp(`[${window.Fog.FORBIDDEN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(senha)
        };
        
        Object.values(requisitos).forEach(atende => {
            if (atende) pontuacao++;
        });
        
        let nivel = 'fraca';
        let cor = '#ef4444';
        
        if (pontuacao >= 4) {
            nivel = 'forte';
            cor = '#10b981';
        } else if (pontuacao >= 3) {
            nivel = 'média';
            cor = '#f59e0b';
        }
        
        return { nivel, cor, pontuacao, requisitos };
    }
    
    /**
     * Cria indicador visual de força da senha
     */
    function criarIndicadorForca() {
        const indicador = document.createElement('div');
        indicador.id = 'senha-strength';
        indicador.style.cssText = `
            margin-top: 8px;
            padding: 8px 12px;
            border-radius: 6px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            font-size: 0.875rem;
            display: none;
        `;
        
        senhaInput.parentNode.appendChild(indicador);
        return indicador;
    }
    
    // ===== EVENT LISTENERS =====
    
    // Submit do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormulario()) {
            const email = emailInput.value.trim();
            const senha = senhaInput.value.trim();
            
            realizarTrocaSenha(email, senha);
        }
    });
    
    // Botão limpar
    if (btnLimpar) {
        btnLimpar.addEventListener('click', limparFormulario);
    }

    // Botão voltar
    if (btnVoltar) {
    btnVoltar.addEventListener('click', function() {
        if (emailInput.value || senhaInput.value || confirmInput.value) {
            if (confirm('Deseja realmente voltar? Os dados preenchidos serão perdidos.')) {
                window.history.back();
            }
        } else {
            window.history.back();
        }
    });
}
    
    // Validação em tempo real
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !window.Fog.isEmail(email)) {
            setMessage('Formato de e-mail inválido.');
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '';
        }
    });
    
    // Indicador de força da senha
    const indicadorForca = criarIndicadorForca();
    
    senhaInput.addEventListener('input', function() {
        const senha = this.value;
        
        if (!senha) {
            indicadorForca.style.display = 'none';
            return;
        }
        
        const analise = verificarForcaSenha(senha);
        
        indicadorForca.style.display = 'block';
        indicadorForca.style.borderColor = analise.cor;
        indicadorForca.innerHTML = `
            <div style="color: ${analise.cor}; font-weight: 600; margin-bottom: 4px;">
                Força da senha: ${analise.nivel.toUpperCase()}
            </div>
            <div style="font-size: 0.8rem; color: #64748b;">
                ${analise.requisitos.tamanho ? '✓' : '✗'} Pelo menos 6 caracteres<br>
                ${analise.requisitos.numero ? '✓' : '✗'} Pelo menos 1 número<br>
                ${analise.requisitos.maiuscula ? '✓' : '✗'} Pelo menos 1 maiúscula<br>
                ${analise.requisitos.especial ? '✓' : '✗'} Pelo menos 1 caractere especial<br>
                ${analise.requisitos.proibidos ? '✓' : '✗'} Sem caracteres proibidos
            </div>
        `;
    });
    
    // Confirmação de senha em tempo real
    confirmInput.addEventListener('input', function() {
        const senha = senhaInput.value;
        const confirmacao = this.value;
        
        if (confirmacao && senha && confirmacao !== senha) {
            this.style.borderColor = '#ef4444';
        } else if (confirmacao && senha && confirmacao === senha) {
            this.style.borderColor = '#10b981';
        } else {
            this.style.borderColor = '';
        }
    });
    
    // Limpar mensagens de erro quando usuário corrigir
    [emailInput, senhaInput, confirmInput].forEach(input => {
        input.addEventListener('input', function() {
            if (msgElement.classList.contains('error')) {
                clearMessage();
            }
        });
    });
    
    // ===== INICIALIZAÇÃO =====
    document.addEventListener('DOMContentLoaded', function() {
        // Focar no primeiro campo
        emailInput.focus();
        
        // Animação de entrada
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Pré-preencher email se usuário estiver logado
        const user = window.Fog.getUser();
        if (user && user.email) {
            emailInput.value = user.email;
            senhaInput.focus();
        }
        
        emailInput.title = 'Digite o e-mail da conta que deseja alterar a senha';
        senhaInput.title = 'Digite a nova senha seguindo as regras mostradas';
        confirmInput.title = 'Digite novamente a nova senha para confirmação';
    });
    
    // ===== MELHORIAS DE ACESSIBILIDADE =====
    
    // Atalhos de teclado
    document.addEventListener('keydown', function(e) {
        // ESC para limpar formulário
        if (e.key === 'Escape') {
            if (confirm('Limpar todos os campos?')) {
                limparFormulario();
            }
        }
        
        // Ctrl+Enter para submit rápido
        if (e.ctrlKey && e.key === 'Enter') {
            form.dispatchEvent(new Event('submit'));
        }
        
        // F1 para mostrar/ocultar regras de senha
        if (e.key === 'F1') {
            e.preventDefault();
            const regras = document.querySelector('.password-rules');
            if (regras) {
                regras.style.display = regras.style.display === 'none' ? 'block' : 'none';
            }
        }
    });
    
    // Melhorar feedback para leitores de tela
    senhaInput.setAttribute('aria-describedby', 'senha-strength password-rules');
    
    // Adicionar live region para anúncios importantes
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(liveRegion);
    
    // Anunciar mudanças importantes para leitores de tela
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target === msgElement && msgElement.textContent) {
                liveRegion.textContent = msgElement.textContent;
            }
        });
    });
    
    observer.observe(msgElement, { childList: true, subtree: true });
    
})();