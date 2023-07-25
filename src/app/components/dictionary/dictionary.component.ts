import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import {
  DefaultLanguage,
  defaultLanguagesDisplayNames,
  Dictionary,
  Language,
  Workbook
} from "../../core/model/workbook";
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NewDictionaryModalComponent } from "./new-dictionary/new-collection-modal/new-dictionary-modal.component";
import { Observable } from "rxjs";
import { Storage } from "@ionic/storage-angular";
import { Store } from "@ngrx/store";
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { FindDictionariesByLanguagePipe } from "../../pipes/find-dictionaries-by-language.pipe";
import { CurrentLanguagePipe } from "../../pipes/current-language.pipe";
import { NewLanguageModalComponent } from "../language/new-language-modal/new-language-modal.component";
import { DictionaryService } from "../../core/services/dictionary.service";
import { LanguageService } from "../../core/services/language.service";

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule, FindDictionariesByLanguagePipe, CurrentLanguagePipe],
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit {

  defaultSelectedLanguage = this.languageService.getLanguage(DefaultLanguage.EN);

  currentLanguageControl = new FormControl({
    shortName: DefaultLanguage.EN,
    displayName: defaultLanguagesDisplayNames[DefaultLanguage.EN]
  } as Language, { nonNullable: true });

  viewModel$?: Observable<Workbook>;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private storageService: Storage,
    private store: Store,
    private dictionaryService: DictionaryService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.viewModel$ = this.store.select(selectWorkbook);
    console.log(this.defaultSelectedLanguage);
  }

  async addDictionaryModal() {
    const modal = await this.modalCtrl.create({
      component: NewDictionaryModalComponent,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      const dictionary = data as Dictionary;
      dictionary.language = this.currentLanguageControl.getRawValue();
      this.dictionaryService.addDictionary(dictionary);
    }
  }

  async addLanguageModal() {
    const modal = await this.modalCtrl.create({
      component: NewLanguageModalComponent,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      const language = data as Language;
      this.languageService.addLanguage(language);
    }
  }

  deleteDictionary(id: string) {
    this.dictionaryService.deleteDictionary(id);
  }

  removeLanguage() {
    const currentLanguge = this.currentLanguageControl.getRawValue();
    this.languageService.removeLanguage(currentLanguge.id);
  }

  consoleLog() {
    console.log(this.currentLanguageControl);
    this.viewModel$?.subscribe(res => {
      console.log("res");
      console.log(res);
    });
  }
}
