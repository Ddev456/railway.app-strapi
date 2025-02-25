
export default {
    routes: [
        {
            method: 'POST',
            path: '/event/generate',
            // access an API service
            handler: 'event.generateForPlant',
            config: {
              description: 'Génère des événements pour une plante dans une zone de jardin spécifique',
              body: {
                type: 'object',
                required: ['plantId', 'areaId', 'configurationId', 'selectedStepsId'],
                properties: {
                  plantId: {
                    type: 'number',
                    description: 'ID de la plante'
                  },
                  areaId: {
                    type: 'number',
                    description: 'ID de la zone'
                  },
                  configurationId: {
                    type: 'number',
                    description: 'ID de la configuration de l assistant'
                  },
                  selectedStepsId: {
                    type: 'array',
                    items: {
                      type: 'number'
                    },
                    description: 'IDs des étapes sélectionnées'
                  }
                }
              }
            }
          }
    ]
  }