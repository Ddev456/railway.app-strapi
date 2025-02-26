import { factories } from '@strapi/strapi';
import { addDays } from 'date-fns';

// enums
export enum ExperienceEnum {
  DEBUTANT = "Débutant",
  AMATEUR = "Amateur",
  EXPERT = "Expert",
}
export enum SoilTypeEnum {
  Argileux = 'Argileux',
  Limoneux = 'Limoneux',
  Calcaire = 'Calcaire',
  Acide = 'Acide',
}

export enum ClimateEnum {
  OCEANIC = 'Océanique',
  TEMPERATE = 'Tempéré',
  CONTINENTAL = 'Continental',
  MONTAGNARD = 'Montagnard',
  MEDITERRANEAN = 'Méditerranéen'
}

export enum AreaTypeEnum {
  Parcelle = 'Parcelle',
  Serre_de_jardin = 'Serre de jardin',
  Bac = 'Bac',
  Terrasse_ou_balcon = 'Terrasse ou balcon',
}

export enum SunExposureEnum {
  Ensoleillé = 'Ensoleillé',
  Mi_ombre = 'Mi-ombre',
  Ombragé = 'Ombragé',
}

export enum ImportanceEnum {
  Importante = 'Importante',
  Recommandée = 'Recommandée',
  Facultative = 'Facultative',
}

export enum TypeEnum {
  DEBUT_DE_CULTURE = 'Début de culture',
  ARROSAGE = 'Arrosage',
  ENTRETENANCE = 'Entretien',
  CULTURE = 'Culture',
  ALERTE = 'Alerte',
  DIVERS = 'Divers'
}

export enum EventTypeEnum {
  PERSONNALISE = 'Personnalisé',
  DYNAMIQUE = 'Dynamique'
}

export enum ImportanceEnum {
  Elevée = "Priorité élevée",
  Moyenne = "Priorité moyenne",
  Faible = "Priorité faible"
}

export enum ImportanceStepEnum {
  Importante = 'Importante',
  Recommandée = 'Recommandée',
  Facultative = 'Facultative',
}

// Objetcs Json fields
export interface Companion {
  id: string;
  name: string;
  icon: string;
}

export interface Disease {
  id: string;
  name: string;
  symptoms: string;
  treatment: string;
}


// models (tables of database)
export interface GardenerProfile {
  documentId: string;
  id: string;
  pseudo: string;
  isPublic: boolean;    
  experienceLevel: ExperienceEnum;
  notifications: boolean;
  gardenName: string;
  gardenSize: number;
  climate: ClimateEnum;
  areas: Area[];
}

export interface Area {
  documentId: string;
  id: number;
  name: string;
  soilType: SoilTypeEnum;
  areaSize: number;
  areaType: AreaTypeEnum;
  sunExposure: SunExposureEnum;
}

export interface Configuration {
  documentId: string;
  id: number;
  name: string;
  description: string;
  climateOffset: boolean;
  offset: number;
  reminders: boolean;
  weather: boolean;
  gardeningDays: string[];
}


export interface Plant {
  documentId: string;
  id: number;
  name: string;
  category: string;
  description: string;
  icon?: string;
  season: string;
  plantingPeriod: string;
  growthTime: string;
  spacing: string;
  exposure: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  waterNeeds: 'Faible' | 'Moyen' | 'Élevé';
  recommendedClimate: string[];
  cultivationSteps: CultivationStep[];
  companions: Companion[];
  diseases: Disease[];
  cultivation_steps: CultivationStep[]
}

export interface Event {
  documentId: string;
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  type: TypeEnum;
  eventType: EventTypeEnum;
  importance: ImportanceEnum;
  completed: boolean;
  completedAt: Date | null;
  area: Area | null;
  plant: Plant | null;
  configuration: Configuration | null;
}

export interface CultivationStep {
  documentId: string;
  id: number;
  name: string;
  description: string;
  duration: number;
  season: string;
  importance: ImportanceStepEnum;
  isCropStart: boolean;
  stepType: TypeEnum;
  order: number;
  dependsOn?: string[];  // IDs of steps that must be completed before this one
  triggers?: {
      type: 'weather' | 'time' | 'manual';
      condition?: string;
  };
}

export interface EventGenerated {
  title: string
  description: string
  eventDate: Date
  type: TypeEnum
  eventType: EventTypeEnum
  importance: ImportanceEnum
  completed: boolean
  completedAt: Date | null
}

// this file is a Strapi CMS V5 service which aim to generate dynamic events for garden calendar
// it requires a plant, an area, a configuration and a list of selected steps IDs
// the service will then generate events for each selected step, based on the step configuration

// list of function to implement:

// paramètres disponibles pour la génération des évènements: 
// plant, area, configuration, steps, climate

// climate ("méditeranéen ...") ==> calcul offset basé dessus
// area ("parcelle", "serre de jardin", "bac", "terrasse ou balcon") ==> calcul offset basé dessus
// plant ("rose", "thymus", ...) ==> possède des stages(etapes de culture) pour chaque étape de culture sélectionnée
// par l'utilisateur on doit déterminer un évènement + un cropStart (évènement de début de culture)
// - la configuration de l'assistant: détermine les jours ou l'utilisateur préfère jardiner (exemple : lundi, mardi seulement)
// la config contient aussi l'offset si l'utilisateur a choisi de ne pas utiliser celui par défaut (climat)
// et enfin reminders ==> s'il souhaite avoir des rappels pour ces évènements qui seront générés.
// les rappels serait un évènement répétable pour le calendrier type arrosage (par exemple)



// function : createRemindersEvents(events)
// createRemindersEvents creates the reminders events based on the given events



const OFFSETS = [
  {climate: 'méditeranéen', offset: 0},
  {climate: 'océanique', offset: 10},
  {climate: 'tempéré', offset: 16},
  {climate: 'continental', offset: 24},
  {climate: 'montagnard', offset: 34},
]

function getImportanceLevel(importance: ImportanceStepEnum) {
  switch(importance){
    case ImportanceStepEnum.Importante:
      return ImportanceEnum.Elevée
    case ImportanceStepEnum.Recommandée:
      return ImportanceEnum.Moyenne
    case ImportanceStepEnum.Facultative:
      return ImportanceEnum.Faible
  }
}

export default factories.createCoreService('api::event.event', ({ strapi }) => ({    
  async generate({plant, area, configuration, selectedSteps, climate}) {
    try {
      console.log("=== Début de la génération ===");
  
    
    console.log("Étape 1 - Recherche du cropStart")
    // Validations
    if (!selectedSteps || selectedSteps.length === 0) {
      throw new Error("Aucune étape sélectionnée");
    }

    if (!configuration.gardeningDays || configuration.gardeningDays.length === 0) {
      throw new Error("Aucun jour de jardinage configuré");
    }

    const findFirstCropStartStep = this.findFirstCropStartStep(selectedSteps);
    if (!findFirstCropStartStep) {
      throw new Error("Aucune étape de début de culture trouvée");
    }

    console.log("CropStart trouvé :", findFirstCropStartStep)
  
    console.log("Étape 2 - Calcul de l'offset")
    const offset = this.calculateOffset(climate, configuration, area)
    console.log("Offset calculé :", offset)
  
    console.log("Étape 3 - Calcul des dates")
    const dates = this.calculateEachDateOfCropSteps(offset, findFirstCropStartStep, selectedSteps, configuration)
    console.log("Dates calculées :", dates)
  
    console.log("Étape 4 - Génération des événements")
    const events = this.generateEvents(plant, area, configuration, selectedSteps, climate, dates);
    
    // Validation finale
    if (events.some(event => !event.eventDate)) {
      throw new Error("Certains événements n'ont pas de date valide");
    }

    return events;
  } catch (error) {
    console.error("Erreur détaillée:", error);
    throw new Error("Une erreur est survenue lors de la génération des événements: " + error.message);
  }},
  
    // helpers functions
    findFirstCropStartStep(steps: CultivationStep[]){
      return steps.find(step => step.isCropStart)
    },
    
    calculateOffset(climate: string, configuration: Configuration, area: Area) {
      // Si l'utilisateur a défini son propre décalage
      if (!configuration.climateOffset) {
        return configuration.offset;
      }
      
      // Sinon, calculer le décalage basé sur le climat et le type de zone
      let offset = 0;
      
      // Décalage selon le type de zone
      switch (area.areaType) {
        case AreaTypeEnum.Serre_de_jardin:
          offset = 0;
          break;
        case AreaTypeEnum.Parcelle:
          offset = 12;
          break;
        case AreaTypeEnum.Bac:
        case AreaTypeEnum.Terrasse_ou_balcon:
          offset = 24;
          break;
      }
    
      // Ajouter le décalage climatique
      const climateOffset = OFFSETS.find(off => off.climate === climate);
      return offset + (climateOffset?.offset || 0);
    },
      
    findNextGardeningDay(startDate: Date, gardeningDays: string[]): Date {
      const currentDate = new Date(startDate);
      const maxAttempts = 14; // Maximum 2 semaines de recherche
      
      for (let i = 0; i < maxAttempts; i++) {
        const dayOfWeek = currentDate.getDay().toString();
        if (gardeningDays.includes(dayOfWeek)) {
          return new Date(currentDate);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Si aucun jour n'est trouvé, retourner la date initiale
      return startDate;
    },
      
      
      calculateDateOfCropStart(offset: number, step: CultivationStep){
        const date = new Date()
        date.setDate(date.getDate() + step.duration + offset)
        return date
      },
      
      // function : calculateEachDateOfCropSteps(climate, offset, configuration (gardeningdays))
      // calculateEachDateOfCropSteps returns the dates of each crop step based on the climate, offset and configuration
      calculateEachDateOfCropSteps(offset: number, cropStart: CultivationStep, steps: CultivationStep[], configuration: Configuration) {
        const dates: Date[] = [];
        let currentDate = new Date();
        
        // Pour chaque étape
        steps.forEach((step, index) => {
          if (step.isCropStart) {
            // Date de début + offset pour l'étape de démarrage
            currentDate = addDays(currentDate, offset);
          } else {
            // Pour les autres étapes, ajouter la durée de l'étape précédente
            currentDate = addDays(currentDate, steps[index - 1].duration);
          }
      
          // Trouver le prochain jour de jardinage disponible
          const nextGardeningDay = this.findNextGardeningDay(currentDate, configuration.gardeningDays);
          dates.push(nextGardeningDay || currentDate);
        });
      
        return dates;
      },
      
      // function generateEvents(plant, area, configuration, selectedSteps, climate): returns an array of events
      // generateEvents returns the events based on the plant, area, configuration, selectedSteps and climate
      generateEvents(plant: Plant, area: Area, configuration: Configuration, steps: CultivationStep[], climate: string, dates: Date[]): EventGenerated[] {
        return steps.map((step, index) => ({
          title: `${step.name} de ${plant.name}`,
          description: step.description,
          eventDate: dates[index], // Utiliser la date correspondante à l'index
          type: step.stepType || (step.isCropStart ? TypeEnum.DEBUT_DE_CULTURE : TypeEnum.CULTURE), // Valeur par défaut
          eventType: EventTypeEnum.DYNAMIQUE,
          importance: getImportanceLevel(step.importance),
          completed: false,
          completedAt: null
        }));
      }
}))
