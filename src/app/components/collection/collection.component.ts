import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import { Collection, Dictionary, Language, languageDisplayNames, WORKBOOK, Workbook } from "../../core/model/workbook";
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WorkbookService } from "../../core/services/workbook.service";
import { NewCollectionModalComponent } from "./new-collection/new-collection-modal/new-collection-modal.component";
import { filter, from, map, Observable, startWith, switchMap, tap } from "rxjs";
import { Storage } from "@ionic/storage-angular";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  language = new FormControl(Language.EN, { nonNullable: true });

  collections$: Observable<Collection[]> = this.getCollections();
  dictionaries$: Observable<Dictionary[]> = this.language.valueChanges.pipe(
    startWith(this.language.value),
    switchMap((language) => this.getDictionaries(language))
  );

  constructor(
    private workbookService: WorkbookService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private storageService: Storage
  ) {}

  protected readonly languageDisplayNames = languageDisplayNames;

  ngOnInit(): void {
    // this.workbookService.getWorkbook().then(wb => this.workbook = wb);
  }

  getCollections(): Observable<Collection[]> {
    return this.workbookService.getWorkbook()
      .pipe(
        map(wb => wb.collections)
      );
  }

  getDictionaries(language: Language): Observable<Dictionary[]> {
    return this.workbookService.getWorkbook()
      .pipe(
        map(wb => wb.collections),
        map(collections => collections.find(d => d.language === language)?.dictionaries || []),
      );
  }

  removeDictionary(id: string) {
    console.log("ASd");

    this.workbookService.getWorkbook().pipe(
      map(workbook => this.deleteDictionary(workbook, id)),
      switchMap(modifiedWorkbook => from(this.storageService.set(WORKBOOK, modifiedWorkbook)))
    ).subscribe();

    this.deleteDictionaryFromWorkbook(this.workbookService.getWorkbook(), id);
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


  async addCollection() {
    const modal = await this.modalCtrl.create({
      component: NewCollectionModalComponent,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
    }
  }

  consoleLog() {
    // console.log(this.workbook);
    console.log(this.language);
    // this.workbookService.getWorkbook().subscribe(res => console.log(res));
  }
}
