import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import { SortLanguagesPipe } from "../../pipes/sort-languages.pipe";
import { UpsertCollectionComponent } from "../../components/collection/upsert-collection/upsert-collection.component";
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { Store } from "@ngrx/store";
import { Collection, Workbook } from "../../core/model/workbook";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from "rxjs";
import { GuessingGameComponent } from "../../components/collection/guessing-game/guessing-game.component";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, IonicModule, SortLanguagesPipe, ReactiveFormsModule],
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent {
  typeaheadControl = new FormControl('', { nonNullable: true });

  filteredCollections$ =
    this.typeaheadControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(this.typeaheadControl.value),
    ).pipe(
      switchMap((searchedText) => {
        searchedText = searchedText.toLowerCase();
        return this.viewModel$.pipe(
          map((workbook) => workbook.collections.filter((collection) => collection.name.toLowerCase().includes(searchedText)))
        );
      })
    );

  viewModel$ = this.store.select(selectWorkbook);

  constructor(
    private modalCtrl: ModalController,
    private store: Store
  ) {
  }

  async createNewCollectionModal() {
    const modal = await this.modalCtrl.create({
      component: UpsertCollectionComponent,
    });

    await modal.present();
  }

  async playGuessingGame(collection: Collection) {
    const modal = await this.modalCtrl.create({
      component: GuessingGameComponent,
      componentProps: {
        collection
      }
    });

    await modal.present();
  }

  async modifyCollectionModal(existingCollection?: Collection) {
    const modal = await this.modalCtrl.create({
      component: UpsertCollectionComponent,
      componentProps: {
        existingCollection: existingCollection
      }
    });

    await modal.present();
  }

  log(workbook: Workbook) {
    console.log(workbook.collections);
  }
}
