import React from "react";

import { dateLocales, resolveTexts } from '../../stories';
import { BMIResponseComponent } from "../BMIComponent";

import { ItemComponent, ResponseItem, LocalizedObject } from "survey-engine/data_types";

const responseChanged = (response:ResponseItem|undefined)=>{
 console.log(response);
}

import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
    title: 'BMi Component',
    component: BMIResponseComponent,
} as ComponentMeta<typeof BMIResponseComponent>;
  
const Template = (args) => <BMIResponseComponent {...args} />;

const bmidef = {
    "key": "lookup",
    "role": ":bmi",
    "items": [
      {
        "role": "weightLabel",
        "content": [ { "code": "fr", "parts": [ { "str": "Poids (en kilogramme)"} ] } ]
      },
      {
        "role": "heightLabel",
        "content": [ { "code": "fr", "parts": [ { "str": "Taille (en cm)"} ] } ]
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

export const BlankComponent = Template.bind({});

BlankComponent.args = {
    dateLocales: dateLocales,
    parentKey:"Q1",
    compDef:bmidef,
    languageCode: 'fr',
    responseChanged:responseChanged
};
