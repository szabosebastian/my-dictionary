import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage-angular";
import { WORKBOOK, Workbook } from "../model/workbook";
import { from, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WorkbookService {

  constructor(
    private storage: Storage
  ) {}

  getWorkbook(): Observable<Workbook> {
    return from(this.storage.get(WORKBOOK));
  }
}
