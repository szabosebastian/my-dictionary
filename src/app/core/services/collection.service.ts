import { Injectable } from '@angular/core';
import { Collection, Workbook } from "../model/workbook";
import { setWorkbook } from "../../state/workbook/workbook.actions";
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { Store } from "@ngrx/store";
import { v4 as uuid } from "uuid";
import { map, take, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  viewModel$ = this.store.select(selectWorkbook);

  constructor(
    private store: Store
  ) {
  }

  addCollection(collection: Collection) {
    collection.id = uuid();

    this.viewModel$?.pipe(
      take(1),
      map(workbook => this.createNewWorkbookWithAddedCollection(workbook, collection)),
      tap((workbook) => this.store.dispatch(setWorkbook({ workbook: workbook })))
    ).subscribe();
  }

  private createNewWorkbookWithAddedCollection(workbook: Workbook, newCollection: Collection): Workbook {
    return {
      ...workbook,
      collections: [...workbook.collections, newCollection],
    };
  }
}
