// cadastro.js

document.getElementById('isDM').addEventListener('change', (e) => {
  document.getElementById('dmCampos').classList.toggle('hidden', !e.target.checked);
});

document.getElementById('proporcaoPorRefeicao').addEventListener('change', (e) => {
  document.getElementById('refeicoesCampos').classList.toggle('hidden', !e.target.checked);
});

document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const nascimento = document.getElementById('nascimento').value;
  const telefone = document.getElementById('telefone').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const isDM = document.getElementById('isDM').checked;

  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);
    const uid = userCredential.user.uid;

    const userData = {
      nome,
      cpf,
      nascimento,
      telefone,
      email,
      isDM
    };

    if (isDM) {
      userData.glicemiaAlvo = Number(document.getElementById('glicemiaAlvo').value);
      userData.fatorCorrecao = Number(document.getElementById('fatorCorrecao').value);
      userData.doseMaxima = Number(document.getElementById('doseMaxima').value);
      userData.proporcaoPadrao = Number(document.getElementById('proporcaoPadrao').value);
      userData.proporcaoPorRefeicao = document.getElementById('proporcaoPorRefeicao').checked;

      if (userData.proporcaoPorRefeicao) {
        userData.proporcoes = {
          cafe: Number(document.getElementById('refCafe').value),
          lancheManha: Number(document.getElementById('refLancheManha').value),
          almoco: Number(document.getElementById('refAlmoco').value),
          lancheTarde: Number(document.getElementById('refLancheTarde').value),
          jantar: Number(document.getElementById('refJantar').value),
          ceia: Number(document.getElementById('refCeia').value),
        };
      }
    }

    await firebase.firestore().collection("usuarios").doc(uid).set(userData);

    alert("Usuário cadastrado com sucesso!");
    // window.location.href = "../login/login.html";
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    alert("Erro ao cadastrar usuário: " + error.message);
  }
});
