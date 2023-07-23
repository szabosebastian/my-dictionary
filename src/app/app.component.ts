import { Component } from '@angular/core';
import { Storage } from "@ionic/storage-angular";
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {

  constructor(
    private storage: Storage
  ) {}

  // async ngOnInit() {
  //   await this.storage.create();
  //   await this.storage.clear(); //todo
  //
  //   let workbook: Workbook = await this.storage.get(WORKBOOK);
  //
  //   console.log(workbook);
  //
  //   if (!workbook) {
  //     //todo id
  //     workbook = { id: '', collections: [] } as Workbook;
  //     this.createCollections(workbook);
  //     workbook.collections.find(d => d.language = Language.EN)?.dictionaries.push(
  //       {
  //         name: "teszt",
  //         id: '1',
  //         textLimit: 10,
  //         texts: []
  //       }
  //     );
  //     await this.storage.set(WORKBOOK, workbook);
  //     console.log("Workbook uploaded by collections");
  //   }
  //   console.log(workbook);
  // }
  //
  // createCollections(workbook: Workbook) {
  //   const languageKeys = Object.keys(Language);
  //   languageKeys.forEach((key, index) => {
  //     workbook.collections.push({ language: key, dictionaries: [] } as Collection);
  //   });
  // }
}
