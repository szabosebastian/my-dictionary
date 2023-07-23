import { Pipe, PipeTransform } from '@angular/core';
import { map, Observable, of } from "rxjs";
import { Dictionary, Language, Workbook } from "../core/model/workbook";

@Pipe({
  name: 'dictionary',
  standalone: true
})
export class DictionaryPipe implements PipeTransform {

  transform(language: Language, workbook?: Observable<Workbook>): Observable<Dictionary[]> {
    if (!workbook) {
      return of([]);
    }
    return workbook
      .pipe(
        map(wb => wb.collections),
        map(collections => collections.find(d => d.language === language)?.dictionaries || []),
      );
  }
}
