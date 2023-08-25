import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import { SortLanguagesPipe } from "../../pipes/sort-languages.pipe";
import { NewCollectionComponent } from "../../components/collection/new-collection/new-collection.component";
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { Store } from "@ngrx/store";
import { Workbook } from "../../core/model/workbook";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from "rxjs";

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
        return this.viewModel$.pipe(
          map((workbook) => workbook.collections.filter((collection) => collection.name.includes(searchedText)))
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
      component: NewCollectionComponent,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
    }
  }

  log(workbook: Workbook) {
    console.log(workbook.collections);
  }
}
