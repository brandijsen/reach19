require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rotte di esempio
app.get('/', (req, res) => {
  res.send('🏡 API Reach17 attiva e funzionante!');
});




// Rotte
const corsiRoute = require('./routes/corsiRoute');
app.use('/api/corsi', corsiRoute);

const tipologieRoute = require('./routes/tipologieRoute');
app.use('/api/tipologie', tipologieRoute);

const ateneiRoute = require('./routes/ateneiRoute');
app.use('/api/atenei', ateneiRoute);

const associazioniRoute = require('./routes/associazioniRoute');
app.use('/api/associazioni', associazioniRoute);

// Avvio del server
app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});
