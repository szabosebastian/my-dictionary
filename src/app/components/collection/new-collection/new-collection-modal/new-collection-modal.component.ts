import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import { cellular } from "ionicons/icons";

@Component({
  selector: 'app-new-collection-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './new-collection-modal.component.html',
  styleUrls: ['./new-collection-modal.component.scss']
})
export class NewCollectionModalComponent {

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  protected readonly cellular = cellular;
}
