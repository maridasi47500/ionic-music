import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YourUrlHerePage } from './your-url-here.page';

const routes: Routes = [
  {
    path: '',
    component: YourUrlHerePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YourUrlHerePageRoutingModule {}
