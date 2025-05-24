const db = require('../db');

// Recupera tutti gli atenei
const getAll = async () => {
  const query = 'SELECT * FROM atenei';
  const [rows] = await db.query(query);
  return rows;
};

// Recupera un ateneo per ID
const getById = async (id) => {
  const query = 'SELECT * FROM atenei WHERE id = ?';
  const [rows] = await db.query(query, [id]);
  return rows.length > 0 ? rows[0] : null;
};

// Crea un nuovo ateneo
const create = async (nome) => {
  const query = 'INSERT INTO atenei (nome) VALUES (?)';
  const [result] = await db.query(query, [nome]);
  return { id: result.insertId, nome };
};

// Aggiorna un ateneo
const update = async (id, nome) => {
  const query = 'UPDATE atenei SET nome = ? WHERE id = ?';
  const [result] = await db.query(query, [nome, id]);
  return result.affectedRows > 0;
};

// Elimina un ateneo
const remove = async (id) => {
  const query = 'DELETE FROM atenei WHERE id = ?';
  const [result] = await db.query(query, [id]);
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, create, update, remove };
