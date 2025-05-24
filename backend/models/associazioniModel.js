const db = require('../db');

// Funzione di mappatura dei dati
const mapAssociation = (row) => ({
  id: row.id,
  corso: {
    id: row.id_corso,
    nome: row.nome_corso
  },
  ateneo: {
    id: row.id_ateneo,
    nome: row.nome_ateneo
  }
});

// Associa un corso a un ateneo (con controllo di duplicato)
const associateCourseToUniversity = async (id_corso, id_ateneo) => {
  const queryCheck = 'SELECT * FROM associazioni WHERE id_corso = ? AND id_ateneo = ?';
  const [existing] = await db.query(queryCheck, [id_corso, id_ateneo]);

  if (existing.length > 0) {
    const error = new Error('Associazione già esistente');
    error.code = 'DUPLICATE_ASSOCIATION';
    throw error;
  }

  const insertQuery = 'INSERT INTO associazioni (id_corso, id_ateneo) VALUES (?, ?)';
  await db.query(insertQuery, [id_corso, id_ateneo]);
};

// Recupera tutte le associazioni con i nomi dei corsi e atenei
const getAssociations = async () => {
  const query = `
    SELECT 
      a.id,
      c.id AS id_corso,
      c.nome AS nome_corso,
      at.id AS id_ateneo,
      at.nome AS nome_ateneo
    FROM associazioni a
    INNER JOIN corsi c ON c.id = a.id_corso
    INNER JOIN atenei at ON at.id = a.id_ateneo
  `;
  const [rows] = await db.query(query);
  return rows.map(mapAssociation);
};

// Recupera una singola associazione tramite il suo ID
const getByAssociationId = async (id) => {
  const query = `
    SELECT 
      a.id,
      c.id AS id_corso,
      c.nome AS nome_corso,
      at.id AS id_ateneo,
      at.nome AS nome_ateneo
    FROM associazioni a
    INNER JOIN corsi c ON c.id = a.id_corso
    INNER JOIN atenei at ON at.id = a.id_ateneo
    WHERE a.id = ?
  `;
  const [rows] = await db.query(query, [id]);
  return rows.length > 0 ? mapAssociation(rows[0]) : null;
};

// Rimuove una specifica associazione
const removeAssociation = async (id) => {
  const query = 'DELETE FROM associazioni WHERE id = ?';
  const [result] = await db.query(query, [id]);
  return result.affectedRows > 0;
};

// Rimuove tutte le associazioni di un corso
const removeAssociationsByCorso = async (id_corso) => {
  const query = 'DELETE FROM associazioni WHERE id_corso = ?';
  const [result] = await db.query(query, [id_corso]);
  return result.affectedRows > 0;
};

// Rimuove tutte le associazioni di un ateneo
const removeAssociationsByAteneo = async (id_ateneo) => {
  const query = 'DELETE FROM associazioni WHERE id_ateneo = ?';
  const [result] = await db.query(query, [id_ateneo]);
  return result.affectedRows > 0;
};

// Recupera tutte le associazioni di un corso
const getByCorsoId = async (id_corso) => {
  const query = `
    SELECT 
      a.id,
      c.id AS id_corso,
      c.nome AS nome_corso,
      at.id AS id_ateneo,
      at.nome AS nome_ateneo
    FROM associazioni a
    INNER JOIN corsi c ON c.id = a.id_corso
    INNER JOIN atenei at ON at.id = a.id_ateneo
    WHERE a.id_corso = ?
  `;
  const [rows] = await db.query(query, [id_corso]);
  return rows.map(mapAssociation);
};

// Recupera tutte le associazioni di un ateneo
const getByAteneoId = async (id_ateneo) => {
  const query = `
    SELECT 
      a.id,
      c.id AS id_corso,
      c.nome AS nome_corso,
      at.id AS id_ateneo,
      at.nome AS nome_ateneo
    FROM associazioni a
    INNER JOIN corsi c ON c.id = a.id_corso
    INNER JOIN atenei at ON at.id = a.id_ateneo
    WHERE a.id_ateneo = ?
  `;
  const [rows] = await db.query(query, [id_ateneo]);
  return rows.map(mapAssociation);
};


const getFilteredAssociations = async (nomeCorso, nomeTipologia, nomeAteneo) => {
  let query = `
    SELECT 
      a.id,
      c.id AS id_corso,
      c.nome AS nome_corso,
      t.id AS id_tipologia,
      t.nome AS nome_tipologia,
      at.id AS id_ateneo,
      at.nome AS nome_ateneo
    FROM associazioni a
    INNER JOIN corsi c ON c.id = a.id_corso
    INNER JOIN tipologie t ON c.id_tipologia = t.id
    INNER JOIN atenei at ON at.id = a.id_ateneo
    WHERE 1=1
  `;
  const params = [];

  if (nomeCorso) {
    query += ' AND c.nome LIKE ?';
    params.push(`%${nomeCorso}%`);
  }

  if (nomeTipologia) {
    query += ' AND t.nome LIKE ?';
    params.push(`%${nomeTipologia}%`);
  }

  if (nomeAteneo) {
    query += ' AND at.nome LIKE ?';
    params.push(`%${nomeAteneo}%`);
  }

  const [rows] = await db.query(query, params);

  return rows.map(row => ({
    id: row.id,
    corso: {
      id: row.id_corso,
      nome: row.nome_corso,
      tipologia: {
        id: row.id_tipologia,
        nome: row.nome_tipologia
      }
    },
    ateneo: {
      id: row.id_ateneo,
      nome: row.nome_ateneo
    }
  }));
};





module.exports = {
  associateCourseToUniversity,
  getAssociations,
  getByAssociationId,
  removeAssociation,
  removeAssociationsByCorso,
  removeAssociationsByAteneo,
  getByCorsoId,
  getByAteneoId,
  getFilteredAssociations
};
