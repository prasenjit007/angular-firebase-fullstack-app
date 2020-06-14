import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';

import { AuthGuard } from './auth/AuthGuard';
import {TrainingModule} from './training/training.module'

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  //{ path: 'training', loadChildren: './training/training.module#TrainingModule' , canLoad: [AuthGuard]}
 // { path: 'training', loadChildren:  './training/training.module#TrainingModule' , canLoad: [AuthGuard]}

 { path: 'training', loadChildren:   () => import('./training/training.module').then(m => m.TrainingModule) , canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
