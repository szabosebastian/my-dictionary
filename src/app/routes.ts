import { Routes } from "@angular/router";
import { TabsPage } from "./components/shell/tabs/tabs.page";
import { TranslatePageComponent } from "./page/translate/translate-page.component";
import { DictionaryPageComponent } from "./page/dictionary/dictionary-page.component";
import { ShellComponent } from "./components/shell/shell/shell.component";
import { GamePageComponent } from "./page/game/game-page.component";
import { ProfilePageComponent } from "./page/profile/profile-page.component";

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
          component: TranslatePageComponent
        },
        {
          path: 'game',
          component: GamePageComponent
        },
        {
          path: 'profile',
          component: ProfilePageComponent
        },
      ]
    }]
  },
];

