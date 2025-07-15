// routes/reservations.js
import express from 'express';
import pool from '../db.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// ✅ Middleware de validation
const validateReservation = [
    body('voiture_id').isInt().withMessage('ID voiture invalide'),
    body('date_debut').isISO8601().withMessage('Date de début invalide'),
    body('date_fin').isISO8601().withMessage('Date de fin invalide'),
    body('client_nom').isString().notEmpty().withMessage('Nom client requis'),
    body('client_email').isEmail().withMessage('Email client invalide'),
    body('client_telephone').isString().notEmpty().withMessage('Téléphone client requis'),
    body('lieu_depart').isString().notEmpty().withMessage('Lieu de départ requis'),
    body('lieu_arrivee').isString().notEmpty().withMessage('Lieu d\'arrivée requis')
];

// ✅ GET - Toutes les réservations
router.get('/', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reservations ORDER BY date_debut DESC');
        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (err) {
        console.error('❌ Erreur GET réservations:', err.message);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// ✅ POST - Ajouter une réservation
router.post('/', validateReservation, async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const {
            voiture_id,
            date_debut,
            date_fin,
            client_nom,
            client_email,
            client_telephone,
            commentaires,
            lieu_depart,
            lieu_arrivee,
            passagers,
            bagages,
            duree,
            prix_total
        } = req.body;

        // Vérifier disponibilité
        const availabilityCheck = await pool.query(`
            SELECT id FROM reservations 
            WHERE voiture_id = $1 
            AND (
                (date_debut <= $2 AND date_fin >= $2) OR
                (date_debut <= $3 AND date_fin >= $3) OR
                (date_debut >= $2 AND date_fin <= $3)
            )
        `, [voiture_id, date_debut, date_fin]);

        if (availabilityCheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Le véhicule n\'est pas disponible pour cette période'
            });
        }

        const result = await pool.query(`
            INSERT INTO reservations (
                voiture_id, date_debut, date_fin, statut,
                client_nom, client_email, client_telephone,
                commentaires, lieu_depart, lieu_arrivee,
                passagers, bagages, duree, prix_total
            ) VALUES (
                $1, $2, $3, 'confirmée',
                $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            ) RETURNING *
        `, [
            voiture_id, date_debut, date_fin,
            client_nom, client_email, client_telephone,
            commentaires || null, lieu_depart, lieu_arrivee,
            passagers, bagages, duree, prix_total
        ]);

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Réservation créée avec succès'
        });
    } catch (err) {
        console.error('❌ Erreur POST réservations:', err.message);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// ✅ GET - Récupérer par ID
router.get('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT r.*, v.marque, v.modele, v.immatriculation
            FROM reservations r
            JOIN voitures v ON r.voiture_id = v.id
            WHERE r.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.error('❌ Erreur GET reservation by ID:', err.message);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// ✅ PUT - Modifier une réservation
router.put('/:id', validateReservation, async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const {
            voiture_id,
            date_debut,
            date_fin,
            statut,
            client_nom,
            client_email,
            client_telephone,
            commentaires,
            lieu_depart,
            lieu_arrivee,
            passagers,
            bagages,
            duree,
            prix_total
        } = req.body;

        // Vérifier disponibilité (hors cette réservation)
        const availabilityCheck = await pool.query(`
            SELECT id FROM reservations 
            WHERE voiture_id = $1 AND id != $2
            AND (
                (date_debut <= $3 AND date_fin >= $3) OR
                (date_debut <= $4 AND date_fin >= $4) OR
                (date_debut >= $3 AND date_fin <= $4)
            )
        `, [voiture_id, id, date_debut, date_fin]);

        if (availabilityCheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Le véhicule n\'est pas disponible pour cette période'
            });
        }

        const result = await pool.query(`
            UPDATE reservations SET
                voiture_id = $1,
                date_debut = $2,
                date_fin = $3,
                statut = $4,
                client_nom = $5,
                client_email = $6,
                client_telephone = $7,
                commentaires = $8,
                lieu_depart = $9,
                lieu_arrivee = $10,
                passagers = $11,
                bagages = $12,
                duree = $13,
                prix_total = $14,
                updated_at = NOW()
            WHERE id = $15
            RETURNING *
        `, [
            voiture_id, date_debut, date_fin, statut,
            client_nom, client_email, client_telephone,
            commentaires || null, lieu_depart, lieu_arrivee,
            passagers, bagages, duree, prix_total,
            id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        res.json({
            success: true,
            data: result.rows[0],
            message: 'Réservation mise à jour avec succès'
        });
    } catch (err) {
        console.error('❌ Erreur PUT réservation:', err.message);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// ✅ DELETE - Supprimer une réservation
router.delete('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM reservations WHERE id = $1 RETURNING *', [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        res.json({
            success: true,
            message: 'Réservation supprimée avec succès'
        });
    } catch (err) {
        console.error('❌ Erreur DELETE réservation:', err.message);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

export default router;