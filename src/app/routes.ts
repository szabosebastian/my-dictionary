import { Routes } from "@angular/router";
import { TabsPage } from "./components/tabs/tabs.page";
import { TranslateComponent } from "./components/translate/translate.component";
import { DictionaryComponent } from "./components/dictionary/dictionary.component";

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'collection',
        component: DictionaryComponent
      },
      {
        path: 'translate',
        component: TranslateComponent
      },
    ]
  }
];

