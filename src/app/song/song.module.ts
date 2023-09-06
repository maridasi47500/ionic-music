import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SongPageRoutingModule } from './song-routing.module';

import { SongPage } from './song.page';
import { ReactiveFormsModule } from "@angular/forms";
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    SongPageRoutingModule
  ],
  declarations: [SongPage]
})
export class SongPageModule {}
