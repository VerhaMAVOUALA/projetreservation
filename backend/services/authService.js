// services/authService.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../db.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService.js';

class AuthService {
    constructor() {
        this.saltRounds = 12;
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    }

    // Hachage du mot de passe
    async hashPassword(password) {
        try {
            return await bcrypt.hash(password, this.saltRounds);
        } catch (error) {
            throw new Error('Erreur lors du hachage du mot de passe');
        }
    }

    // Vérification du mot de passe
    async verifyPassword(password, hashedPassword) {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            throw new Error('Erreur lors de la vérification du mot de passe');
        }
    }

    // Génération du token JWT
    generateToken(payload) {
        try {
            return jwt.sign(payload, this.jwtSecret, { 
                expiresIn: this.jwtExpiresIn,
                issuer: 'votre-app-name'
            });
        } catch (error) {
            throw new Error('Erreur lors de la génération du token');
        }
    }

    // Vérification du token JWT
    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token expiré');
            } else if (error.name === 'JsonWebTokenError') {
                throw new Error('Token invalide');
            }
            throw new Error('Erreur lors de la vérification du token');
        }
    }

    // Génération d'un token aléatoire
    generateRandomToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    // Inscription d'un utilisateur
    async registerUser(userData) {
        const { prenom, nom, email, mot_de_passe, numero_telephone, type_utilisateur } = userData;
        
        try {
            // Vérifier si l'email existe déjà
            const existingUser = await db.query(
                'SELECT id_utilisateur FROM utilisateurs WHERE email = $1',
                [email]
            );

            if (existingUser.rows.length > 0) {
                throw new Error('Un utilisateur avec cet email existe déjà');
            }

            // Hasher le mot de passe
            const hashedPassword = await this.hashPassword(mot_de_passe);

            // Générer token de vérification email
            const emailToken = this.generateRandomToken();
            const emailTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

            // Insérer l'utilisateur
            const result = await db.query(
                `INSERT INTO utilisateurs 
                (prenom, nom, email, mot_de_passe_hash, numero_telephone, type_utilisateur, 
                 email_verifie, email_token, email_token_expiry, date_creation, date_mise_a_jour)
                VALUES ($1, $2, $3, $4, $5, $6, false, $7, $8, NOW(), NOW())
                RETURNING id_utilisateur, prenom, nom, email, numero_telephone, type_utilisateur, email_verifie`,
                [prenom, nom, email, hashedPassword, numero_telephone, type_utilisateur, emailToken, emailTokenExpiry]
            );

            const user = result.rows[0];

            // Envoyer email de vérification
            await sendVerificationEmail(email, emailToken, prenom);

            return {
                success: true,
                message: 'Inscription réussie. Veuillez vérifier votre email.',
                user: {
                    id: user.id_utilisateur,
                    prenom: user.prenom,
                    nom: user.nom,
                    email: user.email,
                    type_utilisateur: user.type_utilisateur,
                    email_verifie: user.email_verifie
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // Connexion d'un utilisateur
    async loginUser(email, password) {
        try {
            // Rechercher l'utilisateur
            const result = await db.query(
                'SELECT * FROM utilisateurs WHERE email = $1',
                [email]
            );

            if (result.rows.length === 0) {
                throw new Error('Identifiants incorrects');
            }

            const user = result.rows[0];

            // Vérifier le mot de passe
            const isPasswordValid = await this.verifyPassword(password, user.mot_de_passe_hash);
            if (!isPasswordValid) {
                throw new Error('Identifiants incorrects');
            }

            // Mettre à jour la dernière connexion
            await db.query(
                'UPDATE utilisateurs SET derniere_connexion = NOW() WHERE id_utilisateur = $1',
                [user.id_utilisateur]
            );

            // Générer le token JWT
            const token = this.generateToken({
                id: user.id_utilisateur,
                email: user.email,
                type: user.type_utilisateur
            });

            return {
                success: true,
                message: 'Connexion réussie',
                token,
                user: {
                    id: user.id_utilisateur,
                    prenom: user.prenom,
                    nom: user.nom,
                    email: user.email,
                    type_utilisateur: user.type_utilisateur,
                    email_verifie: user.email_verifie
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // Vérification de l'email
    async verifyEmail(token) {
        try {
            const result = await db.query(
                'SELECT id_utilisateur, prenom, email FROM utilisateurs WHERE email_token = $1 AND email_token_expiry > NOW()',
                [token]
            );

            if (result.rows.length === 0) {
                throw new Error('Token de vérification invalide ou expiré');
            }

            const user = result.rows[0];

            // Marquer l'email comme vérifié
            await db.query(
                'UPDATE utilisateurs SET email_verifie = true, email_token = NULL, email_token_expiry = NULL WHERE id_utilisateur = $1',
                [user.id_utilisateur]
            );

            return {
                success: true,
                message: 'Email vérifié avec succès',
                user: {
                    id: user.id_utilisateur,
                    prenom: user.prenom,
                    email: user.email
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // Demande de réinitialisation du mot de passe
    async forgotPassword(email) {
        try {
            const result = await db.query(
                'SELECT id_utilisateur, prenom FROM utilisateurs WHERE email = $1',
                [email]
            );

            if (result.rows.length === 0) {
                // Ne pas révéler si l'email existe ou non
                return {
                    success: true,
                    message: 'Si l\'email existe, un lien de réinitialisation a été envoyé'
                };
            }

            const user = result.rows[0];

            // Générer token de réinitialisation
            const resetToken = this.generateRandomToken();
            const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

            // Sauvegarder le token
            await db.query(
                'UPDATE utilisateurs SET reset_token = $1, reset_token_expiry = $2 WHERE id_utilisateur = $3',
                [resetToken, resetTokenExpiry, user.id_utilisateur]
            );

            // Envoyer email de réinitialisation
            await sendPasswordResetEmail(email, resetToken, user.prenom);

            return {
                success: true,
                message: 'Si l\'email existe, un lien de réinitialisation a été envoyé'
            };
        } catch (error) {
            throw error;
        }
    }

    // Réinitialisation du mot de passe
    async resetPassword(token, newPassword) {
        try {
            const result = await db.query(
                'SELECT id_utilisateur FROM utilisateurs WHERE reset_token = $1 AND reset_token_expiry > NOW()',
                [token]
            );

            if (result.rows.length === 0) {
                throw new Error('Token de réinitialisation invalide ou expiré');
            }

            const user = result.rows[0];

            // Hasher le nouveau mot de passe
            const hashedPassword = await this.hashPassword(newPassword);

            // Mettre à jour le mot de passe
            await db.query(
                'UPDATE utilisateurs SET mot_de_passe_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id_utilisateur = $2',
                [hashedPassword, user.id_utilisateur]
            );

            return {
                success: true,
                message: 'Mot de passe réinitialisé avec succès'
            };
        } catch (error) {
            throw error;
        }
    }

    // Obtenir les informations d'un utilisateur par ID
    async getUserById(id) {
        try {
            const result = await db.query(
                'SELECT id_utilisateur, prenom, nom, email, numero_telephone, type_utilisateur, email_verifie, date_creation FROM utilisateurs WHERE id_utilisateur = $1',
                [id]
            );

            if (result.rows.length === 0) {
                throw new Error('Utilisateur non trouvé');
            }

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Changer le mot de passe (utilisateur connecté)
    async changePassword(userId, currentPassword, newPassword) {
        try {
            // Récupérer l'utilisateur avec son mot de passe actuel
            const result = await db.query(
                'SELECT mot_de_passe_hash FROM utilisateurs WHERE id_utilisateur = $1',
                [userId]
            );

            if (result.rows.length === 0) {
                throw new Error('Utilisateur non trouvé');
            }

            const user = result.rows[0];

            // Vérifier le mot de passe actuel
            const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user.mot_de_passe_hash);
            if (!isCurrentPasswordValid) {
                throw new Error('Mot de passe actuel incorrect');
            }

            // Hasher le nouveau mot de passe
            const hashedNewPassword = await this.hashPassword(newPassword);

            // Mettre à jour le mot de passe
            await db.query(
                'UPDATE utilisateurs SET mot_de_passe_hash = $1, date_mise_a_jour = NOW() WHERE id_utilisateur = $2',
                [hashedNewPassword, userId]
            );

            return {
                success: true,
                message: 'Mot de passe modifié avec succès'
            };
        } catch (error) {
            throw error;
        }
    }
}

export default new AuthService();