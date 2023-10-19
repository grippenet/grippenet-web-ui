import React, { useEffect, useState, useRef } from 'react';
import { Alert, Badge } from 'react-bootstrap';
import { ItemGroupComponent, ResponseItem, isItemGroupComponent, LocalizedObject } from 'survey-engine/data_types';
import { CommonResponseComponentProps, getStyleValueByKey, textsFromComponents } from './utils';

interface BMIResponseComponentProps extends CommonResponseComponentProps {

}

const TextKeys = ['weightLabel', 'heightLabel', 'weightUnit', 'heightUnit', 'bmiLabel', 'valuesnotStored','extremeValues'] as const;

// 👇️Create union type from the readonly array of keys
type TextKeyType  = typeof TextKeys[number];

type TextUI = Record<TextKeyType, string>;

export const BMIResponseComponent : React.FC<BMIResponseComponentProps> = (props) => {

    const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
    const [touched, setTouched] = useState(false);
    const [weight, setWeight] = useState<number|undefined>(undefined);
    const [height, setHeight] = useState<number|undefined>(undefined);
  
    const texts : TextUI = {
        weightLabel: 'Weight',
        weightUnit: 'Kg',
        heightLabel: 'Height',
        heightUnit: 'cm',
        bmiLabel: 'Your Body Mass Index is',
        valuesnotStored: 'Weight and height are not stored',
        extremeValues: 'Those values are extreme and very rares, please check your body values',
    }
    
    if(isItemGroupComponent(props.compDef)) {
        textsFromComponents<TextKeyType>(props.compDef, TextKeys,  texts, props.languageCode);
    }
   
    const updateWeight = (value: string)=>{
        const w = parseInt(value);
        if(!isNaN(w)) {
            setWeight(w);
        }
        setTouched(true);
    }

    const updateHeight = (value: string)=>{
        const h = parseInt(value);
        if(!isNaN(h)) {
            setHeight(h);
        }
        setTouched(true);
    };

    const setBMI = (bmi: number) => {
        if(!props.compDef.key) {
            console.log('Key of bmi component not found');
            return;
        }
        setResponse({key: props.compDef.key, value: '' + bmi, dtype:'number'});
    }

    const showExtremesValues = (bmi:string|undefined)=> {
        if(!bmi) {
            return;
        }
        const v = +bmi;
        if(v < 10 || v > 70) {
            return <Alert variant='warning'>{texts.extremeValues}</Alert>
        }
    }

    useEffect(()=>{
        if(height && weight) {
            const bmi = Math.round(weight / Math.pow(height/100, 2));
            setBMI(bmi);
        }
    }, [height, weight]);

    useEffect( () => {
        props.responseChanged(response);
    }, [response]);

    const bmi = response ? response.value : undefined;

    return <fieldset className='m-1'>
        <div className='d-line'>
        <label className='me-1'>{texts.heightLabel} <small className='mx-1'>{texts.heightUnit}</small></label>
        <input type="number" min={20} max={250} className='me-1' onChange={(e) => updateHeight(e.currentTarget.value)}/>
        <label className='me-1'>{texts.weightLabel}<small className='mx-1'>{texts.weightUnit}</small></label>
        <input type="number" min={1} max={650} onChange={(e) => updateWeight(e.currentTarget.value)}/>
        <p><small className='text-warning'>{texts.valuesnotStored}</small></p>
        </div>
        { bmi ? <p><span>{texts.bmiLabel}</span><Badge bg="primary" pill={true} className='ms-1'>{bmi}</Badge></p> : ''}
        { bmi ? showExtremesValues(bmi) : ''}
    </fieldset>

}