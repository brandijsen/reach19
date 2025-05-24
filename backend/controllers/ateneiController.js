const model = require('../models/ateneiModel');

exports.getAll = async (req, res) => {
  try {
    const atenei = await model.getAll();
    res.json(atenei);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero degli atenei.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const ateneo = await model.getById(req.params.id);
    if (!ateneo) {
      return res.status(404).json({ error: 'Ateneo non trovato.' });
    }
    res.json(ateneo);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dell\'ateneo.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ error: 'Nome richiesto.' });
    }

    // Controllo di unicità
    const atenei = await model.getAll();
    const duplicato = atenei.some((a) => a.nome.toLowerCase() === nome.toLowerCase());

    if (duplicato) {
      return res.status(409).json({ error: 'Ateneo già presente.' });
    }

    const nuovoAteneo = await model.create(nome);
    res.status(201).json(nuovoAteneo);

  } catch (err) {
    res.status(500).json({ error: 'Errore nella creazione dell\'ateneo.' });
  }
};

exports.createMultiple = async (req, res) => {
  try {
    const { atenei } = req.body;

    if (!Array.isArray(atenei) || atenei.length === 0) {
      return res.status(400).json({ error: 'Lista di atenei non valida.' });
    }

    // Recuperiamo tutti gli atenei esistenti
    const esistenti = await model.getAll();
    
    const results = [];

    for (const ateneo of atenei) {
      const { nome } = ateneo;

      if (!nome) {
        results.push({ error: 'Nome non valido.' });
        continue;
      }

      // Controllo di unicità
      const duplicato = esistenti.some((a) => a.nome.toLowerCase() === nome.toLowerCase());

      if (duplicato) {
        results.push({ error: `L'ateneo '${nome}' è già presente.` });
      } else {
        try {
          const nuovoAteneo = await model.create(nome);
          results.push(nuovoAteneo);
        } catch (err) {
          results.push({ error: `Errore nella creazione di '${nome}'.` });
        }
      }
    }

    res.status(201).json(results);

  } catch (err) {
    res.status(500).json({ error: 'Errore nella creazione multipla degli atenei.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { nome } = req.body;
    const id = req.params.id;

    if (!nome) {
      return res.status(400).json({ error: 'Nome richiesto.' });
    }

    // Controllo di unicità
    const atenei = await model.getAll();
    const duplicato = atenei.some((a) => a.nome.toLowerCase() === nome.toLowerCase() && a.id != id);

    if (duplicato) {
      return res.status(409).json({ error: 'Nome già usato da un altro ateneo.' });
    }

    // Controllo di esistenza
    const ateneo = await model.getById(id);
    if (!ateneo) {
      return res.status(404).json({ error: 'L\'elemento selezionato non esiste.' });
    }

    await model.update(id, nome);
    res.json({ message: 'Ateneo aggiornato.' });
  } catch (err) {
    res.status(500).json({ error: 'Errore nell\'aggiornamento dell\'ateneo.' });
  }
};

exports.remove = async (req, res) => {
  try {
    // Controllo di esistenza
    const ateneo = await model.getById(req.params.id);
    if (!ateneo) {
      return res.status(404).json({ error: 'L\'elemento selezionato non esiste.' });
    }

    await model.remove(req.params.id);
    res.json({ message: 'Ateneo eliminato.' });
  } catch (err) {
    res.status(500).json({ error: 'Errore nella cancellazione dell\'ateneo.' });
  }
};
