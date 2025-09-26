(function(){
    'use strict';
    
    // ===== CONSTANTES =====
    const STORAGE_KEY = 'fogtech_user';
    const ALLOWED = '@#$%&*!?/\\|-_+.=';
    const FORBIDDEN = '¨{}[]´`~^:;<>,"\'';
    
    // ===== VALIDAÇÕES =====
    
    /**
     * Valida se string é um email válido
     * @param {string} email 
     * @returns {boolean}
     */
    function isEmail(email) {
        if (!email || typeof email !== 'string') return false;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email.trim());
    }
    
    /**
     * Valida senha conforme regras específicas
     * @param {string} password 
     * @returns {object} {ok: boolean, msg: string}
     */
    function validPassword(password) {
        if (!password) return { ok: false, msg: 'Senha é obrigatória.' };
        
        if (password.length < 6) {
            return { ok: false, msg: 'Senha deve ter pelo menos 6 caracteres.' };
        }
        
        if (!/\d/.test(password)) {
            return { ok: false, msg: 'Senha deve conter pelo menos 1 número.' };
        }
        
        if (!/[A-Z]/.test(password)) {
            return { ok: false, msg: 'Senha deve conter pelo menos 1 letra maiúscula.' };
        }
        
        let hasSpecial = false;
        for (let char of password) {
            if (ALLOWED.includes(char)) {
                hasSpecial = true;
                break;
            }
        }
        
        if (!hasSpecial) {
            return { ok: false, msg: 'Senha deve conter pelo menos 1 caractere especial permitido.' };
        }
        
        for (let char of password) {
            if (FORBIDDEN.includes(char)) {
                return { ok: false, msg: 'Senha contém caracteres não permitidos.' };
            }
        }
        
        return { ok: true, msg: 'Senha válida.' };
    }
    
    /**
     * Aplica máscara de CPF
     * @param {HTMLInputElement} input 
     */
    function maskCPF(input) {
        if (!input) return;
        
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d+)/, '$1.$2');
            }
            
            e.target.value = value;
        });
        
        // Permitir apenas números e caracteres de formatação
        input.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.which);
            if (!/[\d.-]/.test(char) && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
            }
        });
    }
    
    /**
     * Valida CPF usando algoritmo oficial
     * @param {string} cpf 
     * @returns {boolean}
     */
    function validaCPF(cpf) {
        if (!cpf || typeof cpf !== 'string') return false;
        
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length !== 11) return false;
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cpf)) return false;
        
        // Valida primeiro dígito verificador
        let soma = 0;
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        
        // Valida segundo dígito verificador
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        
        return resto === parseInt(cpf.substring(10, 11));
    }
    
    /**
     * @param {string} phone 
     * @returns {boolean}
     */
    function isPhoneBR(phone) {
        if (!phone) return true; 
        
        const digits = phone.replace(/\D/g, '');
        return /^\d{10,11}$/.test(digits);
    }
    
    /**
     * Verifica se pessoa é maior de idade (18+)
     * @param {string} birthDate - Data no formato ISO (YYYY-MM-DD)
     * @returns {boolean}
     */
    function isAdult(birthDate) {
        if (!birthDate) return false;
        
        const birth = new Date(birthDate);
        const today = new Date();
        
        if (isNaN(birth.getTime())) return false;
        
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age >= 18;
    }
    
    // ===== UTILITÁRIOS =====
    
    /**
     * Salva dados do usuário no localStorage
     * @param {string} email 
     * @param {object} additionalData 
     */
    function saveUser(email, additionalData = {}) {
        const userData = { 
            email, 
            loginTime: new Date().toISOString(),
            ...additionalData 
        };
        
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        } catch (error) {
            console.error('Erro ao salvar dados do usuário:', error);
        }
    }
    
    /**
     * Remove dados do usuário do localStorage
     */
    function clearUser() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Erro ao limpar dados do usuário:', error);
        }
    }
    
    /**
     * Recupera dados do usuário do localStorage
     * @returns {object|null}
     */
    function getUser() {
        try {
            const userData = localStorage.getItem(STORAGE_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Erro ao recuperar dados do usuário:', error);
            return null;
        }
    }
    
    /**
     * Ordena array de objetos por data crescente
     * @param {Array} rows - Array com objetos contendo propriedade 'dataPedido'
     * @returns {Array}
     */
    function sortByDateAsc(rows) {
        if (!Array.isArray(rows)) return [];
        
        return [...rows].sort((a, b) => {
            const dateA = new Date(a.dataPedido);
            const dateB = new Date(b.dataPedido);
            return dateA - dateB;
        });
    }
    
    /**
     * Formata data para string ISO (YYYY-MM-DD)
     * @param {Date|string} date 
     * @returns {string}
     */
    function fmtDate(date) {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        
        return d.toISOString().slice(0, 10);
    }
    
    /**
     * Adiciona dias a uma data
     * @param {Date|string} date 
     * @param {number} days 
     * @returns {Date}
     */
    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    
    /**
     * Formata valor monetário para Real brasileiro
     * @param {number} value 
     * @returns {string}
     */
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
    
    /**
     * Debounce function para otimizar eventos
     * @param {Function} func 
     * @param {number} wait 
     * @returns {Function}
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Mostra toast notification
     * @param {string} message 
     * @param {string} type - 'success', 'error', 'warning', 'info'
     */
    function showToast(message, type = 'info') {
        // Remove toast anterior se existir
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            z-index: 1000;
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
            animation: slideInRight 0.3s ease-out;
        `;
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Remove após 4 segundos
        setTimeout(() => {
            if (toast && toast.parentNode) {
                toast.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }
    
    // Adicionar CSS das animações do toast
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===== EXPOSIÇÃO DA API GLOBAL =====
    window.Fog = {
        // Validações
        isEmail,
        validPassword,
        validaCPF,
        isPhoneBR,
        isAdult,
        
        // Formatação
        maskCPF,
        formatCurrency,
        
        // Constantes
        ALLOWED,
        FORBIDDEN,
        
        // Gerenciamento de usuário
        saveUser,
        clearUser,
        getUser,
        
        // Utilitários de data
        sortByDateAsc,
        fmtDate,
        addDays,
        
        // Utilitários gerais
        debounce,
        showToast
    };
    
    // ===== INICIALIZAÇÃO =====
    document.addEventListener('DOMContentLoaded', function() {
        const currentPage = document.body.dataset.page;
        
        if (currentPage === 'home') {
            const user = window.Fog.getUser();
            const carrinhoLink = document.getElementById('lnk-carrinho');
            
            if (user && carrinhoLink) {
                carrinhoLink.hidden = false;
                carrinhoLink.classList.add('animate-fade-in');
            }
            
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-4px)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        }
        
        document.body.classList.add('loaded');
        
        const images = document.querySelectorAll('img[src]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    });
    
})();