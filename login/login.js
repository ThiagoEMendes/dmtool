// js/login.js

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = "";

  if (!email || !password) {
    errorMsg.textContent = "Preencha todos os campos.";
    return;
  }

  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    // Buscar dados do usuário no Firestore
    const userDoc = await firebase.firestore().collection("usuarios").doc(uid).get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log("Usuário logado:", userData);

      // Redirecionar ou mostrar mensagem
      alert("Login realizado com sucesso!");
      // window.location.href = "index.html"; // descomente para redirecionar
    } else {
      errorMsg.textContent = "Usuário autenticado, mas dados não encontrados.";
    }

  } catch (error) {
    console.error("Erro no login:", error);
    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      errorMsg.textContent = "E-mail ou senha incorretos.";
    } else {
      errorMsg.textContent = "Erro ao entrar. Tente novamente.";
    }
  }
});
