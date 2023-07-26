import { Routes } from "@angular/router";
import { TabsPage } from "./components/shell/tabs/tabs.page";
import { TranslateComponent } from "./components/translate/translate.component";
import { DictionaryComponent } from "./components/dictionary/dictionary.component";
import { storeResolver } from "./resolvers/store.resolver";

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'collection',
        component: DictionaryComponent,
        resolve: { store: storeResolver }
      },
      {
        path: 'translate',
        component: TranslateComponent
      },
    ]
  }
];

