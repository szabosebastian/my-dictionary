import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import { DefaultLanguage, Dictionary, Language } from "../../core/model/workbook";
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NewDictionaryModalComponent } from "./new-dictionary/new-collection-modal/new-dictionary-modal.component";
import { combineLatest, debounceTime, distinctUntilChanged, map, startWith, switchMap } from "rxjs";
import { Storage } from "@ionic/storage-angular";
import { Store } from "@ngrx/store";
import { FindDictionariesByLanguagePipe } from "../../pipes/find-dictionaries-by-language.pipe";
import { CurrentLanguagePipe } from "../../pipes/current-language.pipe";
import { NewLanguageModalComponent } from "../language/new-language-modal/new-language-modal.component";
import { DictionaryService } from "../../core/services/dictionary.service";
import { LanguageService } from "../../core/services/language.service";
import { ActivatedRoute } from "@angular/router";
import { selectWorkbook } from "../../state/workbook/workbook.selector";

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule, FindDictionariesByLanguagePipe, CurrentLanguagePipe],
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit {

  defaultSelectedLanguage = this.languageService.getLanguage(DefaultLanguage.EN)!;

  currentLanguageControl = new FormControl(this.defaultSelectedLanguage, { nonNullable: true });
  typeaheadControl = new FormControl('', { nonNullable: true });

  viewModel$ = this.store.select(selectWorkbook);

  filteredDictionaries$ = combineLatest([
    this.typeaheadControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(this.typeaheadControl.value)),
    this.currentLanguageControl.valueChanges.pipe(
      startWith(this.currentLanguageControl.value)),
  ]).pipe(
    switchMap(([searchedText, currentLanguage]) => {
      return this.viewModel$.pipe(
        map((workbook) => workbook.dictionaries.filter((dictionary) => dictionary.language.shortName === (currentLanguage as Language).shortName) || []),
        map((dictionary) => dictionary.filter((dc) => dc.name.includes(searchedText)))
      );
    })
  );

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private storageService: Storage,
    private store: Store,
    private dictionaryService: DictionaryService,
    private languageService: LanguageService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
      console.log(this.defaultSelectedLanguage);
    });
  }
}
