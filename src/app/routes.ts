import { Routes } from "@angular/router";
import { TabsPage } from "./tabs/tabs.page";
import { Tab1Component } from "./tab1/tab1.component";

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        component: Tab1Component
      }
    ]
  }
];

