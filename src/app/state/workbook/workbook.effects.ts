import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { switchMap, take, tap } from "rxjs";
import { initStorage, initWorkbook, setWorkbook } from "./workbook.actions";
import { WORKBOOK } from "../../core/model/workbook";
import { StorageService } from "../../core/services/storage.service";

@Injectable()
export class WorkbookEffects {

  constructor(
    private actions$: Actions,
    private storageService: StorageService
  ) {}

  initStorageAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      tap(x => console.log("init storage ngrx")),
      switchMap(() =>
        this.storageService.initStorage().then(res => {
          return initStorage();
        })
      )),
  );

  initWorkbookAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(initStorage),
      tap(x => console.log("init workbook ngrx")),
      switchMap(() =>
        this.storageService.getValue(WORKBOOK).then(wb => {
          return initWorkbook({ workbook: wb });
        })
      )),
  );

  setWorkbookAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setWorkbook),
      take(1),
      tap(x => console.log("set workbook ngrx")),
      tap(({ workbook }) =>
        this.storageService.setValue(WORKBOOK, workbook)
      )),
  );
}
