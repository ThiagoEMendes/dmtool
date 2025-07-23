const admin = require("firebase-admin");
const fs = require("fs");

// Carrega a chave do Firebase
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Lê o arquivo alimentos.json
let alimentos;
try {
  const data = fs.readFileSync("alimentos.json", "utf8");
  alimentos = JSON.parse(data);
  if (!Array.isArray(alimentos)) {
    throw new Error("O arquivo alimentos.json deve conter um array de objetos.");
  }
} catch (err) {
  console.error("Erro ao ler ou interpretar alimentos.json:", err.message);
  process.exit(1);
}

async function importar() {
  let contador = 0;

  for (const item of alimentos) {
    // Validação básica
    if (!item.nome || typeof item.percentual_de_cho !== "number") {
      console.warn(`Item inválido (ignorado):`, item);
      continue;
    }

    try {
      await db.collection("alimentos").add(item);
      contador++;
      console.log(`✅ Adicionado: ${item.nome}`);
    } catch (err) {
      console.error(`❌ Erro ao adicionar "${item.nome}":`, err.message);
    }
  }

  console.log(`\n✅ Importação finalizada. ${contador} alimento(s) inserido(s).`);
}

importar().catch((err) => {
  console.error("Erro inesperado:", err.message);
});
