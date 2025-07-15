// controllers/authController.js
import AuthService from '../services/authService.js';
import { validateRegistration, validateLogin, validateEmail, validatePassword } from '../utils/validators.js';

class AuthController {
    // Inscription
    async register(req, res) {
        try {
            // Validation des données
            const validationErrors = validateRegistration(req.body);
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Erreurs de validation',
                    errors: validationErrors
                });
            }

            // Appel au service d'authentification
            const result = await AuthService.registerUser(req.body);

            return res.status(201).json(result);
        } catch (error) {
            console.error('Erreur inscription:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur serveur lors de l\'inscription'
            });
        }
    }

    // Connexion
    async login(req, res) {
        try {
            // Validation des données
            const validationErrors = validateLogin(req.body);
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Erreurs de validation',
                    errors: validationErrors
                });
            }

            const { email, mot_de_passe } = req.body;

            // Appel au service d'authentification
            const result = await AuthService.loginUser(email, mot_de_passe);

            // Définir le token dans un cookie HTTPOnly (optionnel)
            res.cookie('authToken', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
            });

            return res.status(200).json(result);
        } catch (error) {
            console.error('Erreur connexion:', error);
            return res.status(401).json({
                success: false,
                message: error.message || 'Erreur lors de la connexion'
            });
        }
    }

    // Déconnexion
    async logout(req, res) {
        try {
            // Supprimer le cookie (si utilisé)
            res.clearCookie('authToken');

            // Optionnel: Ajouter le token à une blacklist
            // const token = req.headers.authorization?.split(' ')[1];
            // if (token) {
            //     await TokenService.blacklistToken(token);
            // }

            return res.status(200).json({
                success: true,
                message: 'Déconnexion réussie'
            });
        } catch (error) {
            console.error('Erreur déconnexion:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de la déconnexion'
            });
        }
    }

    // Vérification de l'email
    async verifyEmail(req, res) {
        try {
            const { token } = req.params;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Token de vérification requis'
                });
            }

            const result = await AuthService.verifyEmail(token);

            return res.status(200).json(result);
        } catch (error) {
            console.error('Erreur vérification email:', error);
            return res.status(400).json({
                success: false,
                message: error.message || 'Erreur lors de la vérification'
            });
        }
    }

    // Renvoyer email de vérification
    async resendVerificationEmail(req, res) {
        try {
            const { email } = req.body;

            const validationErrors = validateEmail(email);
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email invalide',
                    errors: validationErrors
                });
            }

            // Logique pour renvoyer l'email de vérification
            // À implémenter dans AuthService
            
            return res.status(200).json({
                success: true,
                message: 'Email de vérification renvoyé'
            });
        } catch (error) {
            console.error('Erreur renvoi email:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors du renvoi'
            });
        }
    }

    // Demande de réinitialisation du mot de passe
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            const validationErrors = validateEmail(email);
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email invalide',
                    errors: validationErrors
                });
            }

            const result = await AuthService.forgotPassword(email);

            return res.status(200).json(result);
        } catch (error) {
            console.error('Erreur forgot password:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la demande'
            });
        }
    }

    // Réinitialisation du mot de passe
    async resetPassword(req, res) {
        try {
            const { token, nouveauMotDePasse } = req.body;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Token requis'
                });
            }

            const validationErrors = validatePassword(nouveauMotDePasse);
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Mot de passe invalide',
                    errors: validationErrors
                });
            }

            const result = await AuthService.resetPassword(token, nouveauMotDePasse);

            return res.status(200).json(result);
        } catch (error) {
            console.error('Erreur reset password:', error);
            return res.status(400).json({
                success: false,
                message: error.message || 'Erreur lors de la réinitialisation'
            });
        }
    }

    // Obtenir le profil utilisateur
    async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const user = await AuthService.getUserById(userId);

            return res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Erreur profil:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la récupération du profil'
            });
        }
    }

    // Changer le mot de passe
    async changePassword(req, res) {
        try {
            const userId = req.user.id;
            const { motDePasseActuel, nouveauMotDePasse } = req.body;

            // Validation
            const validationErrors = [
                ...validatePassword(motDePasseActuel, 'Mot de passe actuel'),
                ...validatePassword(nouveauMotDePasse, 'Nouveau mot de passe')
            ];

            if (validationErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Erreurs de validation',
                    errors: validationErrors
                });
            }

            const result = await AuthService.changePassword(userId, motDePasseActuel, nouveauMotDePasse);

            return res.status(200).json(result);
        } catch (error) {
            console.error('Erreur changement mot de passe:', error);
            return res.status(400).json({
                success: false,
                message: error.message || 'Erreur lors du changement de mot de passe'
            });
        }
    }

    // Vérifier si l'utilisateur est connecté
    async checkAuth(req, res) {
        try {
            const user = req.user;
            return res.status(200).json({
                success: true,
                message: 'Utilisateur authentifié',
                user: {
                    id: user.id_utilisateur,
                    prenom: user.prenom,
                    nom: user.nom,
                    email: user.email,
                    type_utilisateur: user.type_utilisateur,
                    email_verifie: user.email_verifie
                }
            });
        } catch (error) {
            console.error('Erreur check auth:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de la vérification'
            });
        }
    }
}

export default new AuthController();