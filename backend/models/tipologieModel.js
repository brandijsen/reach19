const db = require('../db');

// Recupera tutte le tipologie
const getAll = async () => {
  const query = 'SELECT * FROM tipologie';
  const [rows] = await db.query(query);
  return rows;
};

// Recupera una tipologia per ID
const getById = async (id) => {
  const query = 'SELECT * FROM tipologie WHERE id = ?';
  const [rows] = await db.query(query, [id]);
  return rows.length > 0 ? rows[0] : null;
};

// Crea una nuova tipologia
const create = async (nome) => {
  const query = 'INSERT INTO tipologie (nome) VALUES (?)';
  const [result] = await db.query(query, [nome]);
  return { id: result.insertId, nome };
};

// Aggiorna una tipologia
const update = async (id, nome) => {
  const query = 'UPDATE tipologie SET nome = ? WHERE id = ?';
  const [result] = await db.query(query, [nome, id]);
  return result.affectedRows > 0;
};

// Elimina una tipologia
const remove = async (id) => {
  const query = 'DELETE FROM tipologie WHERE id = ?';
  const [result] = await db.query(query, [id]);
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, create, update, remove };
