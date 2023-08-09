import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule, ModalController } from "@ionic/angular";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Dictionary, Language } from "../../../core/model/workbook";
import { selectWorkbook } from "../../../state/workbook/workbook.selector";
import { Store } from "@ngrx/store";
import { SortLanguagesPipe } from "../../../pipes/sort-languages.pipe";
import { v4 as uuid } from "uuid";
import { DictionaryService } from "../../../core/services/dictionary.service";

@Component({
  selector: 'app-new-dictionary-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, SortLanguagesPipe],
  templateUrl: './new-dictionary-modal.component.html',
  styleUrls: ['./new-dictionary-modal.component.scss']
})
export class NewDictionaryModalComponent implements OnInit {
  @Input() selectedLanguage!: Language;
  @Input() dictionary!: Dictionary;

  compareIds = (a: Language, b: Language) => a.id === b.id;

  viewModel$ = this.store.select(selectWorkbook);

  form = this.fb.group(
    {
      id: this.fb.control(""),
      name: this.fb.control(""),
      description: this.fb.control(""),
      language: this.fb.control({} as Language),
      textLimit: this.fb.control(0),
      default: this.fb.control(false)
    }
  );

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private store: Store,
    private alertController: AlertController,
    private dictionaryService: DictionaryService
  ) {
  }

  async presentAlert(dictionary: Dictionary) {
    const alert = await this.alertController.create({
      header: "Default dictionary already exists!",
      message: `Dictionary: ${dictionary.name}`,
      buttons: ['OK'],
    });

    await alert.present();
  }

  changeCheckbox(event: Event) {
    if ((event as CustomEvent).detail.checked) {
      const defaultDictionary = this.dictionaryService.getDefaultDictionary();
      if (defaultDictionary) {
        this.presentAlert(defaultDictionary);
        this.form.controls.default.patchValue(false);
      }
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.form.controls.id.patchValue(uuid());
    return this.modalCtrl.dismiss(
      this.form.getRawValue(),
      'confirm');
  }

  ngOnInit(): void {
    if (this.selectedLanguage && !this.dictionary) {
      this.form.controls.language.patchValue(this.selectedLanguage);
    }
    if (this.dictionary) {
      this.form.patchValue(this.dictionary);
    }
    console.log(this.form.getRawValue());
  }
}
