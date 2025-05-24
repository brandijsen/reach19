const express = require('express');
const router = express.Router();
const controller = require('../controllers/associazioniController');

// Associa un corso a uno o più atenei
router.post('/', controller.associate);

// Ottieni tutte le associazioni corso-ateneo
router.get('/', controller.getAssociations);

router.get('/filtra', controller.getFiltered);

// Recupera una specifica associazione tramite il suo ID
router.get('/:id', controller.getByAssociationId);

// Recupera tutte le associazioni di un corso
router.get('/corsi/:id', controller.getByCorsoId);

// Recupera tutte le associazioni di un ateneo
router.get('/atenei/:id', controller.getByAteneoId);

// Rimuovi una specifica associazione
router.delete('/:id', controller.removeAssociation);

// Rimuovi tutte le associazioni per un corso
router.delete('/corso/:id_corso', controller.removeAssociationsByCorso);

// Rimuovi tutte le associazioni per un ateneo
router.delete('/ateneo/:id_ateneo', controller.removeAssociationsByAteneo);



module.exports = router;
