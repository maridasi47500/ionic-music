import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { MyAppDataSource } from "../db";
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { MatIconModule } from '@angular/material/icon'
 
import { FileOpener } from '@ionic-native/file-opener/ngx';
import {AuthorPostService } from '../services/author-post.service';
import {OrmService } from '../services/orm.service';

@NgModule({
	providers:[
		FileOpener,
		AuthorPostService,
		OrmService,
                MyAppDataSource
	],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
