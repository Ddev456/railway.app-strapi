import { getWelcomeEmailTemplate } from './utils/email-templates';

export default {
  async bootstrap() {
    // Hook pour la création d'utilisateur
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      async afterCreate(event) {
        const { result } = event;
        
        // Création du gardenerProfile
        try {
          await strapi.documents('api::gardener-profile.gardener-profile').create({
            data: {
              onboarding: false,
              user: result.id,
              experienceLevel: 'Amateur',
              isPublic: false,
              climate: 'Tempéré',
              pseudo: result.username,
              gardenName: "Mon jardin",
              notifications: false,
              gardenSize: 1,
            },
            status: 'published',
          });
        } catch (error) {
          console.error('Error creating gardener profile:', error);
        }

        // Pour les utilisateurs créés via credentials, on n'envoie pas encore le mail
        // Il sera envoyé lors de la confirmation de l'email
      }
    });

    // Hook pour la confirmation d'email (credentials)
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      async afterUpdate(event) {
        const { result, params } = event;
        
        // On vérifie si l'utilisateur vient d'être confirmé
        if (params.data.confirmed === true && !params.data.confirmed_at) {
          try {
            const template = getWelcomeEmailTemplate(result);
            await strapi.plugins['email'].services.email.sendTemplatedEmail(
              {
                to: result.email,
              },
              {
                subject: 'Bienvenue sur Carnet Potager !',
                text: template.text,
                html: template.html,
              }
            );
          } catch (error) {
            console.error('Error sending welcome email:', error);
          }
        }
      }
    });

    // Hook pour la connexion OAuth
    strapi.eventHub.on('admin:auth.success', async (event) => {
      const { user, provider } = event;
      
      if (provider !== 'local' && user.created) {
        // Création du gardenerProfile pour OAuth
        try {
          await strapi.documents('api::gardener-profile.gardener-profile').create({
            data: {
              onboarding: false,
              user: user.id,
              experienceLevel: 'Amateur',
              isPublic: false,
              climate: 'Tempéré',
              pseudo: user.username,
              notifications: true,
              gardenSize: 'small',
            },
            status: 'published',
          });

          // Envoi immédiat du mail de bienvenue pour OAuth
          const template = getWelcomeEmailTemplate(user);
          await strapi.plugins['email'].services.email.sendTemplatedEmail(
            {
              to: user.email,
            },
            {
              subject: 'Bienvenue sur Carnet Potager !',
              text: template.text,
              html: template.html,
            }
          );
        } catch (error) {
          console.error('Error in OAuth flow:', error);
        }
      }
    });
  },
};