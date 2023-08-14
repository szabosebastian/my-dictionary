import { Pipe, PipeTransform } from '@angular/core';
import { Dictionary, Text, Workbook } from "../core/model/workbook";

@Pipe({
  name: 'findLastTextByDictionary',
  standalone: true
})
export class FindLastTextByDictionaryPipe implements PipeTransform {

  transform(workbook: Workbook, dictionary?: Dictionary): Text | undefined {
    if (!dictionary) {
      return undefined;
    }
    return workbook.dictionaries.find(d => d.id === dictionary.id)?.texts.slice(-1)[0];
  }

}
