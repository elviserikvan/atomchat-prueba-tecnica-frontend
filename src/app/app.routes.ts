import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./ui/components/task/task.module').then((m) => m.TaskModule),
  },
];
