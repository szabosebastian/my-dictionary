import { Pipe, PipeTransform } from '@angular/core';
import { Language, Workbook } from "../core/model/workbook";

@Pipe({
  name: 'currentLanguage',
  standalone: true
})
export class CurrentLanguagePipe implements PipeTransform {

  transform(languageShortName: string, workbook: Workbook): Language | undefined {
    return workbook.languages.find(language => language.shortName === languageShortName);
  }

}
