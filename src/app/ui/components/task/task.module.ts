import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskRoutingModule } from './task.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { TaskHomeComponent } from './task-home/task-home.component';

@NgModule({
  declarations: [LoginComponent, TaskHomeComponent],
  imports: [CommonModule, TaskRoutingModule, ReactiveFormsModule, FormsModule],
})
export class TaskModule {}
