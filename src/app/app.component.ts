import { Component } from '@angular/core';

import {
	  HttpClient,
	    HttpEventType,
	      HttpErrorResponse
} from "@angular/common/http";

import { map, catchError } from "rxjs/operators";

import { throwError } from "rxjs";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
	  progress: number;

	    constructor(private http: HttpClient) {}

}
