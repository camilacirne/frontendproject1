(function(){
function validaCPF(cpf){
cpf = (cpf||'').replace(/\D/g,'');
if(cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
let soma=0, resto;
for(let i=1;i<=9;i++) soma+= parseInt(cpf.substring(i-1,i))* (11-i);
resto=(soma*10)%11; if(resto===10||resto===11) resto=0; if(resto!==parseInt(cpf.substring(9,10))) return false;
soma=0; for(let i=1;i<=10;i++) soma+= parseInt(cpf.substring(i-1,i))* (12-i);
resto=(soma*10)%11; if(resto===10||resto===11) resto=0; return resto===parseInt(cpf.substring(10,11));
}


// Telefone Brasil simples (com ou sem máscara)
function isPhoneBR(v){
if(!v) return true; // opcional
const d = v.replace(/\D/g,'');
return /^\d{10,11}$/.test(d);
}


// Idade >= 18
function isAdult(isoDate){
if(!isoDate) return false;
const dob = new Date(isoDate);
const today = new Date();
let age = today.getFullYear() - dob.getFullYear();
const m = today.getMonth() - dob.getMonth();
if(m < 0 || (m===0 && today.getDate() < dob.getDate())) age--;
return age >= 18;
}


// Expor utilitários globais controlados
window.Fog = {
isEmail, validPassword, ALLOWED, FORBIDDEN, maskCPF, validaCPF, isPhoneBR, isAdult,
saveUser(email){ localStorage.setItem(STORAGE_KEY, JSON.stringify({email})); },
clearUser(){ localStorage.removeItem(STORAGE_KEY); },
getUser(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'); }catch{return null} },
sortByDateAsc(rows){ return rows.sort((a,b)=> new Date(a.dataPedido)-new Date(b.dataPedido)); },
fmtDate(d){ const x = new Date(d); return x.toISOString().slice(0,10); },
addDays(d, days){ const x=new Date(d); x.setDate(x.getDate()+days); return x; }
};


// Mostrar/ocultar link de "Solicitar Serviços" na home
document.addEventListener('DOMContentLoaded', () => {
if(document.body.dataset.page === 'home'){
const user = window.Fog.getUser();
const l = document.getElementById('lnk-carrinho');
if(user && l) l.hidden = false;
}
});
})();