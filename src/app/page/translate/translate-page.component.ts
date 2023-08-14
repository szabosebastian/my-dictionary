import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule, ModalController, NavController, ViewDidEnter } from "@ionic/angular";
import { Dictionary, Text, Workbook } from "../../core/model/workbook";
import { FormBuilder, FormControl, ReactiveFormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { combineLatest, map, Observable, startWith, tap } from "rxjs";
import { DictionaryService } from "../../core/services/dictionary.service";
import { FindTextsByDictionaryPipe } from "../../pipes/find-texts-by-dictionary.pipe";
import { DictionaryTypeaheadComponent } from "../../components/dictionary/typeahead/dictionary-typeahead.component";
import { FindLastTextByDictionaryPipe } from "../../pipes/find-last-text-by-dictionary.pipe";
import { TextService } from "../../core/services/text.service";

@Component({
  selector: 'app-translate',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FindTextsByDictionaryPipe, DictionaryTypeaheadComponent, FindLastTextByDictionaryPipe],
  providers: [FindLastTextByDictionaryPipe],
  templateUrl: './translate-page.component.html',
  styleUrls: ['./translate-page.component.scss']
})
export class TranslatePageComponent implements ViewDidEnter {
  currentDictionaryControl = new FormControl(this.dictionaryService.getDefaultDictionary(), { nonNullable: true });

  form = this.fb.group({
    originalText: this.fb.nonNullable.control(''),
    translatedText: this.fb.nonNullable.control(''),
  });

  lastTextForm = this.fb.group({
    id: this.fb.nonNullable.control(''),
    originalText: this.fb.nonNullable.control(''),
    translatedText: this.fb.nonNullable.control(''),
  });

  workbook$: Observable<Workbook> = combineLatest([
    this.store.select(selectWorkbook),
    this.currentDictionaryControl.valueChanges.pipe(
      startWith(this.currentDictionaryControl.value)
    )
  ]).pipe(
    tap(([workbook, currentDictionary]) => {
      const lastText = workbook.dictionaries.find(d => d.id === currentDictionary?.id)?.texts.slice(-1)[0];
      if (lastText) {
        this.lastTextForm.patchValue(lastText);
      }
    }),
    map(([workbook, currentDictionary]) => {
      return workbook;
    }));

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private dictionaryService: DictionaryService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private navController: NavController,
    private textService: TextService,
  ) {}

  ionViewDidEnter(): void {
    if (this.dictionaryService.getDictionaries().length === 0) {
      this.presentNoDictionaryAlert();
    }
  }

  async presentNoDictionaryAlert() {
    const alert = await this.alertCtrl.create({
      message: 'Please create dictionary.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Create dictionary',
          handler: () => {
            this.navController.navigateRoot("/collection");
          }
        }
      ]
    });

    await alert.present();
  }

  addTextToDictionary(workbook: Workbook) {
    const dictionaryId = this.currentDictionaryControl.getRawValue()!.id;
    const text = this.form.getRawValue() as Text;
    if (text.translatedText && text.originalText) {
      this.dictionaryService.addTextToDictionary(workbook, dictionaryId, text);
      this.form.reset();
    }
  }

  async selectFromDictionaries(dictionaries: Dictionary[]) {
    const modal = await this.modalCtrl.create({
      component: DictionaryTypeaheadComponent,
      componentProps: {
        items: dictionaries,
        title: "Dictionaries"
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.currentDictionaryControl.patchValue(data as Dictionary);
    }
  }

  updateText(workbook: Workbook) {
    console.log('lastTextFrom', this.lastTextForm.getRawValue());
    this.textService.updateText(workbook, this.lastTextForm.getRawValue());
  }

  consoleLog() {
    console.log(this.lastTextForm.getRawValue());
  }
}
