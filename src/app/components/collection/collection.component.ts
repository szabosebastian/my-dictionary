import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import { Collection, Dictionary, Language, languageDisplayNames, Workbook } from "../../core/model/workbook";
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WorkbookService } from "../../core/services/workbook.service";
import { NewCollectionModalComponent } from "./new-collection/new-collection-modal/new-collection-modal.component";
import { filter, map, Observable, take, tap } from "rxjs";
import { Storage } from "@ionic/storage-angular";
import { Store } from "@ngrx/store";
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { setWorkbook } from "../../state/workbook/workbook.actions";
import { DictionaryPipe } from "../../pipes/dictionary.pipe";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule, DictionaryPipe],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  language = new FormControl(Language.EN, { nonNullable: true });

  viewModel$?: Observable<Workbook>;

  constructor(
    private workbookService: WorkbookService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private storageService: Storage,
    private store: Store
  ) {}

  protected readonly languageDisplayNames = languageDisplayNames;

  ngOnInit(): void {
    this.viewModel$ = this.store.select(selectWorkbook);
  }

  // getCollections(): Observable<Collection[]> | undefined {
  //   return this.viewModel$?.pipe(tap(console.log), map((wb) => wb.collections));
  // }

  // getCollections(): Observable<Collection[]> {
  //   return this.workbookService.getWorkbook()
  //     .pipe(
  //       map(wb => wb.collections)
  //     );
  // }
  //
  // getDictionaries(language: Language): Observable<Dictionary[]> {
  //   return this.workbookService.getWorkbook()
  //     .pipe(
  //       map(wb => wb.collections),
  //       map(collections => collections.find(d => d.language === language)?.dictionaries || []),
  //     );
  // }

  removeDictionary(id: string) {
    console.log("ASd");

    this.viewModel$?.pipe(
      take(1),
      map(workbook => this.deleteDictionary(workbook, id)),
      tap((wb) => this.store.dispatch(setWorkbook({ workbook: wb })))
    ).subscribe();
  }

  deleteDictionary(workbook: Workbook, dictionaryIdToDelete: string): Workbook {
    console.log("ASd3");
    return {
      ...workbook,
      collections: workbook.collections.map((collection) => ({
        ...collection,
        dictionaries: collection.dictionaries.filter((dictionary) => dictionary.id !== dictionaryIdToDelete),
      })),
    };
  }

// Step 2: Delete the dictionary from the Observable<Workbook>
  deleteDictionaryFromWorkbook(workbook$: Observable<Workbook>, dictionaryIdToDelete: string): Observable<Workbook> {
    console.log("ASd2");
    return workbook$.pipe(
      map((workbook) =>
          // Step 3: Create a new Workbook object with the dictionary deleted
          this.deleteDictionary(workbook, dictionaryIdToDelete)
        // Step 4: Perform side effects (if needed) when the dictionary is delete
      ),
      tap((updatedWorkbook) => {
        // Side effect example: Logging the updated workbook to the console
        console.log('Updated Workbook:', updatedWorkbook);
      }),
      // Step 5: Return the modified Observable<Workbook>
      filter(() => false) // This filter ensures that the original value is not emitted, only the modified value is emitted.
    );
  }


  async addDictionaryModal() {
    const modal = await this.modalCtrl.create({
      component: NewCollectionModalComponent,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      const input = data as Dictionary;
      this.addDictionary(input);
    }
  }

  addDictionary(newDictionary: Dictionary) {
    this.viewModel$?.pipe(
      take(1),
      map(workbook => this.createNewWorkbookWithNewDictionary(workbook, this.language.getRawValue(), newDictionary)),
      tap((wb) => this.store.dispatch(setWorkbook({ workbook: wb })))
    ).subscribe();
  }

  createNewWorkbookWithNewDictionary(workbook: Workbook, language: Language, newDictionary: Dictionary): Workbook {
    return {
      ...workbook,
      collections: workbook.collections.map(c => {
        if (c.language === language) {
          let dictionariesOfCollection = [...c.dictionaries];
          dictionariesOfCollection.push(newDictionary);
        }
        return c;
      }),
    };
  }

  addNewDictionary(workbook: Workbook, language: Language, dictionary: Dictionary): Collection[] {
    return workbook.collections.map(c => {
      if (c.language == language) {
        c.dictionaries.push(dictionary);
      }
      return c;
    });

    // if (collection) {
    //   let dictionariesOfCollection = [...collection.dictionaries];
    //   dictionariesOfCollection.push(dictionary);
    //   return dictionariesOfCollection;
    // }
    //
    // return [];
  }

  newDictonary(): Dictionary[] {
    return [{ id: "1", name: "UJ", textLimit: 2, texts: [] }, { id: "2", name: "2UJ", textLimit: 2, texts: [] }];
  }

  consoleLog() {
    this.viewModel$?.subscribe(res => {
      console.log("res");
      console.log(res);
    });
  }
}
