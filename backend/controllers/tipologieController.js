const model = require('../models/tipologieModel');

exports.getAll = async (req, res) => {
  try {
    const tipologie = await model.getAll();
    res.json(tipologie);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero delle tipologie.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const tipologia = await model.getById(req.params.id);
    if (!tipologia) return res.status(404).json({ error: 'Tipologia non trovata.' });
    res.json(tipologia);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero della tipologia.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome richiesto.' });

    const nuova = await model.create(nome);
    res.status(201).json(nuova);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Il nome è già stato assegnato ad un\altra tipologia.' });
    } else {
      res.status(500).json({ error: 'Errore nella creazione.' });
    }
  }
};

exports.createMultiple = async (req, res) => {
  try {
    const { tipologie } = req.body;

    // Controllo di esistenza
    if (!Array.isArray(tipologie) || tipologie.length === 0) {
      return res.status(400).json({ error: 'Lista di tipologie non valida.' });
    }

    // Esegui l'inserimento di ciascuna tipologia
    const results = [];
    for (let tipologia of tipologie) {
      const { nome } = tipologia;
      if (!nome) continue;

      try {
        const nuovaTipologia = await model.create(nome);
        results.push(nuovaTipologia);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          results.push({ error: `La tipologia '${nome}' esiste già.` });
        } else {
          results.push({ error: `Errore durante la creazione di '${nome}'.` });
        }
      }
    }

    res.status(201).json(results);

  } catch (err) {
    res.status(500).json({ error: 'Errore nella creazione delle tipologie.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { nome } = req.body;
    const id = req.params.id;

    // Verifica se l'elemento esiste
    const tipologia = await model.getById(id);
    if (!tipologia) {
      return res.status(404).json({ error: 'L\'elemento selezionato non esiste' });
    }

    // Verifica se il nome scelto esiste già in un'altra tipologia
    const tutteLeTipologie = await model.getAll();
    const nomeEsistente = tutteLeTipologie.some((el) => el.nome === nome && el.id != id);

    if (nomeEsistente) {
      return res.status(400).json({ error: 'Impossibile applicare la modifica richiesta. Il nome scelto appartiene già ad un elemento della tabella' });
    }

    // Esegui l'aggiornamento
    await model.update(id, nome);

    res.status(200).json({ message: 'Modifica riuscita.' });

  } catch (err) {
    res.status(500).json({ error: 'Errore nell\'aggiornamento.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;

    // Controlla se l'elemento esiste
    const tipologia = await model.getById(id);
    if (!tipologia) {
      return res.status(404).json({ error: 'L\'elemento selezionato non esiste' });
    }

    // Se esiste, esegui l'eliminazione
    await model.remove(id);
    res.json({ message: 'Tipologia eliminata.' });

  } catch (err) {
    res.status(500).json({ error: 'Errore nella cancellazione. La tipologia selezionata è attualmente assegnata ad uno o più corsi.' });
  }
};

