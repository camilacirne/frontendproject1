const FogUtils = {
  ALLOWED: '@#$%&*!?/\\|-_+.=',
  FORBIDDEN: '¨{}[]´`~^:;<>,"\'',
  
  isEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  },
  
  validPassword(password) {
    if (!password) return { ok: false, msg: 'Senha é obrigatória.' };
    if (password.length < 6) return { ok: false, msg: 'Senha deve ter pelo menos 6 caracteres.' };
    if (!/\d/.test(password)) return { ok: false, msg: 'Senha deve conter pelo menos 1 número.' };
    if (!/[A-Z]/.test(password)) return { ok: false, msg: 'Senha deve conter pelo menos 1 letra maiúscula.' };
    
    let hasSpecial = false;
    for (let char of password) {
      if (this.ALLOWED.includes(char)) {
        hasSpecial = true;
        break;
      }
    }
    
    if (!hasSpecial) return { ok: false, msg: 'Senha deve conter pelo menos 1 caractere especial permitido.' };
    
    for (let char of password) {
      if (this.FORBIDDEN.includes(char)) {
        return { ok: false, msg: 'Senha contém caracteres não permitidos.' };
      }
    }
    
    return { ok: true, msg: 'Senha válida.' };
  },
  
  validaCPF(cpf) {
    if (!cpf || typeof cpf !== 'string') return false;
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    
    return resto === parseInt(cpf.substring(10, 11));
  },
  
  isPhoneBR(phone) {
    if (!phone) return true;
    const digits = phone.replace(/\D/g, '');
    return /^\d{10,11}$/.test(digits);
  },
  
  isAdult(birthDate) {
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
  },
  
  formatCPF(value) {
    value = value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d+)/, '$1.$2');
    }
    
    return value;
  },
  
  formatPhone(value) {
    value = value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 5) {
      value = value.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d+)/, '($1) $2');
    }
    
    return value;
  },
  
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },
  
  formatDate(date) {
    if (!date) return '';
    const dateStr = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T12:00:00` : date;
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },
  
  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
};

export default FogUtils;