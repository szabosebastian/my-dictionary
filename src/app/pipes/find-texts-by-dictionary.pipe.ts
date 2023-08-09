import { Pipe, PipeTransform } from '@angular/core';
import { Dictionary, Text, Workbook } from "../core/model/workbook";

@Pipe({
  name: 'findTextsByDictionary',
  standalone: true
})
export class FindTextsByDictionaryPipe implements PipeTransform {

  transform(workbook: Workbook, dictionary?: Dictionary): Text[] {
    if (!dictionary) {
      return [];
    }
    return workbook.dictionaries.find(d => d.id === dictionary.id)?.texts || [];
  }

}
