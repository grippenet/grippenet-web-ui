import React from "react";

import { dateLocales, resolveTexts } from '../../stories';
import { BMIResponseComponent } from "../BMIComponent";

import { ItemComponent, ResponseItem, LocalizedObject } from "survey-engine/data_types";

const responseChanged = (response:ResponseItem|undefined)=>{
 console.log(response);
}

import { ComponentStory, ComponentMeta, StoryObj, Meta } from '@storybook/react';

export default {
    title: 'BMi Component',
    component: BMIResponseComponent,
} as Meta<typeof BMIResponseComponent>;

type Story = StoryObj<typeof BMIResponseComponent>;

const bmidef = {
    "key": "lookup",
    "role": ":bmi",
    "items": [
      {
        "role": "weightLabel",
        "content": [ { "code": "fr", "parts": [ { "str": "Poids"} ] } ]
      },
      {
        "role": "weightUnit",
        "content": [ { "code": "fr", "parts": [ { "str": "(en kilogrammes)"} ] } ]
      },
      {
        "role": "heightLabel",
        "content": [ { "code": "fr", "parts": [ { "str": " Taille"} ] } ]
      },
      {
        "role": "heightUnit",
        "content": [ { "code": "fr", "parts": [ { "str": "(en centimètres)"} ] } ]
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

resolveTexts(bmidef);

export const BaseComponent : Story = {
  args : {
      dateLocales: dateLocales,
      parentKey:"Q1",
      compDef:bmidef,
      languageCode: 'fr',
      responseChanged:responseChanged
  }
}

export const WithPrefillComponent : Story = {
  args :  {
    dateLocales: dateLocales,
    parentKey:"Q1",
    compDef:bmidef,
    languageCode: 'fr',
    responseChanged:responseChanged,
    prefill: {'value': 23},
    showPrevious: true
  }
}
