// choEInsulina.js

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const uid = user.uid;

    try {
      const doc = await db.collection('usuarios').doc(uid).get();

      if (doc.exists) {
        const usuario = doc.data();
        const primeiroNome = usuario.nome?.split(' ')[0] || 'Usuário';
        document.getElementById('nomeUsuario').innerText = primeiroNome;
      } else {
        console.error("Documento do usuário não encontrado.");
      }
    } catch (erro) {
      console.error("Erro ao buscar dados do usuário:", erro);
    }

  } else {
    window.location.href = "../login/login.html"; // Redireciona se não estiver logado
  }
});

let refeicaoSelecionada = '';

document.getElementById('glicemia').addEventListener('change', function () {
  const agora = new Date();
  const hora = agora.getHours();
  let pergunta = '';
  let tipo = '';

  if (hora >= 5 && hora < 9) {
    pergunta = 'Vai tomar o café?';
    tipo = 'cafe_da_manha';
  } else if (hora >= 9 && hora < 11) {
    pergunta = 'Vai lanchar?';
    tipo = 'lanche_manha';
  } else if (hora >= 11 && hora < 14) {
    pergunta = 'Vai almoçar?';
    tipo = 'almoco';
  } else if (hora >= 14 && hora < 17) {
    pergunta = 'Vai lanchar?';
    tipo = 'lanche_tarde';
  } else if (hora >= 17 && hora < 21) {
    pergunta = 'Vai jantar?';
    tipo = 'jantar';
  } else if (hora >= 21 && hora <= 23) {
    pergunta = 'Vai fazer a ceia?';
    tipo = 'ceia';
  } else {
    pergunta = 'Vai se alimentar agora?';
    tipo = '';
  }

  document.getElementById('perguntaRefeicao').innerText = pergunta;
  document.getElementById('perguntaRefeicao').dataset.tipo = tipo;
  document.getElementById('perguntaRefeicao').style.display = 'block';
  document.getElementById('botoesSimNao').style.display = 'flex';
  document.getElementById('selecionarRefeicao').style.display = 'none';
});

function respostaSim() {
  refeicaoSelecionada = document.getElementById('perguntaRefeicao').dataset.tipo;
  mostrarFase2();
}

function respostaNao() {
  document.getElementById('selecionarRefeicao').style.display = 'block';
}

function confirmarRefeicaoManual() {
  const valor = document.getElementById('refeicaoManual').value;
  if (valor) {
    refeicaoSelecionada = valor;
    mostrarFase2();
  } else {
    alert('Por favor, selecione uma refeição.');
  }
}

function mostrarFase2() {
  document.getElementById('fase1').style.display = 'none';
  document.getElementById('fase2').style.display = 'block';
  console.log('Refeição selecionada:', refeicaoSelecionada);
}

function voltarParaFase1() {
  document.getElementById('fase2').style.display = 'none';
  document.getElementById('fase1').style.display = 'block';
  document.getElementById('perguntaRefeicao').style.display = 'block';
  document.getElementById('botoesSimNao').style.display = 'flex';
}

// Autocomplete e adição de alimentos

let alimentoSelecionado = null;

document.getElementById('alimento').addEventListener('input', async function () {
  const termo = this.value.trim();
  const sugestoesDiv = document.getElementById('sugestoes');
  sugestoesDiv.innerHTML = '';

  if (termo.length < 2) return;

  const snapshot = await db.collection('alimentos')
    .where('nome', '>=', termo)
    .where('nome', '<=', termo + '\uf8ff')
    .limit(5)
    .get();

  snapshot.forEach(doc => {
    const alimento = doc.data();
    const botao = document.createElement('button');
    botao.className = 'btn';
    botao.style.flex = 'unset';
    botao.innerText = alimento.nome;
    botao.onclick = () => selecionarAlimento(doc.id, alimento);
    sugestoesDiv.appendChild(botao);
  });
});

function selecionarAlimento(id, alimento) {
  alimentoSelecionado = { id, ...alimento };
  document.getElementById('alimento').value = alimento.nome;
  document.getElementById('sugestoes').innerHTML = '';
  document.getElementById('quantidadeContainer').style.display = 'block';
}

document.getElementById('tipoMedida').addEventListener('change', function () {
  document.getElementById('tipoLabel').innerText = this.checked ? 'mc/p' : 'g/ml';
});

function adicionarAlimento() {
  const qtd = parseFloat(document.getElementById('quantidade').value);
  const tipo = document.getElementById('tipoMedida').checked ? 'mc/p' : 'g/ml';
  if (!alimentoSelecionado || isNaN(qtd) || qtd <= 0) return alert('Preencha corretamente.');

  const linha = document.createElement('tr');
  const cho = calcularCHOAlimento(alimentoSelecionado, qtd, tipo);

  linha.innerHTML = `
    <td>${alimentoSelecionado.nome}</td>
    <td>${qtd} ${tipo}</td>
    <td>${cho.toFixed(1)}</td>
    <td><button onclick="this.parentElement.parentElement.remove()">❌</button></td>
  `;

  document.querySelector('#tabelaAlimentos tbody').appendChild(linha);
  document.getElementById('tabelaAlimentos').style.display = 'table';

  document.getElementById('quantidade').value = '';
  document.getElementById('quantidadeContainer').style.display = 'none';
  document.getElementById('alimento').value = '';
  alimentoSelecionado = null;
}

function calcularCHOAlimento(alimento, qtd, tipo) {
  if (tipo === 'mc/p') {
    return alimento.carboidrato * qtd;
  } else {
    return (qtd * alimento.carboidrato) / alimento.peso || 0;
  }
}

function calcularCHO() {
  alert('Cálculo de CHO e dose de insulina será implementado aqui.');
}
