(function(){
    'use strict';
    
    // ===== ELEMENTOS DO DOM =====
    const form = document.getElementById('formCadastro');
    const msgElement = document.getElementById('cadMsg');
    const btnLimpar = document.getElementById('btnLimparCad');
    const btnVoltar = document.getElementById('btnVoltarCad');
    
    // Campos do formulário
    const emailInput = document.getElementById('cd-email');
    const senhaInput = document.getElementById('cd-senha');
    const confirmInput = document.getElementById('cd-conf');
    const nomeInput = document.getElementById('cd-nome');
    const cpfInput = document.getElementById('cd-cpf');
    const nascInput = document.getElementById('cd-nasc');
    const zapInput = document.getElementById('cd-zap');
    const escolarSelect = document.getElementById('cd-escolar');
    
    if (!form || !msgElement) {
        console.error('Elementos obrigatórios não encontrados na página de cadastro');
        return;
    }
    
    // ===== APLICAR MÁSCARAS =====
    if (cpfInput) {
        window.Fog.maskCPF(cpfInput);
    }
    
    // Máscara para telefone 
    if (zapInput) {
        zapInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            if (value.length > 10) {
                // Formato: (XX) 9XXXX-XXXX
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length > 5) {
                // Formato: (XX) XXXX-XXXX
                value = value.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d+)/, '($1) $2');
            }
            
            e.target.value = value;
        });
    }
    
    // ===== FUNÇÕES DE VALIDAÇÃO =====
    
    /**
     * Exibe mensagem para o usuário
     * @param {string} text - Texto da mensagem
     * @param {boolean} isSuccess - Se é mensagem de sucesso
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
     * Valida nome completo
     * @param {string} nome 
     * @returns {object} {ok: boolean, msg: string}
     */
    function validarNome(nome) {
        if (!nome || !nome.trim()) {
            return { ok: false, msg: 'O nome deve ser preenchido.' };
        }
        
        const nomeCompleto = nome.trim();
        const partes = nomeCompleto.split(/\s+/);
        
        if (partes.length < 2) {
            return { ok: false, msg: 'Informe nome e sobrenome.' };
        }
        
        if (partes[0].length < 2) {
            return { ok: false, msg: 'O primeiro nome deve ter pelo menos 2 caracteres.' };
        }
        
        // Verificar caracteres especiais proibidos
        const caracteresProibidos = (window.Fog.FORBIDDEN || '') + (window.Fog.ALLOWED || '');
        const escaped = caracteresProibidos.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');

        const regexProibidos = new RegExp('[' + escaped + ']', 'u');

        if (regexProibidos.test(nomeCompleto)) {
        return { ok: false, msg: 'O nome não pode conter caracteres especiais.' };
        }
        
        return { ok: true, msg: 'Nome válido.' };
    }
    
    /**
     * Valida todos os campos do formulário
     * @returns {boolean} True se válido, false caso contrário
     */
    function validarFormulario() {
        clearMessage();
        
        // Validar email
        const email = emailInput.value.trim();
        if (!email) {
            setMessage('O e-mail deve ser preenchido.');
            emailInput.focus();
            return false;
        }
        
        if (!window.Fog.isEmail(email)) {
            setMessage('O e-mail deve ter formato válido.');
            emailInput.focus();
            return false;
        }
        
        // Validar senha
        const senha = senhaInput.value;
        if (!senha) {
            setMessage('A senha deve ser preenchida.');
            senhaInput.focus();
            return false;
        }
        
        const validacaoSenha = window.Fog.validPassword(senha);
        if (!validacaoSenha.ok) {
            setMessage(validacaoSenha.msg);
            senhaInput.focus();
            return false;
        }
        
        // Validar confirmação de senha
        const confirmacao = confirmInput.value;
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
        
        // Validar nome
        const validacaoNome = validarNome(nomeInput.value);
        if (!validacaoNome.ok) {
            setMessage(validacaoNome.msg);
            nomeInput.focus();
            return false;
        }
        
        // Validar CPF
        const cpf = cpfInput.value;
        if (!cpf) {
            setMessage('O CPF deve ser preenchido.');
            cpfInput.focus();
            return false;
        }
        
        if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
            setMessage('O CPF deve estar no formato NNN.NNN.NNN-NN.');
            cpfInput.focus();
            return false;
        }
        
        if (!window.Fog.validaCPF(cpf)) {
            setMessage('CPF inválido. Verifique os dígitos.');
            cpfInput.focus();
            return false;
        }
        
        // Validar data de nascimento
        const nascimento = nascInput.value;
        if (!nascimento) {
            setMessage('A data de nascimento deve ser preenchida.');
            nascInput.focus();
            return false;
        }
        
        if (!window.Fog.isAdult(nascimento)) {
            setMessage('Cliente deve ser maior de idade (18+ anos).');
            nascInput.focus();
            return false;
        }
        
        // Validar telefone 
        const telefone = zapInput.value;
        if (telefone && !window.Fog.isPhoneBR(telefone)) {
            setMessage('Formato de telefone inválido. Use 10 ou 11 dígitos.');
            zapInput.focus();
            return false;
        }
        
        return true;
    }
    
    /**
     * Simula cadastro do usuário
     * @param {object} dadosUsuario 
     */
    function realizarCadastro(dadosUsuario) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Cadastrando...';
        
        // Simular delay de rede
        setTimeout(() => {
            try {
                // Simular salvamento 
                const usuarios = JSON.parse(localStorage.getItem('fogtech_usuarios') || '[]');
                
                // Verificar se email já existe
                if (usuarios.some(user => user.email === dadosUsuario.email)) {
                    setMessage('Este e-mail já está cadastrado.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    emailInput.focus();
                    return;
                }
                
                // Adicionar novo usuário
                const novoUsuario = {
                    ...dadosUsuario,
                    id: Date.now(),
                    dataCadastro: new Date().toISOString()
                };
                
                usuarios.push(novoUsuario);
                localStorage.setItem('fogtech_usuarios', JSON.stringify(usuarios));
                
                setMessage('Cadastro realizado com sucesso!', true);
                window.Fog.showToast('Bem-vindo(a) à FogTech!', 'success');
                
                // Auto-login após cadastro
                setTimeout(() => {
                    window.Fog.saveUser(dadosUsuario.email, {
                        nome: dadosUsuario.nome,
                        cadastroMethod: 'form'
                    });
                    
                    window.location.href = 'index.html';
                }, 1500);
                
            } catch (error) {
                console.error('Erro no cadastro:', error);
                setMessage('Erro interno. Tente novamente.');
                
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }, 1000);
    }
    
    /**
     * Limpa todos os campos do formulário
     */
    function limparFormulario() {
        form.reset();
        clearMessage();
        
        // Restaurar valores default dos radio buttons e select
        const radioSolteiro = form.querySelector('input[name="civil"][value="solteiro"]');
        if (radioSolteiro) radioSolteiro.checked = true;
        
        const selectEscolar = form.querySelector('#cd-escolar');
        if (selectEscolar) {
            selectEscolar.selectedIndex = 2; 
        }
        
        emailInput.focus();
        window.Fog.showToast('Formulário limpo', 'info');
    }
    
    // ===== EVENT LISTENERS =====
    
    // Submit do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormulario()) {
            const dadosFormulario = {
                email: emailInput.value.trim(),
                nome: nomeInput.value.trim(),
                cpf: cpfInput.value,
                nascimento: nascInput.value,
                telefone: zapInput.value,
                estadoCivil: form.querySelector('input[name="civil"]:checked')?.value,
                escolaridade: escolarSelect.value
            };
            
            realizarCadastro(dadosFormulario);
        }
    });
    
    // Botão limpar
    if (btnLimpar) {
        btnLimpar.addEventListener('click', limparFormulario);
    }
    
    // Botão voltar
    if (btnVoltar) {
        btnVoltar.addEventListener('click', function() {
            if (confirm('Deseja realmente voltar? Os dados preenchidos serão perdidos.')) {
                history.back();
            }
        });
    }
    
    // Validação em tempo real
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !window.Fog.isEmail(email)) {
            setMessage('Formato de e-mail inválido.');
        }
    });
    
    cpfInput.addEventListener('blur', function() {
        const cpf = this.value;
        if (cpf && cpf.length === 14 && !window.Fog.validaCPF(cpf)) {
            setMessage('CPF inválido. Verifique os dígitos.');
        }
    });
    
    nascInput.addEventListener('blur', function() {
        const nascimento = this.value;
        if (nascimento && !window.Fog.isAdult(nascimento)) {
            setMessage('Cliente deve ser maior de idade (18+ anos).');
        }
    });
    
    // Confirmação de senha em tempo real
    confirmInput.addEventListener('input', function() {
        if (this.value && senhaInput.value && this.value !== senhaInput.value) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '';
        }
    });
    
    // Limpar mensagens de erro quando usuário começar a corrigir
    [emailInput, senhaInput, confirmInput, nomeInput, cpfInput, nascInput].forEach(input => {
        input.addEventListener('input', function() {
            if (msgElement.classList.contains('error')) {
                clearMessage();
            }
        });
    });
    
    // ===== INICIALIZAÇÃO =====
    document.addEventListener('DOMContentLoaded', function() {
        // Focar no primeiro campo
        if (emailInput) {
            emailInput.focus();
        }
        
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
        
        // Configurar data máxima (hoje) para campo de nascimento
        if (nascInput) {
            const hoje = new Date().toISOString().split('T')[0];
            nascInput.setAttribute('max', hoje);
        }
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
    });
    
})();