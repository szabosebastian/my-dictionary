import { Injectable } from '@angular/core';
import { DefaultLanguage, defaultLanguagesDisplayNames, Language, WORKBOOK, Workbook } from "../model/workbook";
import { Storage } from "@ionic/storage-angular";
import { v4 as uuid } from "uuid";
import { Store } from "@ngrx/store";
import { setWorkbook } from "../../state/workbook/workbook.actions";


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: Storage,
    private store: Store
  ) { }

  async initStorage(): Promise<any> {
    await this.storage.create();
    await this.storage.clear(); //todo

    let workbook: Workbook = await this.storage.get(WORKBOOK);

    console.log("Storage init start", workbook);

    if (!workbook) {

      workbook = {
        id: uuid(),
        defaultLanguage: {} as Language,
        languages: [],
        dictionaries: [],
        collections: []
      } as Workbook;

      this.createDefaultLanguages(workbook);
      //todo kivenni
      workbook.dictionaries.push(
        {
          name: "teszt",
          id: '1',
          default: true,
          description: "This is a desctiption to bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla ",
          language: {
            id: uuid(),
            shortName: DefaultLanguage.BG,
            displayName: defaultLanguagesDisplayNames[DefaultLanguage.BG]
          },
          textLimit: 10,
          texts: [
            {
              id: uuid(),
              originalText: "alma",
              translatedText: "1appleappleappleappleappleappleappleappleappleappleappleappleappleappleappleapple1"
            },
            {
              id: uuid(),
              originalText: "reggel",
              translatedText: "morning"
            },
            {
              id: uuid(),
              originalText: "kéz",
              translatedText: "hand"
            },
            {
              id: uuid(),
              originalText: "labda",
              translatedText: "ball"
            }
          ]
        },
        {
          name: "asd",
          id: '2',
          description: "This is a desctiption to bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla ",
          default: false,
          language: {
            id: uuid(),
            shortName: DefaultLanguage.BG,
            displayName: defaultLanguagesDisplayNames[DefaultLanguage.BG]
          },
          textLimit: 10,
          texts: []
        },
        {
          name: "kekke5464545654456645645645646546456456r",
          id: '3',
          description: "This is a desctiption to bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla ",
          default: false,
          language: {
            id: uuid(),
            shortName: DefaultLanguage.BG,
            displayName: defaultLanguagesDisplayNames[DefaultLanguage.BG]
          },
          textLimit: 10,
          texts: []
        }
      );
      this.setDefaultLanguage(workbook);
      this.store.dispatch(setWorkbook({ workbook: workbook }));
      console.log("Workbook uploaded by mock dictionaries");
    }
    console.log("Storage init end", workbook);
  }

  createDefaultLanguages(workbook: Workbook): void {
    const languageKeys = Object.keys(DefaultLanguage);
    languageKeys.forEach((key, index) => {
      workbook.languages.push({
        id: uuid(),
        shortName: key,
        displayName: defaultLanguagesDisplayNames[DefaultLanguage[key as keyof typeof DefaultLanguage]]
      } as Language);
    });
  }

  setDefaultLanguage(workbook: Workbook): void {
    workbook.defaultLanguage = workbook.languages[0];
  }

  set(key: string, value: any): void {
    this.storage.set(key, value);
  }

  get(key: string): Promise<any> {
    return this.storage.get(key);
  }
}
