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
