const model = require('../models/corsiModel');

// Funzione per ottenere tutti i corsi
exports.getAll = async (req, res) => {
  try {
    const corsi = await model.getAll();
    res.json(corsi);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dei corsi.' });
  }
};

// Funzione per ottenere un corso per ID
exports.getById = async (req, res) => {
  try {
    const corso = await model.getById(req.params.id);
    if (!corso) return res.status(404).json({ error: 'Corso non trovato.' });
    res.json(corso);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero del corso.' });
  }
};


exports.create = async (req, res) => {
  try {
    const { nome, id_tipologia } = req.body;

    // 1️⃣ - Controllo dei parametri
    if (!nome || !id_tipologia) {
      return res.status(400).json({ error: 'Nome e tipologia del corso sono richiesti.' });
    }

    // 2️⃣ - Controllo se il nome esiste già
    const corsoEsistente = await model.getByName(nome);

    if (corsoEsistente) {
      return res.status(400).json({ error: 'Esiste già un corso con questo nome.' });
    }

    // 3️⃣ - Controllo se la tipologia esiste
    const tipologiaValida = await model.checkTipologia(id_tipologia);

    if (!tipologiaValida) {
      return res.status(400).json({ error: 'La tipologia specificata non esiste.' });
    }

    // 4️⃣ - Creazione del corso (ID viene generato solo qui)
    const nuovoCorso = await model.create(nome, id_tipologia);

    res.status(201).json(nuovoCorso);

  } catch (err) {
    console.error("Errore durante la creazione del corso:", err.message);
    res.status(500).json({ error: 'Errore nella creazione del corso.' });
  }
};



// Funzione per creare più corsi contemporaneamente
exports.createMultiple = async (req, res) => {
  try {
    const { corsi } = req.body;

    // Controllo di esistenza
    if (!Array.isArray(corsi) || corsi.length === 0) {
      return res.status(400).json({ error: 'Lista di corsi non valida.' });
    }

    // Esegui l'inserimento di ciascun corso
    const results = [];
    for (let corso of corsi) {
      const { nome, id_tipologia } = corso;

      if (!nome || !id_tipologia) {
        results.push({ error: `Dati mancanti per il corso '${nome}'` });
        continue;
      }

      try {
        const nuovoCorso = await model.create(nome, id_tipologia);
        results.push(nuovoCorso);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          results.push({ error: `Il corso '${nome}' esiste già.` });
        } else {
          results.push({ error: `Errore durante la creazione di '${nome}'.` });
        }
      }
    }

    res.status(201).json(results);

  } catch (err) {
    res.status(500).json({ error: 'Errore nella creazione dei corsi.' });
  }
};



exports.update = async (req, res) => {
  try {
    const { nome, id_tipologia } = req.body;
    const { id } = req.params;

    // 1️⃣ - Controllo dei parametri
    if (!nome || !id_tipologia) {
      return res.status(400).json({ error: 'Nome e tipologia del corso sono richiesti.' });
    }

    // 2️⃣ - Controllo se esiste un altro corso con lo stesso nome (escludendo l'ID corrente)
    const duplicato = await model.getByName(nome);
    if (duplicato && duplicato.id !== parseInt(id)) {
      return res.status(400).json({ error: 'Esiste già un altro corso con questo nome.' });
    }

    // 3️⃣ - Controllo se la tipologia esiste
    const tipologiaValida = await model.checkTipologia(id_tipologia);
    if (!tipologiaValida) {
      return res.status(400).json({ error: 'La tipologia specificata non esiste.' });
    }

    // 4️⃣ - Eseguo l'aggiornamento nel database
    const aggiornato = await model.update(id, nome, id_tipologia);

    // 5️⃣ - Risposta
    aggiornato 
      ? res.json({ message: 'Corso aggiornato con successo.' })
      : res.status(500).json({ error: 'Errore nell\'aggiornamento del corso.' });

  } catch (err) {
    console.error("Errore durante l'aggiornamento del corso:", err.message);
    res.status(500).json({ error: 'Errore nell\'aggiornamento del corso.' });
  }
};



exports.remove = async (req, res) => {
  try {
    // Controllo se esiste prima di cancellare
    const corso = await model.getById(req.params.id);
    if (!corso) {
      return res.status(404).json({ error: 'L\'elemento selezionato non esiste.' });
    }

    await model.remove(req.params.id);
    res.json({ message: 'Corso eliminato.' });
  } catch (err) {
    res.status(500).json({ error: 'Errore nella cancellazione del corso.' });
  }
};

exports.countAll = async (req, res) => {
  try {
    const totale = await model.countAll();
    res.json({ totale });
  } catch (err) {
    res.status(500).json({ error: 'Errore nel conteggio dei corsi.' });
  }
};
