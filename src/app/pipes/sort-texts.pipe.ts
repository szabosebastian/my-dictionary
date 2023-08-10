import { Pipe, PipeTransform } from '@angular/core';
import { Text } from "../core/model/workbook";

@Pipe({
  name: 'sortTexts',
  standalone: true
})
export class SortTextsPipe implements PipeTransform {

  transform(texts?: Text[], shouldSortByOriginalText?: boolean): Text[] {
    if (!texts) {
      return [];
    }

    const arrayForSort = [...texts];

    if (shouldSortByOriginalText) {
      return arrayForSort.sort((a, b) => a.originalText.localeCompare(b.originalText));
    }

    return arrayForSort.sort((a, b) => a.translatedText.localeCompare(b.translatedText));
  }
}
