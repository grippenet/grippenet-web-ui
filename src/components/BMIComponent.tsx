import React, { useEffect, useState, useRef } from 'react';
import { Alert, Badge, Button } from 'react-bootstrap';
import { ItemGroupComponent, ResponseItem, isItemGroupComponent, LocalizedObject } from 'survey-engine/data_types';
import { CommonResponseComponentProps, getStyleValueByKey, textsFromComponents } from './utils';

interface BMIResponseComponentProps extends CommonResponseComponentProps {
    showPrevious?: boolean;
}

const TextKeys = [
    'weightLabel', 'heightLabel', 'weightUnit', 'heightUnit', 'bmiLabel',
     'extremeValues', 'alreadyProvided', 'modifyButton',
     'previousValue', 'notDefined', 'keepLastValue', 'weightError', 'heightError', 'cancelButton'
    ] as const;

// 👇️Create union type from the readonly array of keys
type TextKeyType  = typeof TextKeys[number];

type TextUI = Record<TextKeyType, string>;

export const BMIResponseComponent : React.FC<BMIResponseComponentProps> = (props) => {

    const [prefillValue, setPrefillValue] = useState<number|undefined>(() => {
        const v = props.prefill && props.prefill.value ? parseInt(props.prefill.value) : undefined;
        if(!v || isNaN(v)) {
            return undefined;
        }
        return v;
    });
    const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
    const [touched, setTouched] = useState(false);
    const [weight, setWeight] = useState<number|undefined>(undefined);
    const [height, setHeight] = useState<number|undefined>(undefined);
    const [showDetails, setShowDetails] = useState<boolean>(typeof(prefillValue) == "undefined");
    const [heightError, setHeightError] = useState<boolean>(false);
    const [weightError, setWeightError] = useState<boolean>(false);
    
    
    const texts : TextUI = {
        weightLabel: 'Weight',
        weightUnit: 'Kg',
        heightLabel: 'Height',
        heightUnit: 'cm',
        bmiLabel: 'Your Body Mass Index is',
        extremeValues: 'Those values are extreme and very rare, please check your body values and the unit (kilogramme and centimeters)',
        alreadyProvided: 'A value has already been provided, click here if you want to change it',
        modifyButton: "Modify my response",
        previousValue:"Your previous value was",
        notDefined: "BMI not defined",
        keepLastValue:"I prefer to keep previous value",
        weightError: "Your weight is out of possible bounds. Please indicate a value between 1 and 600",
        heightError: "Your height is out of possible bounds. Please indicate a value between 25 and 250",
        cancelButton: "Cancel response",
    }
    
    if(isItemGroupComponent(props.compDef)) {
        textsFromComponents<TextKeyType>(props.compDef, TextKeys,  texts, props.languageCode);
    }

    const restoreOldValue = () => {
        if(typeof(prefillValue) == "number") {
            setBMI(prefillValue);
            setShowDetails(false);
        }
    }
   
    const updateValue = (value: string, setter: (v?:number)=>void, error:(v:boolean)=>void, min: number, max:number) => {
        var v: number|undefined = parseInt(value);
        var e: boolean = false;
        if(isNaN(v)) {
            v = undefined;
        } else {
            if(v < min || v > max) {
                v = undefined;
                e = true;
            }
        }
        setter(v);
        error(e);
        setTouched(true);
    }


    const updateWeight = (value: string)=>{
        updateValue(value, setWeight, setWeightError, 1, 600);
    }

    const updateHeight = (value: string)=>{
        updateValue(value, setHeight, setHeightError, 25, 250);
    };

    const hasValue = (v?: number): v is number =>  {
        return typeof(v) === "number" && !isNaN(v);
    }

    const setBMI = (bmi: number) => {
        if(!props.compDef.key) {
            console.log('Key of bmi component not found');
            return;
        }
        console.log('setBMI', bmi);
        setResponse({key: props.compDef.key, value: hasValue(bmi) ? '' + bmi : '', dtype:'number'});
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

    const cancelValue  = ()=> {
        setHeight(undefined);
        setWeight(undefined);
        setBMI(NaN);
    }

    useEffect(()=>{
        const bmi =  hasValue(height) && hasValue(weight) ? Math.trunc(weight / Math.pow(height/100, 2)) : NaN;
        setBMI(bmi);
    }, [height, weight]);

    useEffect( () => {
        if(response) {
            props.responseChanged(response);
        }
    }, [response]);

    const bmi = response ? response.value : undefined;

    console.log('bmi', {'bmi': bmi,prefillValue:prefillValue, showDetails: showDetails, response: response });

    return <fieldset className='m-1'>
        {prefillValue ? 
            (<p>
                { texts.alreadyProvided }
                <Button onClick={()=>setShowDetails(true)} variant='primary' size='sm' className='ms-1 rounded'>{texts.modifyButton}</Button>
            </p>) : ''
        }
        <p className='mt-1'>
        { props.showPrevious && prefillValue ?  <span className='ms-1'>{texts.previousValue} <span className='text-primary'>{prefillValue}</span></span> : "" }
        </p>    
        {showDetails ? (
            <div>
                <p>
                <label className='me-1'>{texts.heightLabel} <small className='mx-1'>{texts.heightUnit}</small></label>
                <input type="number" min={20} max={250} className='me-1' onChange={(e) => updateHeight(e.currentTarget.value)}/>
                {heightError ? <Alert variant='warning' className='my-1 p-1'>{texts.heightError}</Alert> : ''}
                </p>
                <p>
                <label className='me-1'>{texts.weightLabel}<small className='mx-1'>{texts.weightUnit}</small></label>
                <input type="number" min={1} max={650} onChange={(e) => updateWeight(e.currentTarget.value)}/>
                {weightError ? <Alert variant='warning' className='my-1 p-1'>{texts.weightError}</Alert> : ''}
                </p>
                <p className='mt-1'>
                { 
                    bmi ? <span>{texts.bmiLabel}<Badge bg="primary" pill={true} className='ms-1'>{bmi}</Badge></span> : <span>{texts.notDefined}</span>
                }
                </p>
                {prefillValue ? (
                    <div>
                        <Button onClick={()=>restoreOldValue()} variant='primary' size='sm' className='ms-1 rounded'>{texts.keepLastValue}</Button> 
                        <Button onClick={()=>cancelValue()} variant='primary' size='sm' className='ms-1 rounded'>{texts.cancelButton}</Button> 
                    </div>
                    )
                : ''}
            </div>
            ) : ''}
        { bmi ? showExtremesValues(bmi) : ''}
    </fieldset>

}