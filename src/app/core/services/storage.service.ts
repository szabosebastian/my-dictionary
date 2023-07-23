import { Injectable } from '@angular/core';
import { Collection, Language, WORKBOOK, Workbook } from "../model/workbook";
import { Storage } from "@ionic/storage-angular";


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

    console.log("Storage init start ");
    console.log(workbook);
    console.log("-");

    if (!workbook) {
      //todo id
      workbook = { id: '', collections: [] } as Workbook;
      this.createCollections(workbook);
      workbook.collections.find(d => d.language = Language.EN)?.dictionaries.push(
        {
          name: "teszt",
          id: '1',
          textLimit: 10,
          texts: []
        }
      );
      await this.storage.set(WORKBOOK, workbook);
      console.log("Workbook uploaded by collections");
    }
    console.log("Storage init end");
    console.log(workbook);
    console.log("-");
  }

  createCollections(workbook: Workbook): void {
    const languageKeys = Object.keys(Language);
    languageKeys.forEach((key, index) => {
      workbook.collections.push({ language: key, dictionaries: [] } as Collection);
    });
  }

  setValue(key: string, value: any): void {
    this.storage.set(key, value);
  }

  getValue(key: string): Promise<any> {
    return this.storage.get(key);
  }
}
