import { Injectable } from '@angular/core';
import { Collection, Workbook } from "../model/workbook";
import { setWorkbook } from "../../state/workbook/workbook.actions";
import { selectWorkbook } from "../../state/workbook/workbook.selector";
import { Store } from "@ngrx/store";
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

  updateCollection(collection: Collection) {
    this.viewModel$?.pipe(
      take(1),
      map(workbook => this.createNewWorkbookWithUpdatedDictionary(workbook, collection)),
      tap((workbook) => this.store.dispatch(setWorkbook({ workbook: workbook })))
    ).subscribe();
  }

  private createNewWorkbookWithUpdatedDictionary(workbook: Workbook, collection: Collection): Workbook {
    return {
      ...workbook,
      collections: [...workbook.collections.map(currentCollection => {
        if (currentCollection.id === collection.id) {
          return {
            ...collection
          };
        }
        return currentCollection;
      })]
    };
  }
}
