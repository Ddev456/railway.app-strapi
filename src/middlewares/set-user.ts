"use strict";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Vérifiez si la méthode de la requête est POST
    if (ctx.request.method === 'POST') {
      // Assurez-vous que l'utilisateur est authentifié
      if (ctx.state.user) {
        // Ajoutez l'ID de l'utilisateur à la requête
        ctx.request.body.data.user = ctx.state.user.id; // 'user' doit correspondre au nom du champ de relation dans votre modèle
      } else {
        // Si l'utilisateur n'est pas authentifié, retournez une erreur
        return ctx.unauthorized('Vous devez être connecté pour créer une entrée.');
      }
    }
    
    // Passez au middleware suivant
    await next();
  };
};