// login.js

document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = '';

  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);

    console.log("Login realizado com sucesso:", userCredential.user.uid);

    // Redireciona para a página principal após login
    window.location.href = "../menu.html";

  } catch (error) {
    console.error("Erro ao fazer login:", error);

    switch (error.code) {
      case 'auth/user-not-found':
        errorMsg.textContent = 'Usuário não encontrado.';
        break;
      case 'auth/wrong-password':
        errorMsg.textContent = 'Senha incorreta.';
        break;
      case 'auth/invalid-email':
        errorMsg.textContent = 'E-mail inválido.';
        break;
      default:
        errorMsg.textContent = 'Erro desconhecido.';
    }
  }
});
