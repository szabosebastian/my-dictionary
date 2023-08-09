import { Routes } from "@angular/router";
import { TabsPage } from "./components/shell/tabs/tabs.page";
import { TranslateComponent } from "./components/translate/translate.component";
import { DictionaryPageComponent } from "./page/dictionary/dictionary-page.component";
import { ShellComponent } from "./components/shell/shell/shell.component";

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [{
      path: '',
      component: TabsPage,
      children: [
        {
          path: 'collection',
          component: DictionaryPageComponent
        },
        {
          path: 'translate',
          component: TranslateComponent
        },
      ]
    }]
  },
];

