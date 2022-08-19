import React from "react";

import { dateLocales, resolveTexts } from '../../stories';
import { LookupResponseComponent } from '../LookupResponseComponent';
import { ItemComponent, ResponseItem, LocalizedObject } from "survey-engine/data_types";

const responseChanged = (response:ResponseItem|undefined)=>{
 console.log(response);
}

import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
    title: 'Lookup Component',
    component: LookupResponseComponent,
} as ComponentMeta<typeof LookupResponseComponent>;
  
const Template = (args) => <LookupResponseComponent {...args} />;

const bmidef = {
  "key": "lookup",
  "role": ":postalCodeLookup",
  "items": [
    {
      "key": "postalcodes",
      "role": "lookupName"
    },
    {
      "role": "buttonLabel",
      "content": [
        {
          "code": "fr",
          "parts": [
            {
              "str": "Recherchez"
            }
          ]
        }
      ]
    },
    {
      "role": "updateButton",
      "content": [
        {
          "code": "fr",
          "parts": [
            {
              "str": "Modifier votre réponse"
            }
          ]
        }
      ]
    },
    {
      "role": "selectLabel",
      "content": [
        {
          "code": "fr",
          "parts": [
            {
              "str": "Sélectionnez votre commune dans la liste ci-dessous"
            }
          ]
        }
      ]
    },
    {
      "role": "loadingError",
      "content": [
        {
          "code": "fr",
          "parts": [
            {
              "str": "Une erreur est survenue durant le chargement des données"
            }
          ]
        }
      ]
    },
    {
      "role": "responseLabel",
      "content": [
        {
          "code": "fr",
          "parts": [
            {
              "str": "Votre réponse actuelle"
            }
          ]
        }
      ]
    },
    {
      "role": "minLengthError",
      "content": [
        {
          "code": "fr",
          "parts": [
            {
              "str": "Entrez les 5 caractères de votre code postal"
            }
          ]
        }
      ]
    }
  ],
  "style": [
    {
      "key": "maxLength",
      "value": "5"
    },
    {
      "key": "minLength",
      "value": "5"
    }
  ],
  "content": [
    {
      "code": "fr",
      "parts": [
        {
          "str": "Indiquez votre code postal"
        }
      ]
    }
  ]
};

resolveTexts(bmidef);

export const BlankComponent = Template.bind({});

BlankComponent.args = {
    dateLocales: dateLocales,
    parentKey:"Q1",
    compDef:bmidef,
    languageCode: 'fr',
    responseChanged:responseChanged
};
