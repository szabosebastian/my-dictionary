import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-new-dictionary-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './new-dictionary-modal.component.html',
  styleUrls: ['./new-dictionary-modal.component.scss']
})
export class NewDictionaryModalComponent {

  form = this.fb.group(
    {
      name: this.fb.control("")
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
