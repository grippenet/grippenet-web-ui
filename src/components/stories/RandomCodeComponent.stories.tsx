import React from "react";

import { dateLocales, resolveTexts } from '../../stories';
import { RandomCodeComponent } from "../RandomCodeComponent";

import { ItemComponent, ResponseItem, LocalizedObject } from "survey-engine/data_types";

const responseChanged = (response:ResponseItem|undefined)=>{
 console.log('response changed', response);
}

import { ComponentStory, ComponentMeta, StoryObj, Meta } from '@storybook/react';

export default {
    title: 'randomCode Component',
    component: RandomCodeComponent,
} as Meta<typeof RandomCodeComponent>;

type Story = StoryObj<typeof RandomCodeComponent>;

const spec = {
    "key": "lookup",
    "role": ":bmi",
    "items": [
      {
        "role": "label",
        "content": [ { "code": "fr", "parts": [ { "str": "Code à utiliser : "} ] } ]
      },
      {
        "role": "link",
        "content": [ { "code": "fr", "parts": [ { "str": "Envoyer un email"} ] } ],
        "style": [
          {"key": "link", "value": "mailto:puli@grippenet.fr?subject=%code%"},
          {"key": "class", "value":"btn btn-info btn-sm"}
        ]
      },
      {
        "role": "config",
        "style": [
          {"key": "size", "value": 6},
        ]
      }
    ],
    "style": [
    ],
    "content": [
      {
        "code": "fr",
        "parts": [
          {
            "str": "Indiquez votre poids et taille"
          }
        ]
      }
    ]
};

resolveTexts(spec);

export const BaseComponent : Story = {
  args : {
      dateLocales: dateLocales,
      parentKey:"Q1",
      compDef:spec,
      languageCode: 'fr',
      responseChanged:responseChanged
  }
}
