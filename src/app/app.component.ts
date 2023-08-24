import { Component } from '@angular/core';

import {
	  HttpClient,
	    HttpEventType,
	      HttpErrorResponse
} from "@angular/common/http";

import { map, catchError } from "rxjs/operators";

import { throwError } from "rxjs";

import { Platform } from '@ionic/angular';
import { SQLiteService } from './services/sqlite.service';

import { DetailService } from './services/detail.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
      public isWeb: boolean = false;
  private initPlugin: boolean;
  constructor(
    private platform: Platform,
    private sqlite: SQLiteService,
    private detail: DetailService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.sqlite.initializePlugin().then(async (ret) => {
        this.initPlugin = ret;
        if( this.sqlite.platform === "web") {
          this.isWeb = true;
          await customElements.whenDefined('jeep-sqlite');
          const jeepSqliteEl = document.querySelector('jeep-sqlite');
          if(jeepSqliteEl != null) {
            await this.sqlite.initWebStore();
            console.log(`>>>> isStoreOpen ${await jeepSqliteEl.isStoreOpen()}`);
          } else {
            console.log('>>>> jeepSqliteEl is null');
          }
        }

        console.log(`>>>> in App  this.initPlugin ${this.initPlugin}`);
      });
    });
  }
}
