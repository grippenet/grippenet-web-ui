import { ItemGroupComponent, LocalizedObject } from 'survey-engine/data_types';
import {  getItemComponentByRole, getLocaleStringTextByCode } from './case';

/**  
* Read text from sub components in a ItemGroupComponent. Each text is in content field, this pattern is used to handle i18n
* K = UnionType of list of known text keys
*/
export const textsFromComponents = <K extends string>(group: ItemGroupComponent, roles: Readonly<Array<K>>, texts:Record<K,string>, languageCode:string)=> {
    const comps = group.items;
    
    const setTextFrom = (content: LocalizedObject[]|undefined, def: string) => {
        const b = content ? getLocaleStringTextByCode(content, languageCode) : def;
        return b ? b : def;
    } 
    roles.forEach(name => {
        const comp = getItemComponentByRole(comps, name);
        if(comp) {
            const t = setTextFrom(comp.content, texts[name]);
            texts[name] = t;
        }
    });
};