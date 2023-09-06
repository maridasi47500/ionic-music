import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { MatIconModule } from '@angular/material/icon'

import {SQLitePorter} from '@ionic-native/sqlite-porter';
import {SQLite} from '@awesome-cordova-plugins/sqlite/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

@NgModule( {
    providers: [
  
        FileOpener,
        SQLite
    ],
    imports: [
    
        IonicModule,
        CommonModule,
        FormsModule,

        MatIconModule,
        ExploreContainerComponentModule,
        Tab1PageRoutingModule
    ],
    declarations: [   Tab1Page ]
} )
export class Tab1PageModule { }
