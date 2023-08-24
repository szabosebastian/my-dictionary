import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from "@ionic/angular";
import { selectWorkbook } from "../../../state/workbook/workbook.selector";
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-new-collection',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.scss']
})
export class NewCollectionComponent {

  viewModel$ = this.store.select(selectWorkbook);


  constructor(
    private store: Store
  ) {
  }
}
