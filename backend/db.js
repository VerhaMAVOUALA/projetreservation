// Import de Pool depuis le module 'pg' (PostgreSQL)
import { Pool } from 'pg';
// Chargement des variables d’environnement à partir du fichier .env
import dotenv from 'dotenv';

dotenv.config(); // Active l’accès aux variables d'environnement (.env)

// Configuration adaptative pour PostgreSQL
// Si une URL DATABASE_URL existe (ex : hébergement sur Railway, Render, etc.), on l'utilise.
// Sinon, on utilise les paramètres locaux : host, user, password, etc.
const poolConfig = process.env.DATABASE_URL ?
    {
        connectionString: process.env.DATABASE_URL, // Connexion unique cloud
        ssl: { rejectUnauthorized: false } // Pour éviter les erreurs SSL avec PostgreSQL distant
    } :
    {
        user: process.env.DB_USER, // Nom d'utilisateur PostgreSQL (ex: postgres)
        host: process.env.DB_HOST, // Hôte (localhost en local)
        database: process.env.DB_NAME, // Nom de la base de données (ex: db_réservation)
        password: process.env.DB_PASSWORD, // Mot de passe PostgreSQL
        port: process.env.DB_PORT, // Port PostgreSQL (5432 par défaut)
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
            // ssl activé ou désactivé selon l’environnement (cloud ou local)
    };

// Création de la connexion PostgreSQL avec la configuration
const pool = new Pool(poolConfig);

// Test immédiat de la connexion à PostgreSQL (utile au démarrage du serveur)
pool.query('SELECT NOW()')
    .then(() => console.log('✅ Connecté à PostgreSQL'))
    .catch(err => console.error('❌ Erreur de connexion DB:', err));

// Exportation du pool pour être utilisé ailleurs dans le projet
export default pool;