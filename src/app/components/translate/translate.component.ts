import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import { Dictionary, Text, Workbook } from "../../core/model/workbook";
import { FormBuilder, FormControl, ReactiveFormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { Observable, tap } from "rxjs";
import { DictionaryService } from "../../core/services/dictionary.service";
import { FindTextsByDictionaryPipe } from "../../pipes/find-texts-by-dictionary.pipe";
import { DictionaryTypeaheadComponent } from "../dictionary/typeahead/dictionary-typeahead.component";

@Component({
  selector: 'app-translate',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FindTextsByDictionaryPipe, DictionaryTypeaheadComponent],
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

  workbook$: Observable<Workbook> = this.store.select(selectWorkbook).pipe(tap(console.log));

  // TODO még jól jöhet (compareWith)
  compareIds = (a: Dictionary, b: Dictionary) => a.id === b.id;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private dictionaryService: DictionaryService,
    private modalCtrl: ModalController
  ) {}

  addTextToDictionary(workbook: Workbook) {
    const dictionaryId = this.currentDictionaryControl.getRawValue().id;
    const text = this.form.getRawValue() as Text;
    if (text.translatedText && text.originalText) {
      this.dictionaryService.addTextToDictionary(workbook, dictionaryId, text);
    }
  }

  async confirm(dictionaries: Dictionary[]) {
    const modal = await this.modalCtrl.create({
      component: DictionaryTypeaheadComponent,
      componentProps: {
        items: dictionaries,
        title: "Test title"
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(data);
      console.log("data");
      this.currentDictionaryControl.patchValue(data as Dictionary);
    }
  }

  consoleLog(workbook: Workbook) {
    console.log(this.currentDictionaryControl.getRawValue());
    console.log(workbook);
  }
}
