import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'your-url-here',
    loadChildren: () => import('./your-url-here/your-url-here.module').then( m => m.YourUrlHerePageModule)
  },
    {
    path: 'song/:id',
    loadChildren: () => import('./song/song.module').then( m => m.SongPageModule)
  },
  {
    path: 'song',
    loadChildren: () => import('./song/song.module').then( m => m.SongPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
