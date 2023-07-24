import { Workbook } from "../../core/model/workbook";
import { createReducer, on } from "@ngrx/store";
import { initWorkbook, setWorkbook } from "./workbook.actions";

export interface WorkbookState {
  workbook: Workbook;
}

export const initialState: WorkbookState = {
  workbook: {
    id: "",
    languages: [],
    dictionaries: [],
    collections: []
  }
};

export const workbookReducer = createReducer(
  initialState,
  on(initWorkbook, (state, props) => {
    return props;
  }),
  on(setWorkbook, (state, props) => {
    return props;
  })
);
