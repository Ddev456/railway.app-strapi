import cultivationStep from "../../cultivation-step/routes/cultivation-step";
import configuration from "../../configuration/routes/configuration";
import area from "../../area/routes/area";
import plant from "../../plant/routes/plant";

export default {
    routes: [
        {
            method: 'POST',
            path: '/event/generate',
            handler: 'event.generateForPlant',
            config: {
              description: 'Génère des événements pour une plante dans une zone de jardin spécifique',
              body: {
                type: 'object',
                required: ['plant', 'area', 'configuration', 'selectedSteps', 'climate'],
                properties: {
                  plant: {
                    type: plant,
                    description: 'La plante'
                  },
                  area: {
                    type: area,
                    description: 'La zone'
                  },
                  configuration: {
                    type: configuration,
                    description: 'La configuration de l assistant'
                  },
                  selectedSteps: {
                    type: 'array',
                    items: {
                      type: cultivationStep
                    },
                    description: 'Les étapes sélectionnées'
                  },
                    climate: {
                      type: 'string',
                      description: 'Le Climat'
                    }
                }
              }
            }
          }
    ]
  }