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
import { WorkbookService } from "../../core/services/workbook.service";
import { NewDictionaryModalComponent } from "./new-dictionary/new-collection-modal/new-dictionary-modal.component";
import { map, Observable, take, tap } from "rxjs";
import { Storage } from "@ionic/storage-angular";
import { Store } from "@ngrx/store";
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { setWorkbook } from "../../state/workbook/workbook.actions";
import { FindDictionariesByLanguagePipe } from "../../pipes/find-dictionaries-by-language.pipe";
import { CurrentLanguagePipe } from "../../pipes/current-language.pipe";

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule, FindDictionariesByLanguagePipe, CurrentLanguagePipe],
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit {

  currentLanguageControl = new FormControl({
    shortName: DefaultLanguage.EN,
    displayName: defaultLanguagesDisplayNames[DefaultLanguage.EN]
  } as Language, { nonNullable: true });

  viewModel$?: Observable<Workbook>;

  constructor(
    private workbookService: WorkbookService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private storageService: Storage,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.viewModel$ = this.store.select(selectWorkbook);
  }

  removeDictionary(id: string) {
    this.viewModel$?.pipe(
      take(1),
      map(workbook => this.deleteDictionary(workbook, id)),
      tap((workbook) => this.store.dispatch(setWorkbook({ workbook: workbook })))
    ).subscribe();
  }

  deleteDictionary(workbook: Workbook, dictionaryIdToDelete: string): Workbook {
    return {
      ...workbook,
      dictionaries: workbook.dictionaries.filter((dictionary) => dictionary.id !== dictionaryIdToDelete)
    };
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
      this.addDictionary(dictionary);
    }
  }

  addDictionary(newDictionary: Dictionary) {
    this.viewModel$?.pipe(
      take(1),
      map(workbook => this.createNewWorkbookWithNewDictionary(workbook, this.currentLanguageControl.getRawValue(), newDictionary)),
      tap((wb) => this.store.dispatch(setWorkbook({ workbook: wb })))
    ).subscribe();
  }

  createNewWorkbookWithNewDictionary(workbook: Workbook, language: Language, newDictionary: Dictionary): Workbook {
    return {
      ...workbook,
      dictionaries: [...workbook.dictionaries, newDictionary],
    };
  }

  consoleLog() {
    console.log(this.currentLanguageControl);
    this.viewModel$?.subscribe(res => {
      console.log("res");
      console.log(res);
    });
  }
}
