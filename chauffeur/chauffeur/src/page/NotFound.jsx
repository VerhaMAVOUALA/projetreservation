import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  // Récupère l'emplacement actuel (URL) avec le hook useLocation
  const location = useLocation();

  // Effet pour logger l'erreur 404 dans la console
  useEffect(() => {
    console.error(
      "404 Error: L'utilisateur a tenté d'accéder à une route inexistante:",
      location.pathname
    );
  }, [location.pathname]); // Se déclenche quand le chemin change

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        {/* Titre d'erreur */}
        <h1 className="text-4xl font-bold mb-4">404</h1>
        
        {/* Message d'erreur */}
        <p className="text-xl text-gray-600 mb-4">Oups ! Page non trouvée</p>
        
        {/* Lien pour retourner à l'accueil */}
        <a 
          href="/" 
          className="text-blue-500 hover:text-blue-700 underline transition-colors"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;