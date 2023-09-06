import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule,IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";


import { ReactiveFormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from './explore-container/explore-container.module';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';

import {SQLite} from '@awesome-cordova-plugins/sqlite/ngx';
@NgModule( {

    declarations: [ AppComponent ],
    imports: [ ReactiveFormsModule,BrowserModule,FormsModule,HttpClientModule,IonicModule.forRoot(),ExploreContainerComponentModule,AppRoutingModule ],
    providers: [

        { provide: RouteReuseStrategy,useClass: IonicRouteStrategy },
        SQLitePorter,
        SQLite
        
         ],
    bootstrap: [ AppComponent ],
    schemas: [  ],
} )

export class AppModule { }
