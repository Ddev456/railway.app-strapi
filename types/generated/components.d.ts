import type { Struct, Schema } from '@strapi/strapi';

export interface GardenClimate extends Struct.ComponentSchema {
  collectionName: 'components_garden_climates';
  info: {
    displayName: 'climate';
    icon: 'sun';
    description: '';
  };
  attributes: {
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    characteristics: Schema.Attribute.JSON & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      [
        'Oc\u00E9anique',
        'Temp\u00E9r\u00E9 ',
        'Continental',
        'Montagnard',
        'M\u00E9diterran\u00E9en',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Temp\u00E9r\u00E9 '>;
  };
}

export interface EventRecurrenceRule extends Struct.ComponentSchema {
  collectionName: 'components_event_recurrence_rules';
  info: {
    displayName: 'RecurrenceRule';
    icon: 'manyWays';
  };
  attributes: {
    frequency: Schema.Attribute.Enumeration<['daily', 'weekly', 'monthly']> &
      Schema.Attribute.Required;
    interval: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
    weekDays: Schema.Attribute.JSON;
    monthDays: Schema.Attribute.JSON;
    endDate: Schema.Attribute.DateTime;
  };
}

export interface EventRecurrenceAdjustment extends Struct.ComponentSchema {
  collectionName: 'components_event_recurrence_adjustments';
  info: {
    displayName: 'RecurrenceAdjustment';
    icon: 'clock';
  };
  attributes: {
    originalDate: Schema.Attribute.DateTime & Schema.Attribute.Required;
    adjustedDate: Schema.Attribute.DateTime;
    reason: Schema.Attribute.String;
    isSkipped: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'garden.climate': GardenClimate;
      'event.recurrence-rule': EventRecurrenceRule;
      'event.recurrence-adjustment': EventRecurrenceAdjustment;
    }
  }
}
