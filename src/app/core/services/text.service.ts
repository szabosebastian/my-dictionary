import { Injectable } from '@angular/core';
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { Store } from "@ngrx/store";
import { setWorkbook } from "../../state/workbook/workbook.actions";
import { Text, Workbook } from "../model/workbook";

@Injectable({
  providedIn: 'root'
})
export class TextService {

  viewModel$ = this.store.select(selectWorkbook);

  constructor(
    private store: Store
  ) {
  }

  updateText(workbook: Workbook, updatedText: Text) {
    const newWorkbook = this.createNewWorkbookWithUpdatedText(workbook, updatedText);
    console.log("updatedText", newWorkbook);
    this.store.dispatch(setWorkbook({ workbook: newWorkbook }));
  }

  private createNewWorkbookWithUpdatedText(workbook: Workbook, updatedText: Text): Workbook {
    return {
      ...workbook,
      dictionaries: [...workbook.dictionaries.map(dictionary => ({
        ...dictionary,
        texts: [...dictionary.texts.map(currentText => {
          if (currentText.id === updatedText.id) {
            return {
              ...updatedText
            };
          }
          return currentText;
        })]
      }))]
    };
  }
}
