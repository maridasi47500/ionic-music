import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import "reflect-metadata";
import { defineCustomElements as jeepSqlite} from 'jeep-sqlite/loader';

if (environment.production) {
  enableProdMode();
}
jeepSqlite(window);
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
