import { Component } from '@angular/core';

import {
	  HttpClient,
	    HttpEventType,
	      HttpErrorResponse
} from "@angular/common/http";

import { map, catchError } from "rxjs/operators";

import { throwError } from "rxjs";

import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],

})
export class AppComponent {
      public isWeb: boolean = false;
  private initPlugin: boolean;
  constructor(
    private platform: Platform
  ) {
   
  }

 
}
