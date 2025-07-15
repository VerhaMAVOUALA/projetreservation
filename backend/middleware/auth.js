// middleware/auth.js
import jwt from 'jsonwebtoken';
import pool from '../db.js';

// Middleware de vérification du token JWT
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token d\'accès requis' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Vérifier si l'utilisateur existe encore
        const user = await pool.query(
            'SELECT id_utilisateur, email, type_utilisateur FROM utilisateurs WHERE id_utilisateur = $1',
            [decoded.id]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Utilisateur non valide' 
            });
        }

        req.user = user.rows[0];
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expiré' 
            });
        }
        
        return res.status(401).json({ 
            success: false, 
            message: 'Token invalide' 
        });
    }
};

// Middleware pour vérifier le rôle utilisateur
export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Utilisateur non authentifié' 
            });
        }

        if (!roles.includes(req.user.type_utilisateur)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Accès refusé - Privilèges insuffisants' 
            });
        }

        next();
    };
};

// Middleware pour vérifier si l'utilisateur est le propriétaire ou admin
export const authorizeOwnerOrAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id_utilisateur;
        const userType = req.user.type_utilisateur;

        // Admin peut tout faire
        if (userType === 'admin') {
            return next();
        }

        // Utilisateur peut seulement accéder à ses propres données
        if (parseInt(id) === userId) {
            return next();
        }

        return res.status(403).json({ 
            success: false, 
            message: 'Accès refusé - Vous ne pouvez accéder qu\'à vos propres données' 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur lors de la vérification des autorisations' 
        });
    }
};