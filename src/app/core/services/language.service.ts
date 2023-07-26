import { Injectable } from '@angular/core';
import { map, Observable, take, tap } from "rxjs";
import { Language, Workbook } from "../model/workbook";
import { Store } from "@ngrx/store";
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { setWorkbook } from "../../state/workbook/workbook.actions";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  viewModel$?: Observable<Workbook>;

  constructor(
    private store: Store
  ) {
    this.viewModel$ = this.store.select(selectWorkbook);
  }

  getLanguage(shortName: string): Language | undefined {
    let result: Language | undefined;
    this.viewModel$?.pipe(
      take(1),
      tap((workbook) => {
        result = workbook.languages.find((language) => language.shortName === shortName);
      })).subscribe();
    return result;
  }

  addLanguage(language: Language) {
    this.viewModel$?.pipe(
      take(1),
      map(workbook => this.createNewWorkbookWithAddedLanguage(workbook, language)),
      tap((workbook) => this.store.dispatch(setWorkbook({ workbook: workbook })))
    ).subscribe();
  }

  private createNewWorkbookWithAddedLanguage(workbook: Workbook, language: Language): Workbook {
    return {
      ...workbook,
      languages: [...workbook.languages, language],
    };
  }

  removeLanguage(id: string) {
    this.viewModel$?.pipe(
      take(1),
      map(workbook => this.createNewWorkbookWithRemovedLanguageAndDictionaries(workbook, id)),
      tap((workbook) => this.store.dispatch(setWorkbook({ workbook: workbook })))
    ).subscribe();
  }

  private createNewWorkbookWithRemovedLanguageAndDictionaries(workbook: Workbook, languageToDelete: string): Workbook {
    return {
      ...workbook,
      languages: workbook.languages.filter((language) => language.id !== languageToDelete),
      dictionaries: workbook.dictionaries.filter((dictionary) => dictionary.language.id !== languageToDelete)
    };
  }
}
