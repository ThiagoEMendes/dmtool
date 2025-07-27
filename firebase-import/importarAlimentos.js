const admin = require("firebase-admin");
const fs = require("fs");

// Carrega a chave do Firebase
const serviceAccount = require("../../keys/serviceAccountKey.json");

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

function calcularPercentuais(item) {
  const energiaTotal = item.energia || 0;
  const carbo = item.carboidrato || 0;
  const proteina = item.proteina || 0;
  const gordura = item.gordura || 0;

  const energiaCHO = carbo * 4;
  const energiaPROT = proteina * 4;
  const energiaGORD = gordura * 9;

  if (energiaTotal > 0) {
    item.percentual_de_cho = Math.round((energiaCHO / energiaTotal) * 100);
    item.percentual_de_proteina = Math.round((energiaPROT / energiaTotal) * 100);
    item.percentual_de_gordura = Math.round((energiaGORD / energiaTotal) * 100);
  } else {
    item.percentual_de_cho = 0;
    item.percentual_de_proteina = 0;
    item.percentual_de_gordura = 0;
  }
}

async function importar() {
  let contador = 0;

  for (const item of alimentos) {
    if (!item.nome || typeof item.energia !== "number") {
      console.warn(`Item inválido (ignorado):`, item);
      continue;
    }

    //calcularPercentuais(item);

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
