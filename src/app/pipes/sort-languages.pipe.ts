import { Pipe, PipeTransform } from '@angular/core';
import { Language } from "../core/model/workbook";

@Pipe({
  name: 'sortLanguages',
  standalone: true
})
export class SortLanguagesPipe implements PipeTransform {

  transform(languages: Language[]): Language[] {
    const arrayForSort = [...languages];

    return arrayForSort.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

}
