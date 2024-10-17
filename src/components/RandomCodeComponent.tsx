import React, { useEffect, useState, useRef } from 'react';
import {  ResponseItem, isItemGroupComponent } from 'survey-engine/data_types';
import { CommonResponseComponentProps, getItemComponentByRole, getItemComponentsByRole, getLocaleStringTextByCode, getStyleValueByKey, textsFromComponents } from './utils';

export interface RandomCodeComponentProps extends CommonResponseComponentProps {
}

const TextKeys = [
   'label',
] as const;

// 👇️Create union type from the readonly array of keys
type TextKeyType  = typeof TextKeys[number];

type TextUI = Record<TextKeyType, string>;

export const RandomCodeComponent : React.FC<RandomCodeComponentProps> = (props) => {

    const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
    const [code, setCode] = useState<string|undefined>();
    
    const texts : TextUI = {
        label: '',
    };

    const responseKey = props.compDef.key ?? 'code';
    
    let alphabet = "0123456789";
    let size = 5;
    const links: JSX.Element[] = [];

    if(isItemGroupComponent(props.compDef)) {
        textsFromComponents<TextKeyType>(props.compDef, TextKeys,  texts, props.languageCode);

        const configComp = getItemComponentByRole(props.compDef.items, 'config')
        if(configComp) {
            if(configComp.style) {
                const styleAlpha = getStyleValueByKey(configComp.style, 'alphabet');
                if(styleAlpha) {
                    alphabet = styleAlpha;
                } 
                const styleSize = parseInt(getStyleValueByKey(configComp.style, "size") ?? '');
                if(styleSize > 0) {
                    size = styleSize;
                } 
                
            } else {
                console.warn("Component in " + props.parentKey + " component with role 'config' doesnt contains style properties");
            }
        }
        
        const linkComps = getItemComponentsByRole(props.compDef.items, 'link');

        
        linkComps.forEach((comp, index) => {
            console.log(comp);
            if(comp.style) {
                let link = getStyleValueByKey(comp.style, 'link');
                if(link) {
                    link = link.replace('%code%', code ?? '');
                } else {
                    console.warn("Component in " + props.parentKey + " component with role 'link' doesnt contains style 'link' properties");
                }

                const className = getStyleValueByKey(comp.style, 'class');

                const label = getLocaleStringTextByCode(comp.content, props.languageCode) ?? 'Link';

                const node = <a href={link} key={index} className={className}>{label}</a>
                links.push(node);
            } else {
                console.warn("Component in " + props.parentKey + " component with role 'link' doesnt contains style properties");
            }
        })
    }

    const createCode = () => {
        let o = '';
        const n = alphabet.length;
        for(let i = 0; i < size; ++i) {
            const c = Math.floor(Math.random() *  n);
            o += alphabet.charAt(c);
        }
        return o;
    };

    useEffect( () => {
        if(response) {
            props.responseChanged(response);
        }
    }, [response]);

    useEffect(()=> {
        if(!code) {
            const newCode = createCode();
            setCode(newCode);
            setResponse({key: responseKey, value: newCode });
        } 
    }, [code]);

    return <fieldset className='m-1'>
        {texts.label ? <p>{texts.label}</p> : ''}
        <p className='mt-1 text-center'>
            <span className='fs-2' style={{letterSpacing:".8em"}}>{ code }</span>
        </p>
        { links }
    </fieldset>
}