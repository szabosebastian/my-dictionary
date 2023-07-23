import { createFeatureSelector, createSelector } from "@ngrx/store";
import { WorkbookState } from "./workbook.reducer";

export const selectWorkbookState = createFeatureSelector<WorkbookState>("workbook");
export const selectWorkbook = createSelector(
  selectWorkbookState,
  (state: WorkbookState) => state.workbook
);
