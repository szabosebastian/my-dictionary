export interface Workbook {
  id: string;
  collections: Collection[];
  //todo owner
}

export interface Collection {
  language: Language; //todo vmi enum
  dictionaries: Dictionary[];
}

//todo vmi enum (el kéne tárolni enumként a rövid nevét, stringként meg a hosszút) HU - Hungarian
export interface Language {
  value: string;
}

export interface Dictionary {
  id: string;
  name: string;
  textLimit: number;
  texts: Text[];
}

export interface Text {
  searchedText: string;
  translatedText: string;
}
