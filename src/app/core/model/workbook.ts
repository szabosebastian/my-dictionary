interface Workbook {
  id: string;
  collections: Collection[];
  //todo owner
}

interface Collection {
  language: Language; //todo vmi enum
  dictionaries: Dictionary[];
}

//todo vmi enum (el kéne tárolni enumként a rövid nevét, stringként meg a hosszút) HU - Hungarian
interface Language {
  value: string;
}

interface Dictionary {
  id: string;
  name: string;
  textLimit: number;
  texts: Text[];
}

interface Text {
  searchedText: string;
  translatedText: string;
}
