// services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du transporteur email
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true pour 465, false pour autres ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Vérifier la configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Erreur configuration email:', error);
    } else {
        console.log('✅ Service email configuré correctement');
    }
});

// Template email de confirmation de réservation
const reservationConfirmationTemplate = (reservationData) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { padding: 20px; text-align: center; color: #666; }
            .btn { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Confirmation de Réservation</h1>
            </div>
            <div class="content">
                <h2>Bonjour ${reservationData.client_nom},</h2>
                <p>Votre réservation a été confirmée avec succès !</p>
                
                <h3>Détails de la réservation :</h3>
                <ul>
                    <li><strong>Véhicule :</strong> ${reservationData.voiture}</li>
                    <li><strong>Date de début :</strong> ${new Date(reservationData.date_debut).toLocaleDateString('fr-FR')}</li>
                    <li><strong>Date de fin :</strong> ${new Date(reservationData.date_fin).toLocaleDateString('fr-FR')}</li>
                    <li><strong>Lieu de départ :</strong> ${reservationData.lieu_depart}</li>
                    <li><strong>Lieu d'arrivée :</strong> ${reservationData.lieu_arrivee}</li>
                    <li><strong>Prix total :</strong> ${reservationData.prix_total} €</li>
                </ul>
                
                <p>Vous recevrez un SMS de confirmation 24h avant votre rendez-vous.</p>
                
                <p>Merci de votre confiance !</p>
            </div>
            <div class="footer">
                <p>© 2025 VotrePlateforme - Service de réservation de voitures</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Template email de bienvenue
const welcomeTemplate = (userData) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28a745; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { padding: 20px; text-align: center; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Bienvenue sur notre plateforme !</h1>
            </div>
            <div class="content">
                <h2>Bonjour ${userData.prenom} ${userData.nom},</h2>
                <p>Merci de vous être inscrit sur notre plateforme de réservation de voitures avec chauffeur.</p>
                
                <p>Votre compte a été créé avec succès. Vous pouvez maintenant :</p>
                <ul>
                    <li>Rechercher et réserver des voitures</li>
                    <li>Gérer vos réservations</li>
                    <li>Suivre l'historique de vos trajets</li>
                    ${userData.type_utilisateur === 'chauffeur' ? '<li>Ajouter et gérer vos véhicules</li>' : ''}
                </ul>
                
                <p>Bonne route avec nous !</p>
            </div>
            <div class="footer">
                <p>© 2025 VotrePlateforme - Service de réservation de voitures</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Fonction pour envoyer email de confirmation de réservation
export const sendReservationConfirmation = async (email, reservationData) => {
    try {
        const mailOptions = {
            from: `"VotrePlateforme" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Confirmation de votre réservation',
            html: reservationConfirmationTemplate(reservationData)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de confirmation envoyé:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Erreur envoi email:', error);
        return { success: false, error: error.message };
    }
};

// Fonction pour envoyer email de bienvenue
export const sendWelcomeEmail = async (email, userData) => {
    try {
        const mailOptions = {
            from: `"VotrePlateforme" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Bienvenue sur notre plateforme !',
            html: welcomeTemplate(userData)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de bienvenue envoyé:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Erreur envoi email:', error);
        return { success: false, error: error.message };
    }
};

// Fonction pour envoyer email de réinitialisation mot de passe
export const sendPasswordReset = async (email, resetToken) => {
    try {
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: `"VotrePlateforme" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <h2>Réinitialisation de mot de passe</h2>
                    <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
                    <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
                    <a href="${resetUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Réinitialiser mon mot de passe
                    </a>
                    <p>Ce lien expirera dans 1 heure.</p>
                    <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de réinitialisation envoyé:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Erreur envoi email:', error);
        return { success: false, error: error.message };
    }
};