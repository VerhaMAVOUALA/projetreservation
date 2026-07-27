import express from 'express';
const router = express.Router();
import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.js';

// Fonction pour générer un token JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Fonction pour générer un token de vérification
const generateVerificationToken = () => {
    return require('crypto').randomBytes(32).toString('hex');
};

// Fonction pour envoyer un email de vérification (à implémenter selon votre service d'email)
const sendVerificationEmail = async (email, token, prenom) => {
    // Implémentation spécifique à votre service d'email
    console.log(`Email de vérification envoyé à ${email} avec le token ${token}`);
};

// Fonction pour envoyer un email de réinitialisation (à implémenter selon votre service d'email)
const sendPasswordResetEmail = async (email, token, prenom) => {
    // Implémentation spécifique à votre service d'email
    console.log(`Email de réinitialisation envoyé à ${email} avec le token ${token}`);
};

// Validation des données utilisateur
const validateUserData = (data, isUpdate = false) => {
    const errors = [];

    if (!isUpdate || data.hasOwnProperty('prenom')) {
        if (!data.prenom || data.prenom.trim().length < 2) {
            errors.push('Le prénom doit contenir au moins 2 caractères');
        }
    }

    if (!isUpdate || data.hasOwnProperty('nom')) {
        if (!data.nom || data.nom.trim().length < 2) {
            errors.push('Le nom doit contenir au moins 2 caractères');
        }
    }

    if (!isUpdate || data.hasOwnProperty('email')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            errors.push('Email invalide');
        }
    }

    if (!isUpdate || data.hasOwnProperty('mot_de_passe_hash')) {
        if (!data.mot_de_passe_hash || data.mot_de_passe_hash.length < 8) {
            errors.push('Le mot de passe doit contenir au moins 8 caractères');
        }
    }

    if (!isUpdate || data.hasOwnProperty('numero_telephone')) {
        const phoneRegex = /^[0-9]{10,15}$/;
        if (data.numero_telephone && !phoneRegex.test(data.numero_telephone)) {
            errors.push('Numéro de téléphone invalide (10 à 15 chiffres requis)');
        }
    }

    return errors;
};

// CREATE - Créer un nouvel utilisateur
router.post('/', async(req, res) => {
    try {
        const errors = validateUserData(req.body);
        if (errors.length > 0) {
            return res.status(422).json({ success: false, message: 'Erreurs de validation', errors });
        }

        const { prenom, nom, email, mot_de_passe_hash, numero_telephone, type_utilisateur } = req.body;

        if (!type_utilisateur || typeof type_utilisateur !== 'string') {
            return res.status(422).json({ success: false, message: "Le champ 'type_utilisateur' est requis" });
        }

        const existingUser = await db.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ success: false, message: 'Un utilisateur avec cet email existe déjà' });
        }
        const hashedPassword = await bcrypt.hash(mot_de_passe_hash, 10);

        const result = await db.query(
            `INSERT INTO utilisateurs 
            (prenom, nom, email, mot_de_passe_hash, numero_telephone, type_utilisateur, date_creation, date_mise_a_jour)
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
            RETURNING id_utilisateur, prenom, nom, email, numero_telephone, type_utilisateur`,
            [prenom, nom, email, hashedPassword, numero_telephone , type_utilisateur]
        );

        res.status(201).json({ success: true, message: 'Utilisateur créé avec succès', data: result.rows[0] });
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ success: false, message: 'Erreur serveur lors de la création', error: err.message });
    }
});

// CONNEXION sécurisée
router.post('/connexion', async (req, res) => {
    try {
        const { email, mot_de_passe_hash } = req.body;

        if (!email || !mot_de_passe_hash) {
            return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
        }

        // Rechercher l'utilisateur
        const user = await db.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
        }

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(mot_de_passe_hash, user.rows[0].mot_de_passe_hash);
        console.log("Email reçu :", email);
        console.log("Mot de passe reçu :", mot_de_passe_hash);
        console.log("Utilisateur trouvé :", user.rows[0]);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
        }

        // Générer token
        const token = generateToken(user.rows[0].id_utilisateur);

        // Définir le cookie JWT
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 heures
        });

        res.status(200).json({ 
            success: true, 
            message: 'Connexion réussie', 
            token,
            user: {
                id: user.rows[0].id_utilisateur,
                prenom: user.rows[0].prenom,
                nom: user.rows[0].nom,
                email: user.rows[0].email,
                type_utilisateur: user.rows[0].type_utilisateur,
                email_verifie: user.rows[0].email_verifie
            }
        });
    } catch (err) {
        console.error('Erreur connexion:', err);
        res.status(500).json({ success: false, message: 'Erreur serveur lors de la connexion', error: err.message });
    }
});

// VÉRIFICATION EMAIL
router.get('/verify-email/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const user = await db.query(
            'SELECT * FROM utilisateurs WHERE email_token = $1 AND email_token_expiry > NOW()',
            [token]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
        }

        // Marquer l'email comme vérifié
        await db.query(
            'UPDATE utilisateurs SET email_verifie = true, email_token = NULL, email_token_expiry = NULL WHERE id_utilisateur = $1',
            [user.rows[0].id_utilisateur]
        );

        res.status(200).json({ success: true, message: 'Email vérifié avec succès' });
    } catch (err) {
        console.error('Erreur vérification email:', err);
        res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
    }
});

// RENVOYER EMAIL DE VÉRIFICATION
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await db.query(
            'SELECT * FROM utilisateurs WHERE email = $1 AND email_verifie = false',
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Email non trouvé ou déjà vérifié' });
        }

        // Générer nouveau token
        const emailToken = generateVerificationToken();
        const emailTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await db.query(
            'UPDATE utilisateurs SET email_token = $1, email_token_expiry = $2 WHERE id_utilisateur = $3',
            [emailToken, emailTokenExpiry, user.rows[0].id_utilisateur]
        );

        await sendVerificationEmail(email, emailToken, user.rows[0].prenom);

        res.status(200).json({ success: true, message: 'Email de vérification renvoyé' });
    } catch (err) {
        console.error('Erreur renvoi email:', err);
        res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
    }
});

// DEMANDE DE RÉINITIALISATION MOT DE PASSE
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await db.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            // Ne pas révéler si l'email existe ou non
            return res.status(200).json({ success: true, message: 'Si l\'email existe, un lien de réinitialisation a été envoyé' });
        }

        // Générer token de réinitialisation
        const resetToken = generateVerificationToken();
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

        await db.query(
            'UPDATE utilisateurs SET reset_token = $1, reset_token_expiry = $2 WHERE id_utilisateur = $3',
            [resetToken, resetTokenExpiry, user.rows[0].id_utilisateur]
        );

        await sendPasswordResetEmail(email, resetToken, user.rows[0].prenom);

        res.status(200).json({ success: true, message: 'Si l\'email existe, un lien de réinitialisation a été envoyé' });
    } catch (err) {
        console.error('Erreur forgot password:', err);
        res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
    }
});

// RÉINITIALISATION MOT DE PASSE
router.post('/reset-password', async (req, res) => {
    try {
        const { token, nouveauMotDePasse } = req.body;

        if (!token || !nouveauMotDePasse) {
            return res.status(400).json({ success: false, message: 'Token et nouveau mot de passe requis' });
        }

        if (nouveauMotDePasse.length < 8) {
            return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 8 caractères' });
        }

        const user = await db.query(
            'SELECT * FROM utilisateurs WHERE reset_token = $1 AND reset_token_expiry > NOW()',
            [token]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(nouveauMotDePasse, 10);

        // Mettre à jour le mot de passe
        await db.query(
            'UPDATE utilisateurs SET mot_de_passe_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id_utilisateur = $2',
            [hashedPassword, user.rows[0].id_utilisateur]
        );

        res.status(200).json({ success: true, message: 'Mot de passe réinitialisé avec succès' });
    } catch (err) {
        console.error('Erreur reset password:', err);
        res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
    }
});

// DÉCONNEXION - Version corrigée avec gestion des cookies ET headers
router.post('/deconnexion', async (req, res) => {
    try {
        let token = null;
        let tokenSource = null;

        // Essayer d'abord de récupérer le token depuis les cookies
        if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
            tokenSource = 'cookie';
        } 
        // Sinon, essayer depuis l'header Authorization
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.slice(7);
            tokenSource = 'header';
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur non authentifié. Aucun token trouvé.",
            });
        }

        // Vérifier le token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        // Vérifier si l'utilisateur existe
        const user = await db.query(
            'SELECT id_utilisateur FROM utilisateurs WHERE id_utilisateur = $1',
            [userId]
        );

        if (!user.rows[0]) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé.",
            });
        }

        // Effacer le cookie si le token venait d'un cookie
        if (tokenSource === 'cookie') {
            res.clearCookie("jwt", {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "strict",
                path: "/",
            });
        }

        res.status(200).json({
            success: true,
            message: "Déconnexion réussie.",
            info: tokenSource === 'header' ? "Supprimez le token côté client." : "Cookie supprimé."
        });

    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        
        // Gestion spécifique des erreurs JWT
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Token invalide.",
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expiré.",
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Erreur lors de la déconnexion.",
            error: error.message
        });
    }
});

// READ ALL - Récupérer tous les utilisateurs
router.get('/', async(req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const offset = (page - 1) * limit;

        let query = `SELECT id_utilisateur, prenom, nom, email, numero_telephone, type_utilisateur, date_creation, date_mise_a_jour FROM utilisateurs`;
        let queryParams = [];
        let whereClause = '';

        if (search) {
            whereClause = ` WHERE (prenom ILIKE $1 OR nom ILIKE $1 OR email ILIKE $1)`;
            queryParams.push(`%${search}%`);
        }

        query += whereClause;
        query += ` ORDER BY id_utilisateur DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(parseInt(limit), offset);

        const result = await db.query(query, queryParams);

        let countQuery = 'SELECT COUNT(*) AS total FROM utilisateurs';
        if (search) {
            countQuery += whereClause;
        }
        const countResult = await db.query(countQuery, search ? [queryParams[0]] : []);
        const total = parseInt(countResult.rows[0].total);

        res.status(200).json({
            success: true,
            data: result.rows,
            pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) }
        });
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération', error: err.message });
    }
});

// READ ONE - Récupérer un utilisateur spécifique
router.get('/:id', async(req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ success: false, message: 'ID utilisateur invalide' });
        }

        const result = await db.query(
            `SELECT id_utilisateur, prenom, nom, email, numero_telephone, type_utilisateur, date_creation, date_mise_a_jour FROM utilisateurs WHERE id_utilisateur = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération', error: err.message });
    }
});

// UPDATE - Mettre à jour un utilisateur
router.put('/:id', async(req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ success: false, message: 'ID utilisateur invalide' });
        }

        const errors = validateUserData(req.body, true);
        if (errors.length > 0) {
            return res.status(422).json({ success: false, message: 'Erreurs de validation', errors });
        }

        const { prenom, nom, email, mot_de_passe_hash, numero_telephone, type_utilisateur } = req.body;

        const existingUser = await db.query(
            'SELECT * FROM utilisateurs WHERE email = $1 AND id_utilisateur != $2',
            [email, id]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ success: false, message: 'Un autre utilisateur avec cet email existe déjà' });
        }

        const result = await db.query(
            `UPDATE utilisateurs
            SET 
                prenom = COALESCE($1, prenom),
                nom = COALESCE($2, nom),
                email = COALESCE($3, email),
                mot_de_passe_hash = COALESCE($4, mot_de_passe_hash),
                numero_telephone = COALESCE($5, numero_telephone),
                type_utilisateur = COALESCE($6, type_utilisateur),
                date_mise_a_jour = NOW()
            WHERE id_utilisateur = $7
            RETURNING id_utilisateur, prenom, nom, email, numero_telephone, type_utilisateur, date_creation, date_mise_a_jour`,
            [prenom || null, nom || null, email || null, mot_de_passe_hash || null, numero_telephone || null, type_utilisateur || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ success: true, message: 'Utilisateur mis à jour avec succès', data: result.rows[0] });
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ success: false, message: 'Erreur serveur lors de la mise à jour', error: err.message });
    }
});

// DELETE - Supprimer un utilisateur
router.delete('/:id', async(req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ success: false, message: 'ID utilisateur invalide' });
        }

        const result = await db.query(
            `DELETE FROM utilisateurs WHERE id_utilisateur = $1 RETURNING id_utilisateur, prenom, nom, email, numero_telephone, type_utilisateur`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ success: true, message: 'Utilisateur supprimé avec succès', data: result.rows[0] });
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ success: false, message: 'Erreur serveur lors de la suppression', error: err.message });
    }
});

export default router;