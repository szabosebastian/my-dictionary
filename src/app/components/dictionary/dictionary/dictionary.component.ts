import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dictionary, Language, Workbook } from "../../../core/model/workbook";
import { ActionSheetController, AlertController, IonicModule, ModalController } from "@ionic/angular";
import { SortTextsPipe } from "../../../pipes/sort-texts.pipe";
import { DictionaryService } from "../../../core/services/dictionary.service";
import { Store } from "@ngrx/store";
import { FindDictionaryInWorkbookByIdPipe } from "../../../pipes/find-dictionary-in-workbook-by-id.pipe";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SortLanguagesPipe } from "../../../pipes/sort-languages.pipe";
import { debounceTime, distinctUntilChanged, map, Observable, startWith, tap } from "rxjs";
import { selectWorkbook } from "../../../state/workbook/workbook.selector";

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, IonicModule, SortTextsPipe, FindDictionaryInWorkbookByIdPipe, ReactiveFormsModule, SortLanguagesPipe],
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit {
  @Input() dictionary!: Dictionary;
  selectedSegment: string = "texts";
  isComponentReadonly: boolean = true;

  workbook$: Observable<Workbook> = this.store.select(selectWorkbook).pipe(tap(console.log));

  form = this.fb.group({
    id: this.fb.control(""),
    name: this.fb.control(""),
    default: this.fb.control(false),
    language: this.fb.control({}),
    description: this.fb.control(""),
    textLimit: this.fb.control(0),
    texts: this.fb.array<FormGroup>([])
  });

  typeaheadControl = new FormControl('', { nonNullable: true });

  get textsForm(): Observable<FormGroup<any>[]> {
    return this.typeaheadControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(this.typeaheadControl.value)
    ).pipe(
      map(searchedText => {
        searchedText = searchedText.toLowerCase();
        return this.form.controls.texts.controls.filter((group) => {
          return group.controls?.['originalText'].value.toLowerCase().includes(searchedText) || group.controls?.['translatedText'].value.toLowerCase().includes(searchedText);
        });
      })
    );
  }

  compareIds = (a: Language, b: Language) => a.id === b.id;

  constructor(
    private modalCtrl: ModalController,
    private dictionaryService: DictionaryService,
    private store: Store,
    private actionSheetController: ActionSheetController,
    private fb: FormBuilder,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.form.patchValue(this.dictionary);

    this.dictionary.texts.forEach(text => {
      this.form.controls.texts.push(
        this.fb.group({
          id: this.fb.nonNullable.control(text.id),
          originalText: this.fb.nonNullable.control(text.originalText),
          translatedText: this.fb.nonNullable.control(text.translatedText)
        })
      );
    });

    this.form.disable();
  }

  deleteText(textIndex: number) {
    this.form.controls.texts.removeAt(textIndex);
  }

  async sortTextSheet() {
    const alert = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Original text ascending',
          icon: 'arrow-up-outline',
          handler: () => {
            this.sortOriginalTextAscending();
          }
        },
        {
          text: 'Translated text ascending',
          icon: 'arrow-up-outline',
          handler: () => {
            this.sortTranslatedTextAscending();
          }
        },
        {
          text: 'Translated text descending',
          icon: 'arrow-down-outline',
          handler: () => {
            this.sortTranslatedTextDescending();
          }
        },
        {
          text: 'Original text descending',
          icon: 'arrow-down-outline',
          handler: () => {
            this.sortOriginalTextDescending();
          }
        }
      ]
    });

    await alert.present();
  }

  sortOriginalTextAscending(): void {
    this.form.controls.texts.controls.sort((a, b) => a.controls?.['originalText'].value.localeCompare(b.controls?.['originalText'].value));
  }

  sortOriginalTextDescending(): void {
    this.form.controls.texts.controls.sort((a, b) => a.controls?.['originalText'].value.localeCompare(b.controls?.['originalText'].value)).reverse();
  }

  sortTranslatedTextAscending(): void {
    this.form.controls.texts.controls.sort((a, b) => a.controls?.['translatedText'].value.localeCompare(b.controls?.['translatedText'].value));
  }

  sortTranslatedTextDescending(): void {
    this.form.controls.texts.controls.sort((a, b) => a.controls?.['translatedText'].value.localeCompare(b.controls?.['translatedText'].value)).reverse();
  }

  async confirmTextDeleteSheet(textIndex: number) {
    const alert = await this.actionSheetController.create({
      header: 'Do you confirm to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteText(textIndex);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlert(dictionary: Dictionary) {
    const alert = await this.alertController.create({
      header: "Default dictionary already exists!",
      message: `Dictionary: ${dictionary.name}`,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async confirmDictionaryDelete() {
    const alert = await this.actionSheetController.create({
      header: 'Do you confirm to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: async () => {
            this.deleteDictionary(this.dictionary.id);
            await alert.dismiss();
            await this.modalCtrl.dismiss(null, 'cancel');
          }
        }
      ]
    });

    await alert.present();

  }

  deleteDictionary(id: string) {
    this.dictionaryService.deleteDictionary(id);
  }

  changeDefaultToggle(event: Event) {
    const toggleValue = (event as CustomEvent).detail.checked;
    if (toggleValue !== undefined) {
      if (toggleValue) {
        const defaultDictionary = this.dictionaryService.getDefaultDictionary();
        if (defaultDictionary && defaultDictionary.id != this.dictionary.id) {
          console.log(defaultDictionary);
          this.presentAlert(defaultDictionary);
          this.form.controls.default.patchValue(false);
        } else {
          this.form.controls.default.patchValue(true);
        }
      } else {
        this.form.controls.default.patchValue(false);
      }
    }
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.target.value;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  edit() {
    this.isComponentReadonly = !this.isComponentReadonly;
    if (this.isComponentReadonly) {
      console.log("Dictionary update");
      this.dictionaryService.updateDictionary(this.form.getRawValue() as Dictionary);
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  log() {
    console.log(this.form.getRawValue());
  }
}
