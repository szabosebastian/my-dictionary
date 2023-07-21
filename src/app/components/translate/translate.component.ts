import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from "@ionic/angular";
import { WorkbookService } from "../../core/services/workbook.service";
import { Workbook } from "../../core/model/workbook";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-translate',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent implements OnInit {

  form = this.fb.group({
    language: this.fb.nonNullable.control(''),
    originalWord: this.fb.nonNullable.control(''),
  });
  workbook?: Workbook;

  constructor(
    private workbookService: WorkbookService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // this.workbookService.getWorkbook().then(wb => this.workbook = wb);
  }

  consoleLog() {
    console.log(this.form.getRawValue());
  }
}
