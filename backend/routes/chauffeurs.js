import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = (req, res, next) => {
    if (req.user.type_utilisateur !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé. Admin requis.' });
    }
    next();
};

// ✅ Récupérer tous les chauffeurs (accessible par admin et chauffeur lui-même)
router.get('/', authenticateToken, async(req, res) => {
    console.log("✅ Requête GET reçue sur /api/chauffeurs");
    try {
        let query = 'SELECT id_utilisateur, prenom, nom, email, numero_telephone, date_creation FROM utilisateurs WHERE type_utilisateur = $1';
        const queryParams = ['chauffeur'];

        // Si c'est un chauffeur (et non admin), on ne retourne que son propre profil
        if (req.user.type_utilisateur === 'chauffeur') {
            query += ' AND id_utilisateur = $2';
            queryParams.push(req.user.userId);
        }

        const result = await pool.query(query, queryParams);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Aucun chauffeur trouvé', data: [] });
        }
        
        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error('❌ Erreur chauffeurs GET:', err.message);
        res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
    }
});

// ✅ Ajouter un chauffeur (admin seulement)
router.post('/', authenticateToken, isAdmin, async(req, res) => {
    try {
        const { prenom, nom, email, numero_telephone, mot_de_passe } = req.body;

        // Validation simple
        if (!prenom || !nom || !email || !numero_telephone || !mot_de_passe) {
            return res.status(400).json({ 
                success: false,
                message: 'Tous les champs sont obligatoires' 
            });
        }

        // Vérifier si l'email existe déjà
        const emailCheck = await pool.query(
            'SELECT * FROM utilisateurs WHERE email = $1', 
            [email]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }

        // Insérer le nouveau chauffeur
        const result = await pool.query(
            `INSERT INTO utilisateurs 
            (prenom, nom, email, numero_telephone, mot_de_passe_hash, type_utilisateur, date_creation, date_mise_a_jour)
            VALUES ($1, $2, $3, $4, $5, 'chauffeur', NOW(), NOW())
            RETURNING id_utilisateur, prenom, nom, email, numero_telephone`,
            [prenom, nom, email, numero_telephone, mot_de_passe]
        );

        res.status(201).json({
            success: true,
            message: 'Chauffeur créé avec succès',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('❌ Erreur chauffeurs POST:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Erreur serveur',
            error: err.message 
        });
    }
});

// ✅ Récupérer un chauffeur par ID
router.get('/:id', authenticateToken, async(req, res) => {
    try {
        const { id } = req.params;

        // Vérifier que l'utilisateur a le droit d'accéder à cette ressource
        if (req.user.type_utilisateur !== 'admin' && req.user.userId !== parseInt(id)) {
            return res.status(403).json({ 
                success: false,
                message: 'Accès non autorisé' 
            });
        }

        const result = await pool.query(
            `SELECT id_utilisateur, prenom, nom, email, numero_telephone, date_creation 
             FROM utilisateurs 
             WHERE id_utilisateur = $1 AND type_utilisateur = 'chauffeur'`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Chauffeur non trouvé' 
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.error('❌ Erreur chauffeurs GET by ID:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Erreur serveur',
            error: err.message 
        });
    }
});

// ✅ Mettre à jour un chauffeur par ID (admin ou le chauffeur lui-même)
router.put('/:id', authenticateToken, async(req, res) => {
    try {
        const { id } = req.params;
        const { prenom, nom, email, numero_telephone } = req.body;

        // Vérifier que l'utilisateur a le droit de modifier cette ressource
        if (req.user.type_utilisateur !== 'admin' && req.user.userId !== parseInt(id)) {
            return res.status(403).json({ 
                success: false,
                message: 'Accès non autorisé' 
            });
        }

        // Vérifier si l'email existe déjà pour un autre utilisateur
        if (email) {
            const emailCheck = await pool.query(
                'SELECT * FROM utilisateurs WHERE email = $1 AND id_utilisateur != $2',
                [email, id]
            );

            if (emailCheck.rows.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Un autre utilisateur avec cet email existe déjà'
                });
            }
        }

        const result = await pool.query(
            `UPDATE utilisateurs 
             SET 
                prenom = COALESCE($1, prenom),
                nom = COALESCE($2, nom),
                email = COALESCE($3, email),
                numero_telephone = COALESCE($4, numero_telephone),
                date_mise_a_jour = NOW()
             WHERE id_utilisateur = $5 AND type_utilisateur = 'chauffeur'
             RETURNING id_utilisateur, prenom, nom, email, numero_telephone`,
            [prenom, nom, email, numero_telephone, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Chauffeur non trouvé' 
            });
        }

        res.json({
            success: true,
            message: 'Chauffeur mis à jour avec succès',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('❌ Erreur chauffeurs PUT:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Erreur serveur',
            error: err.message 
        });
    }
});

// ✅ Supprimer un chauffeur par ID (admin seulement)
router.delete('/:id', authenticateToken, isAdmin, async(req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM utilisateurs 
             WHERE id_utilisateur = $1 AND type_utilisateur = 'chauffeur'
             RETURNING id_utilisateur, prenom, nom, email`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Chauffeur non trouvé' 
            });
        }

        res.json({
            success: true,
            message: 'Chauffeur supprimé avec succès',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('❌ Erreur chauffeurs DELETE:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Erreur serveur',
            error: err.message 
        });
    }
});

export default router;