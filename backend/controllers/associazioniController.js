const model = require('../models/associazioniModel');

// Associa un corso a uno o più atenei
exports.associate = async (req, res) => {
  try {
    const { id_corso, id_atenei } = req.body;

    if (!id_corso || !Array.isArray(id_atenei) || id_atenei.length === 0) {
      return res.status(400).json({ error: 'È richiesto un corso e almeno un ateneo.' });
    }

    const results = [];

    for (const id_ateneo of id_atenei) {
      try {
        await model.associateCourseToUniversity(id_corso, id_ateneo);
        results.push({ id_ateneo, status: 'associato' });
      } catch (err) {
        if (err.code === 'DUPLICATE_ASSOCIATION') {
          results.push({ id_ateneo, status: 'già associato' });
        } else {
          results.push({ id_ateneo, status: 'errore', error: err.message });
        }
      }
    }

    res.status(201).json({
      message: 'Operazione completata.',
      dettagli: results
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante la creazione delle associazioni.' });
  }
};

// Recupera tutte le associazioni
exports.getAssociations = async (req, res) => {
  try {
    const associazioni = await model.getAssociations();
    res.json(associazioni);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero delle associazioni.' });
  }
};

// Recupera una specifica associazione tramite il suo ID
exports.getByAssociationId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await model.getByAssociationId(id);

    if (!result) {
      return res.status(404).json({ error: 'Associazione non trovata.' });
    }
    res.json(result);

  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dell\'associazione.' });
  }
};

// Rimuove una specifica associazione
exports.removeAssociation = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await model.removeAssociation(id);

    if (!removed) {
      return res.status(404).json({ error: 'Associazione non trovata.' });
    }

    res.json({ message: 'Associazione eliminata con successo.' });

  } catch (err) {
    res.status(500).json({ error: 'Errore nella cancellazione dell\'associazione.' });
  }
};

// Rimuove tutte le associazioni per un corso
exports.removeAssociationsByCorso = async (req, res) => {
  try {
    const { id_corso } = req.params;
    const removed = await model.removeAssociationsByCorso(id_corso);

    if (!removed) {
      return res.status(404).json({ error: 'Nessuna associazione trovata per questo corso.' });
    }

    res.json({ message: 'Tutte le associazioni per il corso sono state eliminate con successo.' });

  } catch (err) {
    res.status(500).json({ error: 'Errore nell\'eliminazione delle associazioni del corso.' });
  }
};

// Rimuove tutte le associazioni per un ateneo
exports.removeAssociationsByAteneo = async (req, res) => {
  try {
    const { id_ateneo } = req.params;
    const removed = await model.removeAssociationsByAteneo(id_ateneo);

    if (!removed) {
      return res.status(404).json({ error: 'Nessuna associazione trovata per questo ateneo.' });
    }

    res.json({ message: 'Tutte le associazioni per l\'ateneo sono state eliminate con successo.' });

  } catch (err) {
    res.status(500).json({ error: 'Errore nell\'eliminazione delle associazioni dell\'ateneo.' });
  }
};

// Recupera tutte le associazioni per un corso
exports.getByCorsoId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await model.getByCorsoId(id);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Nessuna associazione trovata per questo corso.' });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero delle associazioni per il corso.' });
  }
};

// Recupera tutte le associazioni per un ateneo
exports.getByAteneoId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await model.getByAteneoId(id);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Nessuna associazione trovata per questo ateneo.' });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero delle associazioni per l\'ateneo.' });
  }
};

exports.getFiltered = async (req, res) => {
  try {
    const { nome, tipologia, ateneo } = req.query;
    const result = await model.getFilteredAssociations(nome, tipologia, ateneo);
    res.json(result);
  } catch (err) {
    console.error("Errore nel filtro associazioni:", err.message);
    res.status(500).json({ error: 'Errore nel filtraggio delle associazioni.' });
  }
};
