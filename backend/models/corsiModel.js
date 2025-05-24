const db = require('../db');

// 🔍 Controlla se esiste un corso con lo stesso nome
const getByName = async (nome) => {
  const query = 'SELECT id FROM corsi WHERE nome = ?';
  const [rows] = await db.query(query, [nome]);
  return rows.length > 0 ? rows[0] : null;
};

// 🔍 Controlla se esiste una tipologia con l'ID specificato
const checkTipologia = async (id_tipologia) => {
  const query = 'SELECT id FROM tipologie WHERE id = ?';
  const [rows] = await db.query(query, [id_tipologia]);
  return rows.length > 0;
};


// Recupera tutti i corsi con la relativa tipologia
const getAll = async () => {
  const query = `
    SELECT 
      c.id AS corso_id, 
      c.nome AS corso_nome, 
      t.id AS tipologia_id, 
      t.nome AS tipologia_nome
    FROM corsi c
    JOIN tipologie t ON c.id_tipologia = t.id
  `;
  const [rows] = await db.query(query);

  return rows.map(row => ({
    id: row.corso_id,
    nome: row.corso_nome,
    tipologia: {
      id: row.tipologia_id,
      nome: row.tipologia_nome
    }
  }));
};

// Recupera un corso per ID
const getById = async (id) => {
  const query = `
    SELECT 
      c.id AS corso_id, 
      c.nome AS corso_nome, 
      t.id AS tipologia_id, 
      t.nome AS tipologia_nome
    FROM corsi c
    JOIN tipologie t ON c.id_tipologia = t.id
    WHERE c.id = ?
  `;
  const [rows] = await db.query(query, [id]);
  return rows.length > 0 ? {
    id: rows[0].corso_id,
    nome: rows[0].corso_nome,
    tipologia: {
      id: rows[0].tipologia_id,
      nome: rows[0].tipologia_nome
    }
  } : null;
};

// 🆕 Inserisce un nuovo corso (ID generato solo in caso di successo)
const create = async (nome, id_tipologia) => {
  const query = 'INSERT INTO corsi (nome, id_tipologia) VALUES (?, ?)';
  const [result] = await db.query(query, [nome, id_tipologia]);
  return { id: result.insertId, nome, id_tipologia };
};


const update = async (id, nome, id_tipologia) => {
  const query = 'UPDATE corsi SET nome = ?, id_tipologia = ? WHERE id = ?';
  const [result] = await db.query(query, [nome, id_tipologia, id]);
  return result.affectedRows > 0;
};

// Elimina un corso
const remove = async (id) => {
  const query = 'DELETE FROM corsi WHERE id = ?';
  const [result] = await db.query(query, [id]);
  return result.affectedRows > 0;
};

module.exports = { getByName, checkTipologia, getAll, getById, create, update, remove };
