import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@/app/core/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { TaskHomeComponent } from './task-home/task-home.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'tasks', component: TaskHomeComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule {}
