import { Injectable } from '@angular/core';
import { map, take, tap } from "rxjs";
import { Dictionary, Text, Workbook } from "../model/workbook";
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { Store } from "@ngrx/store";
import { setWorkbook } from "../../state/workbook/workbook.actions";
import { v4 as uuid } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  viewModel$ = this.store.select(selectWorkbook);

  constructor(
    private store: Store
  ) {
  }

  getDefaultDictionary(): Dictionary | undefined {
    let defaultDictionary: Dictionary | undefined;
    this.viewModel$?.pipe(
      take(1),
    ).subscribe(
      (res) => {
        console.log(res.dictionaries);
        defaultDictionary = res.dictionaries.find(dictionary => dictionary.default) || undefined;
      }
    );
    return defaultDictionary;
  }

  removeTextFromDictionary(workbook: Workbook, dictionaryId: string, textId: string) {
    const newWorkbook = this.createNewWorkbookWithRemovedTextFromDictionary(workbook, dictionaryId, textId);
    this.store.dispatch(setWorkbook({ workbook: newWorkbook }));
  }

  private createNewWorkbookWithRemovedTextFromDictionary(workbook: Workbook, dictionaryId: string, textId: string): Workbook {
    return {
      ...workbook,
      dictionaries: [...workbook.dictionaries.map(dictionary => ({
        ...dictionary,
        texts: [...dictionary.texts.filter((texts) => texts.id !== textId)]
      }))]
    };
  }

  addTextToDictionary(workbook: Workbook, dictionaryId: string, text: Text) {
    const newWorkbook = this.createNewWorkbookWithAddedTextToDictionary(workbook, dictionaryId, text);
    this.store.dispatch(setWorkbook({ workbook: newWorkbook }));
  }

  private createNewWorkbookWithAddedTextToDictionary(workbook: Workbook, dictionaryId: string, text: Text): Workbook {
    return {
      ...workbook,
      dictionaries: [...workbook.dictionaries.map(dictionary => ({
        ...dictionary,
        texts: [...dictionary.texts].concat(dictionary.id === dictionaryId ? [text] : [])
      }))]
    };
  }

  updateDictionary(dictionary: Dictionary) {
    this.viewModel$?.pipe(
      take(1),
      map(workbook => this.createNewWorkbookWithUpdatedDictionary(workbook, dictionary)),
      tap((workbook) => this.store.dispatch(setWorkbook({ workbook: workbook })))
    ).subscribe();
  }

  private createNewWorkbookWithUpdatedDictionary(workbook: Workbook, dictionary: Dictionary): Workbook {
    return {
      ...workbook,
      dictionaries: [...workbook.dictionaries.map(currentDictionary => {
        if (currentDictionary.id === dictionary.id) {
          return {
            ...dictionary
          };
        }
        return currentDictionary;
      })]
    };
  }

  addDictionary(newDictionary: Dictionary) {
    newDictionary.id = uuid();
    newDictionary.texts = [];

    this.viewModel$?.pipe(
      take(1),
      map(workbook => this.createNewWorkbookWithAddedDictionary(workbook, newDictionary)),
      tap((workbook) => this.store.dispatch(setWorkbook({ workbook: workbook })))
    ).subscribe();
  }

  private createNewWorkbookWithAddedDictionary(workbook: Workbook, newDictionary: Dictionary): Workbook {
    return {
      ...workbook,
      dictionaries: [...workbook.dictionaries, newDictionary],
    };
  }

  deleteDictionary(id: string) {
    this.viewModel$?.pipe(
      take(1),
      map(workbook => this.createNewWorkbookWithRemovedDictionary(workbook, id)),
      tap((workbook) => this.store.dispatch(setWorkbook({ workbook: workbook })))
    ).subscribe();
  }

  private createNewWorkbookWithRemovedDictionary(workbook: Workbook, dictionaryIdToDelete: string): Workbook {
    return {
      ...workbook,
      dictionaries: workbook.dictionaries.filter((dictionary) => dictionary.id !== dictionaryIdToDelete)
    };
  }
}
