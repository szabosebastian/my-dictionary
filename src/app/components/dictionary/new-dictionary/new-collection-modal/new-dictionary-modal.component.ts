import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Language } from "../../../../core/model/workbook";
import { selectWorkbook } from "../../../../state/workbook/workbook.selector";
import { Store } from "@ngrx/store";
import { SortLanguagesPipe } from "../../../../pipes/sort-languages.pipe";
import { v4 as uuid } from "uuid";

@Component({
  selector: 'app-new-dictionary-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, SortLanguagesPipe],
  templateUrl: './new-dictionary-modal.component.html',
  styleUrls: ['./new-dictionary-modal.component.scss']
})
export class NewDictionaryModalComponent implements OnInit {
  @Input() selectedLanguage!: Language;

  viewModel$ = this.store.select(selectWorkbook);

  form = this.fb.group(
    {
      id: this.fb.control(""),
      name: this.fb.control(""),
      language: this.fb.control({} as Language),
      textLimit: this.fb.control(0)
    }
  );

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private store: Store
  ) {
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.form.controls.id.patchValue(uuid());
    return this.modalCtrl.dismiss(
      this.form.getRawValue(),
      'confirm');
  }

  ngOnInit(): void {
    if (this.selectedLanguage) {
      this.form.controls.language.patchValue(this.selectedLanguage);
    }
  }
}
