(function(){
    'use strict';
    
    // ===== ELEMENTOS DO DOM =====
    const form = document.getElementById('formLogin');
    const msgElement = document.getElementById('loginMsg');
    const btnLimpar = document.getElementById('btnLimparLogin');
    const emailInput = document.getElementById('lg-email');
    const senhaInput = document.getElementById('lg-senha');
    
    if (!form || !msgElement || !emailInput || !senhaInput) {
        console.error('Elementos obrigatórios não encontrados na página de login');
        return;
    }
    
    // ===== FUNÇÕES UTILITÁRIAS =====
    
    /**
     * @param {string} text 
     * @param {boolean} isSuccess
     */
    function setMessage(text, isSuccess = false) {
        msgElement.textContent = text;
        msgElement.className = `msg ${isSuccess ? 'ok' : 'error'}`;
        
        msgElement.setAttribute('role', isSuccess ? 'status' : 'alert');
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
     * Valida os campos do formulário
     * @returns {boolean} True se válido, false caso contrário
     */
    function validateForm() {
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        
        clearMessage();
        
        // Validar email
        if (!email) {
            setMessage('O campo login deve ser preenchido.');
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
            setMessage('A senha deve ser preenchida.');
            senhaInput.focus();
            return false;
        }
        
        return true;
    }
    
    /**
     * Simula processo de login
     * @param {string} email 
     * @param {string} senha 
     */
    function performLogin(email, senha) {
        // Adicionar loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Entrando...';
        
  
        setTimeout(() => {
            try {
                
                window.Fog.saveUser(email, {
                    loginMethod: 'form',
                    userAgent: navigator.userAgent,
                    timestamp: Date.now()
                });
                
                setMessage('Login realizado com sucesso! Redirecionando...', true);
                
                window.Fog.showToast('Bem-vindo(a) de volta!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } catch (error) {
                console.error('Erro no login:', error);
                setMessage('Erro interno. Tente novamente.');
                
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }, 800);
    }
    
    /**
     * Limpa todos os campos do formulário
     */
    function clearForm() {
        emailInput.value = '';
        senhaInput.value = '';
        clearMessage();
        emailInput.focus();
        
        // Feedback visual
        window.Fog.showToast('Campos limpos', 'info');
    }
    
    // ===== EVENT LISTENERS =====
    
    // Submit do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const email = emailInput.value.trim();
            const senha = senhaInput.value.trim();
            
            performLogin(email, senha);
        }
    });
    
    // Botão limpar
    if (btnLimpar) {
        btnLimpar.addEventListener('click', clearForm);
    }
    
    // Validação em tempo real 
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !window.Fog.isEmail(email)) {
            setMessage('Formato de e-mail inválido.');
        } else if (msgElement.textContent.includes('e-mail inválido')) {
            clearMessage();
        }
    });
    
    senhaInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            form.dispatchEvent(new Event('submit'));
        }
    });
    
    [emailInput, senhaInput].forEach(input => {
        input.addEventListener('input', function() {
            if (msgElement.classList.contains('error')) {
                clearMessage();
            }
        });
    });
    
    // ===== INICIALIZAÇÃO =====
    document.addEventListener('DOMContentLoaded', function() {
        const user = window.Fog.getUser();
        if (user) {
            setMessage('Você já está logado. Redirecionando...', true);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }
        
        emailInput.focus();
        
        form.style.opacity = '0';
        form.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            form.style.transition = 'all 0.4s ease';
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';
        }, 100);
        
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect');
        
        if (redirectUrl) {
            const hint = document.querySelector('.hint');
            if (hint) {
                hint.innerHTML += `<br><small style="color: #f59e0b;">Você será redirecionado após o login.</small>`;
            }
            
            const originalPerformLogin = performLogin;
            performLogin = function(email, senha) {
                setTimeout(() => {
                    const validPages = ['index.html', 'carrinho.html', 'cadastro.html'];
                    const targetPage = validPages.includes(redirectUrl) ? redirectUrl : 'index.html';
                    window.location.href = targetPage;
                }, 1500);
            };
        }
    });
    
    // ===== ACCESSIBILITY IMPROVEMENTS =====
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && msgElement.textContent) {
                msgElement.setAttribute('aria-live', 'polite');
            }
        });
    });
    
    observer.observe(msgElement, { childList: true, subtree: true });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            clearForm();
        }
        
        if (e.ctrlKey && e.key === 'Enter') {
            form.dispatchEvent(new Event('submit'));
        }
    });
    
})();