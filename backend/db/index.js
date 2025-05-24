// Importazione del driver MySQL2
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configurazione della connessione
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Controllo della connessione
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connesso al database MySQL con successo!');
    connection.release();
  } catch (error) {
    console.error('❌ Errore di connessione al database:', error.message);
  }
})();

module.exports = pool;
