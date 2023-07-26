import { ResolveFn } from '@angular/router';
import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectWorkbook } from "../state/workbook/workbook.selector";
import { Workbook } from "../core/model/workbook";

export const storeResolver: ResolveFn<Workbook> = (route, state) => {
  const storeService = inject(Store);
  return storeService.select(selectWorkbook);
};
