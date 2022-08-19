import { ItemComponent, LocalizedString, LocalizedObject, ResponseItem } from "survey-engine/data_types";

export interface CommonResponseComponentProps {
  parentKey: string;
  compDef: ItemComponent;
  prefill?: ResponseItem;
  responseChanged: (response: ResponseItem | undefined) => void;
  languageCode: string;
  showOptionKey?: boolean;
  disabled?: boolean;
  dateLocales: Array<{ code: string, locale: any, format: string }>;
}

export const getItemComponentTranslationByRole = (components: Array<ItemComponent>, role: string, code: string): string | null => {
  const comp = components.find(comp => comp.role === role);
  if (!comp || comp.displayCondition === false) {
    return null;
  }
  const translation = getLocaleStringTextByCode(comp.content, code);
  if (!translation) {
    console.warn('no translation found for given language code: ' + code);
    return null;
  }
  return translation;
}

export const getLocaleStringTextByCode = (translations: LocalizedObject[] | undefined, code: string): string | undefined => {
  if (!translations) { return; }
  const translation = (translations.find(cont => cont.code === code) as LocalizedString);
  if (!translation) {
    if (translations.length > 0) {
      return (translations[0] as LocalizedString).resolvedText;
    }
    return;
  }
  return translation.resolvedText;
}

export const getItemComponentByRole = (components: Array<ItemComponent> | undefined, role: string): ItemComponent | undefined => {
  if (!components) { return; }
  return components.find(comp => comp.role === role);

}

export const getItemComponentsByRole = (components: Array<ItemComponent>, role: string): ItemComponent[] => {
  return components.filter(comp => comp.role === role);
}

export const getStyleValueByKey = (styles: Array<{ key: string, value: string }> | undefined, key: string): string | undefined => {
  if (!styles) {
    return;
  }
  const object = styles.find(st => st.key === key);
  if (!object) {
    return;
  }
  return object.value;
}

export const getClassName = (styles?: Array<{ key: string, value: string }>): string | undefined => {
  return getStyleValueByKey(styles, 'className');
}

export const getLabelPlacementStyle = (styles?: Array<{ key: string, value: string }>): string | undefined => {
  return getStyleValueByKey(styles, 'labelPlacement');
}

export const getInputMaxWidth = (styles?: Array<{ key: string, value: string }>): string | undefined => {
  return getStyleValueByKey(styles, 'inputMaxWidth');
}

