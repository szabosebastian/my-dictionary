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

  getDefaultLanguage(): Language {
    let defaultLanguage: Language;
    this.viewModel$?.pipe(
      take(1),
    ).subscribe(
      (res) => {
        defaultLanguage = res.defaultLanguage;
      }
    );
    return defaultLanguage!;
  }

  addLanguage(language: Language, workbook: Workbook) {
    const newWorkbook = this.createNewWorkbookWithAddedLanguage(workbook, language);
    this.store.dispatch(setWorkbook({ workbook: newWorkbook }));
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
