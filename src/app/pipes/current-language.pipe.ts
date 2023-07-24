import { Pipe, PipeTransform } from '@angular/core';
import { map, Observable, of } from "rxjs";
import { Language, Workbook } from "../core/model/workbook";

@Pipe({
  name: 'currentLanguage',
  standalone: true
})
export class CurrentLanguagePipe implements PipeTransform {

  transform(languageShortName: string, workbook?: Observable<Workbook>): Observable<Language | undefined> {
    if (!workbook) {
      return of();
    }
    return workbook.pipe(
      map(wb => wb.languages.find(language => language.shortName === languageShortName)),
    );
  }

}
