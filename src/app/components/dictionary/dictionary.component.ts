import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import { Dictionary, Language } from "../../core/model/workbook";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NewDictionaryModalComponent } from "./new-dictionary/new-collection-modal/new-dictionary-modal.component";
import { combineLatest, debounceTime, distinctUntilChanged, map, startWith, switchMap } from "rxjs";
import { Store } from "@ngrx/store";
import { FindDictionariesByLanguagePipe } from "../../pipes/find-dictionaries-by-language.pipe";
import { CurrentLanguagePipe } from "../../pipes/current-language.pipe";
import { DictionaryService } from "../../core/services/dictionary.service";
import { LanguageService } from "../../core/services/language.service";
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { SortLanguagesPipe } from "../../pipes/sort-languages.pipe";

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule, FindDictionariesByLanguagePipe, CurrentLanguagePipe, SortLanguagesPipe],
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit {

  defaultSelectedLanguage = this.languageService.getDefaultLanguage();

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
    private modalCtrl: ModalController,
    private store: Store,
    private dictionaryService: DictionaryService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
  }

  async addDictionaryModal() {
    const modal = await this.modalCtrl.create({
      component: NewDictionaryModalComponent,
      id: 'alert-modal',
      componentProps: {
        selectedLanguage: this.currentLanguageControl.getRawValue()
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      const dictionary = data as Dictionary;
      console.log(dictionary);
      this.dictionaryService.addDictionary(dictionary);
    }
  }

  deleteDictionary(id: string) {
    this.dictionaryService.deleteDictionary(id);
  }

  consoleLog() {
    console.log(this.currentLanguageControl.getRawValue());
    this.viewModel$?.subscribe(res => {
      console.log("res");
      console.log(res);
      console.log(this.defaultSelectedLanguage);
    });
  }
}
