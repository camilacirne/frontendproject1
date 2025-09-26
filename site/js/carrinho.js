(function(){
const tblBody = document.querySelector('#tblSolic tbody');
const sel = document.getElementById('sv');
const lblPreco = document.getElementById('lblPreco');
const lblPrazo = document.getElementById('lblPrazo');
const lblDataPrev = document.getElementById('lblDataPrev');
const lblStatus = document.getElementById('lblStatus');
const btnAdd = document.getElementById('btnIncluirSolic');


const precos = { DEV: 8000, SEC: 6500, CLOUD: 9000, SUP: 1200 };
const prazos = { DEV: 20, SEC: 7, CLOUD: 30, SUP: 3 };


function updateValores(){
const k = sel.value;
lblPreco.textContent = precos[k].toFixed(2);
lblPrazo.textContent = prazos[k];
const prev = Fog.addDays(new Date(), prazos[k]);
lblDataPrev.textContent = Fog.fmtDate(prev);
lblStatus.textContent = 'EM ELABORAÇÃO';
}
sel.addEventListener('change', updateValores);
updateValores();


function addRow(dataPedido, numero, servico, status, preco, dataPrev){
const tr = document.createElement('tr');
tr.innerHTML = `<td>${dataPedido}</td><td>${numero}</td><td>${servico}</td><td>${status}</td><td>${preco.toFixed(2)}</td><td>${dataPrev}</td><td><button class="btn btn-alt btn-sm bt-del">Excluir</button></td>`;
tr.querySelector('.bt-del').addEventListener('click', ()=> tr.remove());
tblBody.appendChild(tr);
}


// Preencher linhas fictícias (ordenadas por data ASC)
const mock = [
{dataPedido:'2025-09-01', numero:1001, servico:'Desenvolvimento Web', status:'EM ANDAMENTO', preco:7500, dataPrev:'2025-09-25'},
{dataPedido:'2025-09-10', numero:1002, servico:'Pentest Aplicação', status:'PENDENTE', preco:6400, dataPrev:'2025-09-20'}
];
Fog.sortByDateAsc(mock).forEach(r=> addRow(r.dataPedido,r.numero,r.servico,r.status,r.preco, r.dataPrev));


btnAdd.addEventListener('click', ()=>{
const k = sel.value;
const numero = Math.floor(1000 + Math.random()*9000);
const hoje = Fog.fmtDate(new Date());
addRow(hoje, numero, sel.options[sel.selectedIndex].text, 'EM ELABORAÇÃO', precos[k], lblDataPrev.textContent);
});
})();