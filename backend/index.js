// index.js
// ✅ Importation des modules
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pool from './db.js'; // ✅ Connexion PostgreSQL
import utilisateurRoutes from './routes/utilisateurRoutes.js';
import voitureRoutes from './routes/voitures.js';
import chauffeurRoutes from './routes/chauffeurs.js';
import reservationRoutes from './routes/reservations.js';

// ✅ Initialisation de l'application Express
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// ✅ Routes API
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/voitures', voitureRoutes);
app.use('/api/chauffeurs', chauffeurRoutes);
app.use('/api/reservations', reservationRoutes);

// ✅ Route de test
app.get('/api/ping', (req, res) => {
    res.send({ message: 'Backend opérationnel 🚀' });
});

// ✅ Test de connexion à la base de données
app.get('/api/test-db', async(req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0].now });
    } catch (error) {
        console.error('Erreur PostgreSQL:', error);
        res.status(500).json({ success: false, error: 'Erreur DB' });
    }
});

// ✅ Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Serveur backend lancé sur http://localhost:${PORT}`);
});