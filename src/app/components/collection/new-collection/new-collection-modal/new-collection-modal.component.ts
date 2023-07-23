import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import { cellular } from "ionicons/icons";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-new-collection-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './new-collection-modal.component.html',
  styleUrls: ['./new-collection-modal.component.scss']
})
export class NewCollectionModalComponent {

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

  protected readonly cellular = cellular;
}
