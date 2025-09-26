(function(){
const form = document.getElementById('formLogin');
const msg = document.getElementById('loginMsg');
const btnLimpar = document.getElementById('btnLimparLogin');
const email = document.getElementById('lg-email');
const senha = document.getElementById('lg-senha');


function setMsg(text, ok){ msg.textContent = text; msg.className = 'msg ' + (ok?'ok':'error'); }


form.addEventListener('submit', (e)=>{
e.preventDefault();
const em = email.value.trim();
const pw = senha.value;
if(!em){ return setMsg('Preencha o login (e-mail).', false); }
if(!Fog.isEmail(em)){ return setMsg('Formato de e-mail inválido.', false); }
if(!pw){ return setMsg('Preencha a senha.', false); }


alert('Validação realizada com sucesso');
Fog.saveUser(em);
window.location.href = 'index.html';
});


btnLimpar.addEventListener('click', ()=>{
form.reset();
setMsg('', true);
email.focus();
});
})();