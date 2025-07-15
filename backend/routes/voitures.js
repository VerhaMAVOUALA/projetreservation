// routes/voitures.js - Version complète avec création de table et corrections
import express from 'express';
import pool from '../db.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Configuration pour __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, '..', 'uploads', 'cars');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration multer pour l'upload d'images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `car-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Type de fichier non autorisé. Seuls JPEG, JPG, PNG et WEBP sont acceptés'), false);
        }
    }
});

// Middleware pour créer la table si elle n'existe pas
const ensureTableExists = async (req, res, next) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS voitures (
                id SERIAL PRIMARY KEY,
                chauffeur_id INTEGER REFERENCES utilisateurs(id_utilisateur),
                marque VARCHAR(50) NOT NULL,
                modele VARCHAR(50) NOT NULL,
                annee INTEGER NOT NULL,
                immatriculation VARCHAR(20) UNIQUE NOT NULL,
                couleur VARCHAR(30) NOT NULL,
                nombre_places INTEGER NOT NULL,
                type_voiture VARCHAR(50) NOT NULL,
                prix_par_km DECIMAL(10,2) NOT NULL,
                prix_par_heure DECIMAL(10,2) NOT NULL,
                carburant VARCHAR(20) NOT NULL,
                transmission VARCHAR(20) NOT NULL,
                equipements JSONB,
                description TEXT,
                images TEXT[],
                disponible BOOLEAN DEFAULT true,
                date_creation TIMESTAMP DEFAULT NOW(),
                date_mise_a_jour TIMESTAMP DEFAULT NOW()
            )
        `);
        
        // Créer la table reviews si elle n'existe pas
        await pool.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                voiture_id INTEGER REFERENCES voitures(id),
                user_id INTEGER REFERENCES utilisateurs(id_utilisateur),
                rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        
        next();
    } catch (err) {
        console.error('❌ Erreur création table:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la création des tables',
            error: err.message
        });
    }
};

// Validation des données voiture
const validateCar = [
    body('marque').trim().isLength({ min: 2 }).withMessage('La marque doit contenir au moins 2 caractères'),
    body('modele').trim().isLength({ min: 2 }).withMessage('Le modèle doit contenir au moins 2 caractères'),
    body('annee').isInt({ min: 1990, max: new Date().getFullYear() + 1 }).withMessage('Année invalide'),
    body('immatriculation').trim().isLength({ min: 6 }).withMessage('Immatriculation invalide'),
    body('couleur').trim().isLength({ min: 3 }).withMessage('Couleur invalide'),
    body('nombre_places').isInt({ min: 2, max: 9 }).withMessage('Nombre de places invalide (2-9)'),
    body('type_voiture').trim().isLength({ min: 3 }).withMessage('Type de voiture invalide'),
    body('prix_par_km').isFloat({ min: 0 }).withMessage('Prix par km invalide'),
    body('prix_par_heure').isFloat({ min: 0 }).withMessage('Prix par heure invalide'),
    body('carburant').trim().isLength({ min: 3 }).withMessage('Type de carburant invalide'),
    body('transmission').trim().isLength({ min: 4 }).withMessage('Type de transmission invalide'),
    body('description').optional().trim(),
    body('equipements').optional()
];

// Middleware pour gérer les erreurs Multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
            success: false, 
            message: err.code === 'LIMIT_FILE_SIZE' 
                ? 'La taille du fichier dépasse 5MB' 
                : err.message 
        });
    } else if (err) {
        return res.status(400).json({ 
            success: false, 
            message: err.message 
        });
    }
    next();
};

// Middleware optionnel pour l'authentification (pour les routes publiques)
const optionalAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
        // Si un token est fourni, l'utiliser
        authenticateToken(req, res, next);
    } else {
        // Si pas de token, continuer sans authentification
        req.user = null;
        next();
    }
};

// ✅ GET - Toutes les voitures (PUBLIC)
router.get('/', ensureTableExists, async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search, 
            type_voiture, 
            prix_min, 
            prix_max, 
            nombre_places,
            carburant,
            transmission,
            disponible = true
        } = req.query;

        // Validation des paramètres
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const offset = (pageNum - 1) * limitNum;

        let queryParams = [];
        let whereConditions = [];

        // Condition de disponibilité
        if (disponible === 'true') {
            whereConditions.push('v.disponible = true');
        } else if (disponible === 'false') {
            whereConditions.push('v.disponible = false');
        }

        // Recherche générale
        if (search) {
            whereConditions.push(`(v.marque ILIKE $${queryParams.length + 1} OR v.modele ILIKE $${queryParams.length + 1})`);
            queryParams.push(`%${search}%`);
        }

        // Filtres spécifiques
        if (type_voiture) {
            whereConditions.push(`v.type_voiture = $${queryParams.length + 1}`);
            queryParams.push(type_voiture);
        }

        if (prix_min && !isNaN(prix_min)) {
            whereConditions.push(`v.prix_par_km >= $${queryParams.length + 1}`);
            queryParams.push(parseFloat(prix_min));
        }

        if (prix_max && !isNaN(prix_max)) {
            whereConditions.push(`v.prix_par_km <= $${queryParams.length + 1}`);
            queryParams.push(parseFloat(prix_max));
        }

        if (nombre_places && !isNaN(nombre_places)) {
            whereConditions.push(`v.nombre_places >= $${queryParams.length + 1}`);
            queryParams.push(parseInt(nombre_places));
        }

        if (carburant) {
            whereConditions.push(`v.carburant = $${queryParams.length + 1}`);
            queryParams.push(carburant);
        }

        if (transmission) {
            whereConditions.push(`v.transmission = $${queryParams.length + 1}`);
            queryParams.push(transmission);
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        // Requête principale
        const query = `
            SELECT 
                v.*,
                u.prenom as chauffeur_prenom,
                u.nom as chauffeur_nom,
                u.numero_telephone as chauffeur_telephone,
                COALESCE(AVG(r.rating), 0) as moyenne_notes,
                COUNT(r.id) as nombre_avis
            FROM voitures v
            LEFT JOIN utilisateurs u ON v.chauffeur_id = u.id_utilisateur
            LEFT JOIN reviews r ON v.id = r.voiture_id
            ${whereClause}
            GROUP BY v.id, u.prenom, u.nom, u.numero_telephone
            ORDER BY v.date_creation DESC
            LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
        `;

        queryParams.push(limitNum, offset);

        const result = await pool.query(query, queryParams);

        // Compter le total pour la pagination
        const countQuery = `SELECT COUNT(*) as total FROM voitures v ${whereClause}`;
        const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
        const total = parseInt(countResult.rows[0]?.total) || 0;

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (err) {
        console.error('❌ Erreur GET voitures:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur lors de la récupération des voitures',
            error: err.message
        });
    }
});

// ✅ GET - Une voiture spécifique (PUBLIC)
router.get('/:id', ensureTableExists, async (req, res) => {
    try {
        const { id } = req.params;

        // Validation de l'ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'ID de voiture invalide'
            });
        }

        const result = await pool.query(`
            SELECT 
                v.*,
                u.prenom as chauffeur_prenom,
                u.nom as chauffeur_nom,
                u.numero_telephone as chauffeur_telephone,
                COALESCE(AVG(r.rating), 0) as moyenne_notes,
                COUNT(r.id) as nombre_avis
            FROM voitures v
            LEFT JOIN utilisateurs u ON v.chauffeur_id = u.id_utilisateur
            LEFT JOIN reviews r ON v.id = r.voiture_id
            WHERE v.id = $1
            GROUP BY v.id, u.prenom, u.nom, u.numero_telephone
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Voiture non trouvée'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.error('❌ Erreur GET voiture:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: err.message
        });
    }
});

// ✅ POST - Ajouter une voiture (CHAUFFEUR/ADMIN seulement)
router.post('/', 
    ensureTableExists,
    authenticateToken, 
    authorizeRole('chauffeur', 'admin'),
    upload.array('images', 5), // Max 5 images
    handleMulterError,
    validateCar,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Supprimer les fichiers uploadés si validation échoue
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    try {
                        fs.unlinkSync(path.join(uploadDir, file.filename));
                    } catch (err) {
                        console.error('Erreur suppression fichier:', err);
                    }
                });
            }
            return res.status(400).json({ 
                success: false, 
                message: 'Erreurs de validation',
                errors: errors.array() 
            });
        }

        try {
            const {
                marque, modele, annee, immatriculation, couleur,
                nombre_places, type_voiture, prix_par_km, prix_par_heure,
                carburant, transmission, equipements, description
            } = req.body;

            // Vérifier si l'immatriculation existe déjà
            const existingCar = await pool.query(
                'SELECT id FROM voitures WHERE immatriculation = $1',
                [immatriculation]
            );

            if (existingCar.rows.length > 0) {
                // Supprimer les fichiers uploadés
                if (req.files && req.files.length > 0) {
                    req.files.forEach(file => {
                        try {
                            fs.unlinkSync(path.join(uploadDir, file.filename));
                        } catch (err) {
                            console.error('Erreur suppression fichier:', err);
                        }
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: 'Une voiture avec cette immatriculation existe déjà'
                });
            }

            // Traiter les images uploadées
            const images = req.files ? req.files.map(file => `/uploads/cars/${file.filename}`) : [];

            // Traiter les équipements
            let equipementsArray = [];
            try {
                if (equipements) {
                    equipementsArray = typeof equipements === 'string' 
                        ? JSON.parse(equipements) 
                        : equipements;
                }
                if (!Array.isArray(equipementsArray)) {
                    equipementsArray = [];
                }
            } catch (err) {
                console.error('Erreur parsing équipements:', err);
                equipementsArray = [];
            }

            const result = await pool.query(`
                INSERT INTO voitures (
                    chauffeur_id, marque, modele, annee, immatriculation, couleur,
                    nombre_places, type_voiture, prix_par_km, prix_par_heure,
                    carburant, transmission, equipements, description, images,
                    disponible, date_creation, date_mise_a_jour
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, true, NOW(), NOW()
                ) RETURNING *
            `, [
                req.user.id_utilisateur, 
                marque, 
                modele, 
                parseInt(annee), 
                immatriculation, 
                couleur,
                parseInt(nombre_places), 
                type_voiture, 
                parseFloat(prix_par_km), 
                parseFloat(prix_par_heure),
                carburant, 
                transmission, 
                equipementsArray, 
                description, 
                images
            ]);

            res.status(201).json({
                success: true,
                message: 'Voiture ajoutée avec succès',
                data: result.rows[0]
            });
        } catch (err) {
            console.error('❌ Erreur POST voiture:', err);
            
            // Supprimer les fichiers uploadés en cas d'erreur
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    try {
                        fs.unlinkSync(path.join(uploadDir, file.filename));
                    } catch (err) {
                        console.error('Erreur suppression fichier:', err);
                    }
                });
            }
            
            res.status(500).json({ 
                success: false, 
                message: 'Erreur lors de l\'ajout de la voiture',
                error: err.message
            });
        }
    }   
);

// ✅ PUT - Mettre à jour une voiture (CHAUFFEUR/ADMIN seulement)
router.put('/:id', 
    ensureTableExists,
    authenticateToken,
    authorizeRole('chauffeur', 'admin'),
    upload.array('images', 5),
    handleMulterError,
    validateCar,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Supprimer les fichiers uploadés si validation échoue
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    try {
                        fs.unlinkSync(path.join(uploadDir, file.filename));
                    } catch (err) {
                        console.error('Erreur suppression fichier:', err);
                    }
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Erreurs de validation',
                errors: errors.array()
            });
        }

        try {
            const { id } = req.params;
            const {
                marque, modele, annee, immatriculation, couleur,
                nombre_places, type_voiture, prix_par_km, prix_par_heure,
                carburant, transmission, equipements, description
            } = req.body;

            // Validation de l'ID
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de voiture invalide'
                });
            }

            // Vérifier que le chauffeur est propriétaire de la voiture (sauf admin)
            let voitureQuery = 'SELECT chauffeur_id, images FROM voitures WHERE id = $1';
            const voiture = await pool.query(voitureQuery, [id]);
            
            if (voiture.rows.length === 0) {
                // Supprimer les fichiers uploadés
                if (req.files && req.files.length > 0) {
                    req.files.forEach(file => {
                        try {
                            fs.unlinkSync(path.join(uploadDir, file.filename));
                        } catch (err) {
                            console.error('Erreur suppression fichier:', err);
                        }
                    });
                }
                return res.status(404).json({
                    success: false,
                    message: 'Voiture non trouvée'
                });
            }

            if (req.user.type_utilisateur !== 'admin' && 
                voiture.rows[0].chauffeur_id !== req.user.id_utilisateur) {
                // Supprimer les fichiers uploadés
                if (req.files && req.files.length > 0) {
                    req.files.forEach(file => {
                        try {
                            fs.unlinkSync(path.join(uploadDir, file.filename));
                        } catch (err) {
                            console.error('Erreur suppression fichier:', err);
                        }
                    });
                }
                return res.status(403).json({
                    success: false,
                    message: 'Vous n\'êtes pas autorisé à modifier cette voiture'
                });
            }

            // Vérifier unicité immatriculation (exclure la voiture actuelle)
            const existingCar = await pool.query(
                'SELECT id FROM voitures WHERE immatriculation = $1 AND id != $2',
                [immatriculation, id]
            );

            if (existingCar.rows.length > 0) {
                // Supprimer les fichiers uploadés
                if (req.files && req.files.length > 0) {
                    req.files.forEach(file => {
                        try {
                            fs.unlinkSync(path.join(uploadDir, file.filename));
                        } catch (err) {
                            console.error('Erreur suppression fichier:', err);
                        }
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: 'Une autre voiture avec cette immatriculation existe déjà'
                });
            }

            // Traiter les images uploadées
            let images = [];
            if (req.files && req.files.length > 0) {
                images = req.files.map(file => `/uploads/cars/${file.filename}`);
                
                // Supprimer les anciennes images si de nouvelles sont uploadées
                if (voiture.rows[0].images && voiture.rows[0].images.length > 0) {
                    voiture.rows[0].images.forEach(imagePath => {
                        const filename = path.basename(imagePath);
                        try {
                            fs.unlinkSync(path.join(uploadDir, filename));
                        } catch (err) {
                            console.error('Erreur suppression ancienne image:', err);
                        }
                    });
                }
            }

            // Traiter les équipements
            let equipementsArray = [];
            try {
                if (equipements) {
                    equipementsArray = typeof equipements === 'string' 
                        ? JSON.parse(equipements) 
                        : equipements;
                }
                if (!Array.isArray(equipementsArray)) {
                    equipementsArray = [];
                }
            } catch (err) {
                console.error('Erreur parsing équipements:', err);
                equipementsArray = [];
            }

            // Construire la requête de mise à jour
            let updateQuery = `
                UPDATE voitures SET
                    marque = $1,
                    modele = $2,
                    annee = $3,
                    immatriculation = $4,
                    couleur = $5,
                    nombre_places = $6,
                    type_voiture = $7,
                    prix_par_km = $8,
                    prix_par_heure = $9,
                    carburant = $10,
                    transmission = $11,
                    equipements = $12,
                    description = $13,
                    ${images.length > 0 ? 'images = $14,' : ''}
                    date_mise_a_jour = NOW()
                WHERE id = $${images.length > 0 ? '15' : '14'}
                RETURNING *
            `;

            const queryParams = [
                marque, modele, parseInt(annee), immatriculation, couleur,
                parseInt(nombre_places), type_voiture, parseFloat(prix_par_km), 
                parseFloat(prix_par_heure), carburant, transmission, 
                equipementsArray, description
            ];

            if (images.length > 0) {
                queryParams.push(images);
            }
            queryParams.push(id);

            const result = await pool.query(updateQuery, queryParams);

            res.json({
                success: true,
                message: 'Voiture mise à jour avec succès',
                data: result.rows[0]
            });
        } catch (err) {
            console.error('❌ Erreur PUT voiture:', err);
            
            // Supprimer les fichiers uploadés en cas d'erreur
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    try {
                        fs.unlinkSync(path.join(uploadDir, file.filename));
                    } catch (err) {
                        console.error('Erreur suppression fichier:', err);
                    }
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la mise à jour',
                error: err.message
            });
        }
    }
);

// ✅ DELETE - Supprimer une voiture (CHAUFFEUR/ADMIN seulement)
router.delete('/:id', 
    ensureTableExists,
    authenticateToken,
    authorizeRole('chauffeur', 'admin'),
    async (req, res) => {
        try {
            const { id } = req.params;

            // Validation de l'ID
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de voiture invalide'
                });
            }

            // Récupérer les informations de la voiture
            const voiture = await pool.query(
                'SELECT chauffeur_id, images, marque, modele FROM voitures WHERE id = $1',
                [id]
            );
            
            if (voiture.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Voiture non trouvée'
                });
            }

            // Vérifier que le chauffeur est propriétaire de la voiture (sauf admin)
            if (req.user.type_utilisateur !== 'admin' && 
                voiture.rows[0].chauffeur_id !== req.user.id_utilisateur) {
                return res.status(403).json({
                    success: false,
                    message: 'Vous n\'êtes pas autorisé à supprimer cette voiture'
                });
            }

            // Supprimer d'abord les avis associés
            await pool.query('DELETE FROM reviews WHERE voiture_id = $1', [id]);

            // Supprimer la voiture
            const result = await pool.query(`
                DELETE FROM voitures 
                WHERE id = $1
                RETURNING id, marque, modele
            `, [id]);

            // Supprimer les images associées
            if (voiture.rows[0].images && voiture.rows[0].images.length > 0) {
                voiture.rows[0].images.forEach(imagePath => {
                    const filename = path.basename(imagePath);
                    try {
                        fs.unlinkSync(path.join(uploadDir, filename));
                    } catch (err) {
                        console.error('Erreur suppression fichier:', err);
                    }
                });
            }

            res.json({
                success: true,
                message: 'Voiture supprimée avec succès',
                data: result.rows[0]
            });
        } catch (err) {
            console.error('❌ Erreur DELETE voiture:', err);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la suppression',
                error: err.message
            });
        }
    }
);

// ✅ PATCH - Modifier le statut de disponibilité (CHAUFFEUR/ADMIN)
router.patch('/:id/disponibilite', 
    ensureTableExists,
    authenticateToken,
    authorizeRole('chauffeur', 'admin'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { disponible } = req.body;

            // Validation de l'ID
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de voiture invalide'
                });
            }

            // Validation du statut
            if (typeof disponible !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: 'Le statut de disponibilité doit être un boolean'
                });
            }

            // Vérifier que le chauffeur est propriétaire de la voiture (sauf admin)
            if (req.user.type_utilisateur !== 'admin') {
                const voiture = await pool.query(
                    'SELECT chauffeur_id FROM voitures WHERE id = $1',
                    [id]
                );
                
                if (voiture.rows.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Voiture non trouvée'
                    });
                }

                if (voiture.rows[0].chauffeur_id !== req.user.id_utilisateur) {
                    return res.status(403).json({
                        success: false,
                        message: 'Vous n\'êtes pas autorisé à modifier cette voiture'
                    });
                }
            }

            const result = await pool.query(`
                UPDATE voitures 
                SET disponible = $1, date_mise_a_jour = NOW()
                WHERE id = $2
                RETURNING id, marque, modele, disponible
            `, [disponible, id]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Voiture non trouvée'
                });
            }

            res.json({
                success: true,
                message: `Voiture ${disponible ? 'activée' : 'désactivée'} avec succès`,
                data: result.rows[0]
            });
        } catch (err) {
            console.error('❌ Erreur PATCH disponibilité:', err);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur',
                error: err.message
            });
        }
    }
);

// ✅ GET - Voitures d'un chauffeur spécifique (CHAUFFEUR/ADMIN)
router.get('/chauffeur/:chauffeurId', 
    ensureTableExists,
    authenticateToken,
    authorizeRole('chauffeur', 'admin'),
    async (req, res) => {
        try {
            const { chauffeurId } = req.params;
            const { page = 1, limit = 10, disponible } = req.query;

            // Validation de l'ID chauffeur
            if (!chauffeurId || isNaN(parseInt(chauffeurId))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de chauffeur invalide'
                });
            }

            // Un chauffeur ne peut voir que ses propres voitures (sauf admin)
            if (req.user.type_utilisateur !== 'admin' && 
                req.user.id_utilisateur !== parseInt(chauffeurId)) {
                return res.status(403).json({
                    success: false,
                    message: 'Vous n\'êtes pas autorisé à voir ces voitures'
                });
            }

            // Paramètres de pagination
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 10;
            const offset = (pageNum - 1) * limitNum;

            let queryParams = [chauffeurId];
            let whereConditions = ['v.chauffeur_id = $1'];

            // Filtre de disponibilité
            if (disponible !== undefined) {
                whereConditions.push(`v.disponible = ${queryParams.length + 1}`);
                queryParams.push(disponible === 'true');
            }

            const whereClause = whereConditions.join(' AND ');

            // Requête principale
            const query = `
                SELECT 
                    v.*,
                    u.prenom as chauffeur_prenom,
                    u.nom as chauffeur_nom,
                    u.numero_telephone as chauffeur_telephone,
                    COALESCE(AVG(r.rating), 0) as moyenne_notes,
                    COUNT(r.id) as nombre_avis
                FROM voitures v
                LEFT JOIN utilisateurs u ON v.chauffeur_id = u.id_utilisateur
                LEFT JOIN reviews r ON v.id = r.voiture_id
                WHERE ${whereClause}
                GROUP BY v.id, u.prenom, u.nom, u.numero_telephone
                ORDER BY v.date_creation DESC
                LIMIT ${queryParams.length + 1} OFFSET ${queryParams.length + 2}
            `;

            queryParams.push(limitNum, offset);
            const result = await pool.query(query, queryParams);

            // Compter le total
            const countQuery = `SELECT COUNT(*) as total FROM voitures v WHERE ${whereClause}`;
            const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
            const total = parseInt(countResult.rows[0]?.total) || 0;

            res.json({
                success: true,
                data: result.rows,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum)
                }
            });
        } catch (err) {
            console.error('❌ Erreur GET voitures chauffeur:', err);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur',
                error: err.message
            });
        }
    }
);

// ✅ POST - Ajouter un avis sur une voiture (CLIENT authentifié)
router.post('/:id/reviews', 
    ensureTableExists,
    authenticateToken,
    authorizeRole('client', 'admin'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { rating, comment } = req.body;

            // Validation de l'ID
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de voiture invalide'
                });
            }

            // Validation du rating
            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'La note doit être entre 1 et 5'
                });
            }

            // Vérifier que la voiture existe
            const voitureCheck = await pool.query(
                'SELECT id FROM voitures WHERE id = $1',
                [id]
            );

            if (voitureCheck.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Voiture non trouvée'
                });
            }

            // Vérifier si l'utilisateur a déjà donné un avis
            const existingReview = await pool.query(
                'SELECT id FROM reviews WHERE voiture_id = $1 AND user_id = $2',
                [id, req.user.id_utilisateur]
            );

            if (existingReview.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Vous avez déjà donné votre avis sur cette voiture'
                });
            }

            // Ajouter l'avis
            const result = await pool.query(`
                INSERT INTO reviews (voiture_id, user_id, rating, comment, created_at)
                VALUES ($1, $2, $3, $4, NOW())
                RETURNING *
            `, [id, req.user.id_utilisateur, rating, comment || null]);

            res.status(201).json({
                success: true,
                message: 'Avis ajouté avec succès',
                data: result.rows[0]
            });
        } catch (err) {
            console.error('❌ Erreur POST avis:', err);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de l\'ajout de l\'avis',
                error: err.message
            });
        }
    }
);

// ✅ GET - Récupérer les avis d'une voiture (PUBLIC)
router.get('/:id/reviews', 
    ensureTableExists,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { page = 1, limit = 10 } = req.query;

            // Validation de l'ID
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de voiture invalide'
                });
            }

            // Paramètres de pagination
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 10;
            const offset = (pageNum - 1) * limitNum;

            // Vérifier que la voiture existe
            const voitureCheck = await pool.query(
                'SELECT id FROM voitures WHERE id = $1',
                [id]
            );

            if (voitureCheck.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Voiture non trouvée'
                });
            }

            // Récupérer les avis
            const result = await pool.query(`
                SELECT 
                    r.*,
                    u.prenom as user_prenom,
                    u.nom as user_nom
                FROM reviews r
                LEFT JOIN utilisateurs u ON r.user_id = u.id_utilisateur
                WHERE r.voiture_id = $1
                ORDER BY r.created_at DESC
                LIMIT $2 OFFSET $3
            `, [id, limitNum, offset]);

            // Compter le total
            const countResult = await pool.query(
                'SELECT COUNT(*) as total FROM reviews WHERE voiture_id = $1',
                [id]
            );
            const total = parseInt(countResult.rows[0]?.total) || 0;

            // Calculer les statistiques
            const statsResult = await pool.query(`
                SELECT 
                    AVG(rating) as moyenne,
                    COUNT(*) as total_avis,
                    COUNT(CASE WHEN rating = 5 THEN 1 END) as rating_5,
                    COUNT(CASE WHEN rating = 4 THEN 1 END) as rating_4,
                    COUNT(CASE WHEN rating = 3 THEN 1 END) as rating_3,
                    COUNT(CASE WHEN rating = 2 THEN 1 END) as rating_2,
                    COUNT(CASE WHEN rating = 1 THEN 1 END) as rating_1
                FROM reviews 
                WHERE voiture_id = $1
            `, [id]);

            const stats = statsResult.rows[0];

            res.json({
                success: true,
                data: result.rows,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum)
                },
                statistics: {
                    moyenne: parseFloat(stats.moyenne || 0).toFixed(1),
                    total_avis: parseInt(stats.total_avis || 0),
                    repartition: {
                        5: parseInt(stats.rating_5 || 0),
                        4: parseInt(stats.rating_4 || 0),
                        3: parseInt(stats.rating_3 || 0),
                        2: parseInt(stats.rating_2 || 0),
                        1: parseInt(stats.rating_1 || 0)
                    }
                }
            });
        } catch (err) {
            console.error('❌ Erreur GET avis:', err);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur',
                error: err.message
            });
        }
    }
);

// ✅ GET - Statistiques des voitures (ADMIN seulement)
router.get('/stats/global', 
    ensureTableExists,
    authenticateToken,
    authorizeRole('admin'),
    async (req, res) => {
        try {
            // Statistiques générales
            const globalStats = await pool.query(`
                SELECT 
                    COUNT(*) as total_voitures,
                    COUNT(CASE WHEN disponible = true THEN 1 END) as voitures_disponibles,
                    COUNT(CASE WHEN disponible = false THEN 1 END) as voitures_indisponibles,
                    AVG(prix_par_km) as prix_moyen_km,
                    AVG(prix_par_heure) as prix_moyen_heure,
                    COUNT(DISTINCT chauffeur_id) as nombre_chauffeurs
                FROM voitures
            `);

            // Répartition par type
            const typeStats = await pool.query(`
                SELECT 
                    type_voiture,
                    COUNT(*) as nombre,
                    AVG(prix_par_km) as prix_moyen_km
                FROM voitures
                GROUP BY type_voiture
                ORDER BY nombre DESC
            `);

            // Répartition par carburant
            const carburantStats = await pool.query(`
                SELECT 
                    carburant,
                    COUNT(*) as nombre
                FROM voitures
                GROUP BY carburant
                ORDER BY nombre DESC
            `);

            // Top chauffeurs
            const topChauffeurs = await pool.query(`
                SELECT 
                    u.prenom,
                    u.nom,
                    COUNT(v.id) as nombre_voitures,
                    AVG(r.rating) as moyenne_notes
                FROM utilisateurs u
                LEFT JOIN voitures v ON u.id_utilisateur = v.chauffeur_id
                LEFT JOIN reviews r ON v.id = r.voiture_id
                WHERE u.type_utilisateur = 'chauffeur'
                GROUP BY u.id_utilisateur, u.prenom, u.nom
                HAVING COUNT(v.id) > 0
                ORDER BY nombre_voitures DESC, moyenne_notes DESC
                LIMIT 10
            `);

            res.json({
                success: true,
                data: {
                    global: globalStats.rows[0],
                    par_type: typeStats.rows,
                    par_carburant: carburantStats.rows,
                    top_chauffeurs: topChauffeurs.rows
                }
            });
        } catch (err) {
            console.error('❌ Erreur GET stats:', err);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur',
                error: err.message
            });
        }
    }
);

export default router;