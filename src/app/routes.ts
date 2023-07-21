import { Routes } from "@angular/router";
import { TabsPage } from "./components/tabs/tabs.page";
import { TranslateComponent } from "./components/translate/translate.component";
import { CollectionComponent } from "./components/collection/collection.component";

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'collection',
        component: CollectionComponent
      },
      {
        path: 'translate',
        component: TranslateComponent
      },
    ]
  }
];

