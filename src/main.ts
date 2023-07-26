import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withComponentInputBinding,
  withPreloading,
  withRouterConfig
} from '@angular/router';
import { APP_ROUTES } from "./app/routes";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { WorkbookEffects } from "./app/state/workbook/workbook.effects";
import { workbookReducer } from "./app/state/workbook/workbook.reducer";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { StorageService } from "./app/core/services/storage.service";

if (environment.production) {
  enableProdMode();
}

function proba(storageService: StorageService) {
  return () => storageService.initStorage();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      APP_ROUTES,
      withPreloading(PreloadAllModules),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
      withComponentInputBinding(),
    ),
    importProvidersFrom
    (BrowserModule,
      IonicModule,
      IonicModule.forRoot(),
      IonicStorageModule.forRoot(),
      StoreModule.forRoot(
        {
          workbook: workbookReducer
        }
      ),
      StoreDevtoolsModule.instrument({
        name: "DevTool MyDictionary NgRx",
        maxAge: 25, // Retains last 25 states
        logOnly: false, // Restrict extension to log-only mode
        trace: true
      }),
      EffectsModule.forRoot([WorkbookEffects])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: proba,
      deps: [StorageService],
      multi: true
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ]
})
  .catch(err => console.log(err));
