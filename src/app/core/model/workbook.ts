export const WORKBOOK = "workbook";

export interface Workbook {
  id: string;
  defaultLanguage: Language,
  languages: Language[],
  collections: Collection[];
  dictionaries: Dictionary[];
}

export interface Collection {
  language: Language;
  dictionaries: Dictionary[];
}

export interface Dictionary {
  id: string;
  name: string;
  default: boolean;
  language: Language;
  textLimit: number;
  texts: Text[];
}

export interface Text {
  originalText: string;
  translatedText: string;
}

export interface Language {
  id: string;
  shortName: string;
  displayName: string;
}

export enum DefaultLanguage {
  BG = "BG",
  CS = "CS",
  DA = "DA",
  DE = "DE",
  EL = "EL",
  EN = "EN",
  ES = "ES",
  ET = "ET",
  FI = "FI",
  FR = "FR",
  HU = "HU",
  ID = "ID",
  IT = "IT",
  JA = "JA",
  KO = "KO",
  LT = "LT",
  LV = "LV",
  NB = "NB",
  NL = "NL",
  PL = "PL",
  PT = "PT",
  RO = "RO",
  RU = "RU",
  SK = "SK",
  SL = "SL",
  SV = "SV",
  TR = "TR",
  UK = "UK",
  ZH = "ZH",
}

export const defaultLanguagesDisplayNames: Record<DefaultLanguage, string> = {
  BG: "Bulgarian",
  CS: "Czech",
  DA: "Danish",
  DE: "German",
  EL: "Greek",
  EN: "English",
  ES: "Spanish",
  ET: "Estonian",
  FI: "Finnish",
  FR: "French",
  HU: "Hungarian",
  ID: "Indonesian",
  IT: "Italian",
  JA: "Japanese",
  KO: "Korean",
  LT: "Lithuanian",
  LV: "Latvian",
  NB: "Norwegian ",
  NL: "Dutch",
  PL: "Polish",
  PT: "Portuguese ",
  RO: "Romanian",
  RU: "Russian",
  SK: "Slovak",
  SL: "Slovenian",
  SV: "Swedish",
  TR: "Turkish",
  UK: "Ukrainian",
  ZH: "Chinese",
};

