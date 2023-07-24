import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-new-language-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './new-language-modal.component.html',
  styleUrls: ['./new-language-modal.component.scss']
})
export class NewLanguageModalComponent {

  form = this.fb.group(
    {
      shortName: this.fb.control("", { nonNullable: false }),
      displayName: this.fb.control("", { nonNullable: false }),
    }
  );

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(
      this.form.getRawValue(),
      'confirm');
  }
}
