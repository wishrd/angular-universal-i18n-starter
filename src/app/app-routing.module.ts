import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: './pages/home/home.module#HomeModule'
      },
      {
        path: 'about',
        loadChildren: './pages/about/about.module#AboutModule'
      }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
