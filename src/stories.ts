// Bootstrap for stories

import { fr } from 'date-fns/locale';
import { ItemComponent, ResponseItem, LocalizedObject, LocalizedString, isItemGroupComponent } from "survey-engine/data_types";

export const dateLocales = [
    { code: 'fr', locale: fr, format: 'dd.MM.yyyy' },
];
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/brands';
import '@fortawesome/fontawesome-free/js/fontawesome';
import 'case-web-ui/build/scss/theme-default.scss';

import 'bootstrap/dist/js/bootstrap.bundle';


const resolveContent = (contents: LocalizedObject[] | undefined): LocalizedObject[] | undefined => {
    if (!contents) { return; }

    return contents.map(cont => {
      if ((cont as LocalizedString).parts && (cont as LocalizedString).parts.length > 0) {
        const resolvedContents = (cont as LocalizedString).parts.map(
          p => {
            if (typeof (p) === 'string' || typeof (p) === "number") {
              // should not happen - only after resolved content is generated
              return p
            }
            return p.dtype === 'exp' ? '<Expression>' : p.str
          }
        );
        return {
          code: cont.code,
          parts: resolvedContents,
          resolvedText: resolvedContents.join(''),
        }
      }
      return {
        ...cont
      }
    })
};

export const resolveTexts = (item:ItemComponent) => {
    if(isItemGroupComponent(item)) {
        item.items.forEach(o => {
            resolveTexts(o);
        })
    }
    if(item.content) {
        item.content = resolveContent(item.content);
    }
    if(item.description) {
        item.description = resolveContent(item.description);
    }
};