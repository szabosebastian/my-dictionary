import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dictionary } from "../../../core/model/workbook";
import { IonicModule, ModalController } from "@ionic/angular";

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent {
  @Input() dictionary!: Dictionary;
  selectedSegment: string = "default";

  constructor(
    private modalCtrl: ModalController,
  ) {}

  segmentChanged(event: any) {
    this.selectedSegment = event.target.value;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss("", 'confirm');
  }
}
