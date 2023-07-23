import { createAction, props } from "@ngrx/store";
import { Workbook } from "../../core/model/workbook";

// export const getWorkbook = createAction(
//   '[App] getWorkbook',
//   props<{ workbook: Workbook }>()
// );

export const initStorage = createAction(
  '[App] initStorage',
);

export const initWorkbook = createAction(
  '[App] initWorkbook',
  props<{ workbook: Workbook }>()
);

export const setWorkbook = createAction(
  '[App] setWorkbook',
  props<{ workbook: Workbook }>()
);
