import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from "@ionic/angular";
import { Text, Workbook } from "../../core/model/workbook";
import { FormBuilder, FormControl, ReactiveFormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { Observable } from "rxjs";
import { DictionaryService } from "../../core/services/dictionary.service";
import { FindTextsByDictionaryPipe } from "../../pipes/find-texts-by-dictionary.pipe";

@Component({
  selector: 'app-translate',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FindTextsByDictionaryPipe],
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent {

  defaultSelectedDictionary = this.dictionaryService.getDefaultDictionary();

  currentDictionaryControl = new FormControl(this.defaultSelectedDictionary, { nonNullable: true });

  form = this.fb.group({
    originalText: this.fb.nonNullable.control(''),
    translatedText: this.fb.nonNullable.control(''),
  });

  workbook$: Observable<Workbook> = this.store.select(selectWorkbook);

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private dictionaryService: DictionaryService
  ) {}

  addTextToDictionary(workbook: Workbook) {
    const dictionaryId = this.currentDictionaryControl.getRawValue().id;
    const text = this.form.getRawValue() as Text;
    this.dictionaryService.addTextToDictionary(workbook, dictionaryId, text);
  }

  consoleLog(workbook: Workbook) {
    console.log(this.currentDictionaryControl.getRawValue());
    console.log(workbook);
  }
}
