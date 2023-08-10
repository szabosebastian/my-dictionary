import { Pipe, PipeTransform } from '@angular/core';
import { Dictionary, Workbook } from "../core/model/workbook";

@Pipe({
  name: 'findDictionaryInWorkbookById',
  standalone: true
})
export class FindDictionaryInWorkbookByIdPipe implements PipeTransform {

  transform(workbook: Workbook, dictionaryId: string): Dictionary | undefined {
    return workbook.dictionaries.find(dic => dic.id === dictionaryId);
  }

}
