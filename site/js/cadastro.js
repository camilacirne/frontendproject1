(function(){
const form = document.getElementById('formCadastro');
const msg = document.getElementById('cadMsg');
const btnLimpar = document.getElementById('btnLimparCad');
const btnVoltar = document.getElementById('btnVoltarCad');


const em = document.getElementById('cd-email');
const pw = document.getElementById('cd-senha');
const cf = document.getElementById('cd-conf');
const nome = document.getElementById('cd-nome');
const cpf = document.getElementById('cd-cpf');
const nasc = document.getElementById('cd-nasc');
const zap = document.getElementById('cd-zap');


Fog.maskCPF(cpf);


function setMsg(t, ok){ msg.textContent = t; msg.className = 'msg ' + (ok?'ok':'error'); }


function nomeValido(v){
if(!v) return {ok:false, msg:'Preencha o nome.'};
const partes = v.trim().split(/\s+/);
if(partes.length < 2) return {ok:false, msg:'Informe nome e sobrenome.'};
if(partes[0].length < 2) return {ok:false, msg:'Primeiro nome deve ter ao menos 2 caracteres.'};
const proib = new RegExp('[' + (Fog.FORBIDDEN + Fog.ALLOWED).replace(/[.*+?^${}()|[\]\\]/g, r=>"\\"+r) + ']');
if(proib.test(v)) return {ok:false, msg:'Nome não pode conter caracteres especiais.'};
return {ok:true};
}


form.addEventListener('submit', (e)=>{
e.preventDefault();
if(!em.value.trim()) return setMsg('Preencha o e-mail.', false);
if(!Fog.isEmail(em.value.trim())) return setMsg('E-mail inválido.', false);


if(!pw.value) return setMsg('Preencha a senha.', false);
if(!cf.value) return setMsg('Preencha a confirmação.', false);
const vr = Fog.validPassword(pw.value); if(!vr.ok) return setMsg(vr.msg,false);
if(cf.value !== pw.value) return setMsg('Confirmação diferente da senha.', false);


const nv = nomeValido(nome.value); if(!nv.ok) return setMsg(nv.msg,false);


if(!cpf.value) return setMsg('Preencha o CPF.', false);
if(!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf.value)) return setMsg('CPF deve estar no formato NNN.NNN.NNN-NN.', false);
if(!Fog.validaCPF(cpf.value)) return setMsg('CPF inválido.', false);


if(!nasc.value) return setMsg('Preencha a data de nascimento.', false);
if(!Fog.isAdult(nasc.value)) return setMsg('Cliente deve ser maior de idade (18+).', false);


if(!Fog.isPhoneBR(zap.value)) return setMsg('Telefone inválido. Use 10 ou 11 dígitos.', false);


alert('Validação realizada com sucesso');
setMsg('Cadastro concluído!', true);
});


btnLimpar.addEventListener('click', ()=>{ form.reset(); setMsg('', true); em.focus(); });
btnVoltar.addEventListener('click', ()=> history.back());
})();