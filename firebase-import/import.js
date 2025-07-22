const admin = require('firebase-admin');
const fs = require('fs');

// Substitua pelo nome do seu arquivo de chave
const serviceAccount = require('./dmtool-89d0d-firebase-adminsdk-fbsvc-9d54b3ff7d.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const data = JSON.parse(fs.readFileSync('alimentos.json', 'utf8'));

async function importData() {
  for (const item of data) {
    await db.collection('alimentos').add(item);
    console.log(`Adicionado: ${item.nome}`);
  }
}

importData().then(() => {
  console.log('Importação concluída.');
});
