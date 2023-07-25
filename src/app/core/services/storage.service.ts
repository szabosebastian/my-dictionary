import { Injectable } from '@angular/core';
import { DefaultLanguage, defaultLanguagesDisplayNames, Language, WORKBOOK, Workbook } from "../model/workbook";
import { Storage } from "@ionic/storage-angular";
import { v4 as uuid } from "uuid";


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: Storage
  ) { }

  async initStorage(): Promise<any> {
    await this.storage.create();
    await this.storage.clear(); //todo

    let workbook: Workbook = await this.storage.get(WORKBOOK);

    console.log("Storage init start", workbook);

    if (!workbook) {
      //todo id
      workbook = { id: '', languages: [], dictionaries: [], collections: [] } as Workbook;
      this.createDefaultLanguages(workbook);
      workbook.dictionaries.push(
        {
          name: "teszt",
          id: '1',
          language: {
            id: uuid(),
            shortName: DefaultLanguage.EN,
            displayName: defaultLanguagesDisplayNames[DefaultLanguage.EN]
          },
          textLimit: 10,
          texts: []
        }
      );
      await this.storage.set(WORKBOOK, workbook);
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

  set(key: string, value: any): void {
    this.storage.set(key, value);
  }

  get(key: string): Promise<any> {
    return this.storage.get(key);
  }
}
