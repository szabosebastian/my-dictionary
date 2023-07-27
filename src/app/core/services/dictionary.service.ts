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

  addTextToDictionary(workbook: Workbook, dictionaryId: string, text: Text) {
    const newWorkbook = this.createNewWorkbookWithAddedAddedTextToDictionary(workbook, dictionaryId, text);
    this.store.dispatch(setWorkbook({ workbook: newWorkbook }));
  }

  private createNewWorkbookWithAddedAddedTextToDictionary(workbook: Workbook, dictionaryId: string, text: Text): Workbook {
    return {
      ...workbook,
      dictionaries: [...workbook.dictionaries.map(dictionary => ({
        ...dictionary,
        texts: [...dictionary.texts].concat(dictionary.id === dictionaryId ? [text] : [])
      }))]
    };
  }

  addDictionary(newDictionary: Dictionary) {
    newDictionary.id = uuid();

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
