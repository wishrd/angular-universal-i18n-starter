import { NgModule } from '@angular/core';
import { AboutComponent } from './about.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AboutComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AboutComponent
      }
    ])
  ]
})
export class AboutModule {}
