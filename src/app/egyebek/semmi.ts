// import { Language, Workbook } from "../core/model/workbook";
// import { NewLanguageModalComponent } from "../components/language/new-language-modal/new-language-modal.component";
//
// removeLanguage() {
//   const currentLanguge = this.currentLanguageControl.getRawValue();
//   this.languageService.removeLanguage(currentLanguge.id);
// }
//
// async addLanguageModal(workbook: Workbook) {
//   const modal = await this.modalCtrl.create({
//     component: NewLanguageModalComponent,
//   });
//
//   await modal.present();
//
//   const { data, role } = await modal.onWillDismiss();
//
//   if (role === 'confirm') {
//     const language = data as Language;
//     this.languageService.addLanguage(language, workbook);
//   }
// }


// <ion-item-sliding
// *ngFor="let word of  ((workbook | findDictionaryInWorkbookById: dictionary.id)?.texts | sortTexts)">
//   <ion-item>
//   <ion-input class="ion-margin" [readonly]="true">
//   <ion-label class="ion-text-wrap">{{word.translatedText}}</ion-label>
// </ion-input>
// <ion-label class="ion-text-wrap">{{word.originalText}}</ion-label>
// </ion-item>
// <ion-item-options>
// <ion-item-option>Favorite</ion-item-option>
// <ion-item-option color="danger" (click)="deleteText(workbook, dictionary, word)">Delete</ion-item-option>
//   </ion-item-options>
//   </ion-item-sliding>
