import { Pipe, PipeTransform } from '@angular/core';
import { Dictionary, Language, Workbook } from "../core/model/workbook";
import { map, Observable, of } from "rxjs";

@Pipe({
  name: 'findDictionariesByLanguage',
  standalone: true
})
export class FindDictionariesByLanguagePipe implements PipeTransform {

  transform(language: Language, workbook?: Observable<Workbook>): Observable<Dictionary[]> {
    if (!workbook) {
      return of([]);
    }
    return workbook
      .pipe(
        map(workbook => workbook.dictionaries.filter(d => d.language.shortName === language.shortName) || []),
      );
  }

}
