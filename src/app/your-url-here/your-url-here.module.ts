import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { YourUrlHerePageRoutingModule } from './your-url-here-routing.module';

import { YourUrlHerePage } from './your-url-here.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    YourUrlHerePageRoutingModule
  ],
  declarations: [YourUrlHerePage]
})
export class YourUrlHerePageModule {}
