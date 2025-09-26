(function(){
const form = document.getElementById('formTroca');
const msg = document.getElementById('trocaMsg');
const email = document.getElementById('ts-email');
const senha = document.getElementById('ts-senha');
const conf = document.getElementById('ts-conf');
const btnLimpar = document.getElementById('btnLimparTroca');


function setMsg(t, ok){ msg.textContent = t; msg.className = 'msg ' + (ok?'ok':'error'); }


form.addEventListener('submit', (e)=>{
e.preventDefault();
const em = email.value.trim();
const pw = senha.value; const cf = conf.value;
if(!em) return setMsg('Preencha o login (e-mail).', false);
if(!Fog.isEmail(em)) return setMsg('E-mail inválido.', false);
if(!pw) return setMsg('Preencha a senha.', false);
if(!cf) return setMsg('Preencha a confirmação.', false);


const vr = Fog.validPassword(pw);
if(!vr.ok) return setMsg(vr.msg, false);
if(cf !== pw) return setMsg('Confirmação diferente da senha.', false);


alert('Validação realizada com sucesso');
history.back();
});


btnLimpar.addEventListener('click', ()=>{ form.reset(); setMsg('', true); email.focus(); });
})();