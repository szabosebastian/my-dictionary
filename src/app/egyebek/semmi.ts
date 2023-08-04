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
