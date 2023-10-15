export const WORKBOOK = "workbook";

export interface Workbook {
  id: string;
  defaultLanguage: Language,
  languages: Language[],
  collections: Collection[];
  dictionaries: Dictionary[];
}

export interface Collection {
  id: string;
  name: string;
  dictionaryIds: string[];
  gameSettings: GuessingGameSettings[];
  result: CollectionResult;
}

export interface Dictionary {
  id: string;
  name: string;
  default: boolean;
  language: Language;
  description: string;
  textLimit: number;
  texts: Text[];
}

export interface Text {
  id: string;
  originalText: string;
  translatedText: string;
}

export interface Language {
  id: string;
  shortName: string;
  displayName: string;
}

export interface GameSettings {
  id: string;
  type: GameType;
}

export interface GuessingGameSettings extends GameSettings {
  isTargetTextOriginal: boolean;
  isTargetTextTranslated: boolean;
  numberOfAnswerOption: number;
  failedAttemptNumber: number;
}

export interface CollectionResult {
  id: string;
  status: GameResultStatus;
  requiredSuccessfulNumber: number;
  failCounter: number;
  successfulCounter: number;
}

export enum GameResultStatus {
  SUCCESSFUL = 'SUCCESSFUL',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

export interface GuessingGame {
  id: string;
  texts: GuessingGameText[];
  failedAttemptCounter: number;
  result: GameResultStatus;
}

export interface GuessingGameAnswerOption {
  id: string,
  answer: string,
}

export interface GuessingGameText {
  id: string,
  text: Text,
  isSuccessful: boolean,
  failedAttemptCounter: number,
  isOriginalText: boolean
}

export enum GameType {
  GUESSING_GAME = "GUESSING_GAME"
}

export const gameTypeDisplayNames: Record<GameType, string> = {
  GUESSING_GAME: "Guessing game",
};

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

