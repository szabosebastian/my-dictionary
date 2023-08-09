import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionSheetController, AlertController, IonicModule, ModalController } from "@ionic/angular";
import { Dictionary, Language } from "../../core/model/workbook";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NewDictionaryModalComponent } from "../../components/dictionary/new-dictionary/new-dictionary-modal.component";
import { combineLatest, debounceTime, distinctUntilChanged, map, startWith, switchMap } from "rxjs";
import { Store } from "@ngrx/store";
import { FindDictionariesByLanguagePipe } from "../../pipes/find-dictionaries-by-language.pipe";
import { CurrentLanguagePipe } from "../../pipes/current-language.pipe";
import { DictionaryService } from "../../core/services/dictionary.service";
import { LanguageService } from "../../core/services/language.service";
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { SortLanguagesPipe } from "../../pipes/sort-languages.pipe";
import { DictionaryComponent } from "../../components/dictionary/dictionary/dictionary.component";

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule, FindDictionariesByLanguagePipe, CurrentLanguagePipe, SortLanguagesPipe],
  templateUrl: './dictionary-page.component.html',
  styleUrls: ['./dictionary-page.component.scss']
})
export class DictionaryPageComponent implements OnInit {

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
    private languageService: LanguageService,
    private alertCtrl: AlertController,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit(): void {
  }

  async addDictionaryModal(dictionary?: Dictionary) {
    const modal = await this.modalCtrl.create({
      component: NewDictionaryModalComponent,
      id: 'alert-modal',
      componentProps: {
        selectedLanguage: this.currentLanguageControl.getRawValue(),
        dictionary
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

  async confirmDelete(dictionaryId: string) {
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
            this.deleteDictionary(dictionaryId);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteDictionary(id: string) {
    this.dictionaryService.deleteDictionary(id);
  }

  async openDictionaryModal(dictionary: Dictionary) {
    const modal = await this.modalCtrl.create({
      component: DictionaryComponent,
      componentProps: {
        dictionary
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
    }
  }

}
