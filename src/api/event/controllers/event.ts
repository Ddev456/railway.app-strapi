/**
 * event controller
 */

import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

// Types constants
const ERROR_MESSAGES = {
  MISSING_PARAMS: 'Les IDs de la plante, de la zone et de la configuration du jardin sont requis',
  NOT_FOUND: 'Plante, zone ou configuration du jardin non trouvée',
  GENERATION_ERROR: 'Une erreur est survenue lors de la génération des événements'
} as const;

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
  importance: ImportanceEnum;
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
  id: string
  title: string
  description: string
  eventDate: Date
  type: TypeEnum
  eventType: EventTypeEnum
  importance: ImportanceEnum
  completed: boolean
  completedAt: Date | null
  area: Area | null
  plant: Plant | null
  configuration: Configuration | null
}


interface GenerateEventsRequestBody {
  plant: Plant;
  area: Area;
  configuration: Configuration;
  selectedSteps: CultivationStep[];
  climate: ClimateEnum;
}

export default factories.createCoreController('api::event.event', ({ strapi }) => ({
  
  /*
  async generateForPlant(ctx: Context): Promise<void> {
    const { data } = ctx.request.body;

    // Ensuite destructurer le contenu de data
    const {
      plant,
      area,
      configuration,
      selectedSteps,
      climate
    } = data;

    const eventsData = await strapi.service('api::event.event-generate').generate({plant, area, configuration, selectedSteps, climate} as GenerateEventsRequestBody);

    if (!eventsData.ok) {
      throw new Error(ERROR_MESSAGES.GENERATION_ERROR);
    }else{
    try {
    const events = await Promise.all(
      eventsData.map(event => 
        strapi.documents("api::event.event").create({
          data: {
            ...event,
            plant: plant.documentId,
            area: area.documentId,
            configuration: configuration.documentId,
            user: ctx.state.user?.documentId
          },
          populate: ["plant", "area", "configuration", "user"],
          status: 'published',
        })
      )
    );
      // Retourner un message de succès
  ctx.body = {
    success: true,
    message: 'Événements créés avec succès',
    data: events, // Inclure les événements créés dans la réponse
  };
    } catch (error) {
      ctx.body = {
        success: false,
        message: ERROR_MESSAGES.GENERATION_ERROR,
      };
    }
  }
}
})); */



// Dans api/event/controllers/event.js
async generateForPlant(ctx) {
  try {
    const { data } = ctx.request.body;
    const { plant, area, configuration, selectedSteps, climate } = data;

    // Validation des données d'entrée
    if (!plant || !area || !configuration || !selectedSteps || !climate) {
      return ctx.badRequest('Données manquantes pour la génération des événements');
    }

    // Appel du service avec logging
    console.log("Appel du service de génération avec les données :", {
      plant: plant.name,
      area: area.name,
      configurationName: configuration.name,
      stepsCount: selectedSteps.length
    });

    const events = await strapi.service('api::event.event-generate').generate({
      plant,
      area,
      configuration,
      selectedSteps,
      climate
    });

    // Validation des événements générés
    if (!Array.isArray(events)) {
      throw new Error("Le service n'a pas retourné un tableau d'événements");
    }

// Préparation des données d'événements
const eventsData = await Promise.all(
  events.map(event => 
    strapi.documents("api::event.event").create({
      data: {
        ...event,
        plant: plant.documentId,
        area: area.documentId,
        configuration: configuration.documentId,
        user: ctx.state.user?.documentId
      },
      populate: ["plant", "area", "configuration", "user"],
      status: 'published',
    })
  )
);

    return ctx.send({
      events: eventsData
    });

  } catch (error) {
    console.error("Erreur détaillée:", error);
    return ctx.badRequest(`Erreur lors de la génération des événements: ${error.message}`);
  }
}
}));