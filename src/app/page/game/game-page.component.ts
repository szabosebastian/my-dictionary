import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import { SortLanguagesPipe } from "../../pipes/sort-languages.pipe";
import { NewCollectionComponent } from "../../components/collection/new-collection/new-collection.component";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, IonicModule, SortLanguagesPipe],
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent {


  constructor(
    private modalCtrl: ModalController
  ) {
  }

  async createNewCollectionModal() {
    const modal = await this.modalCtrl.create({
      component: NewCollectionComponent,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
    }
  }
}
