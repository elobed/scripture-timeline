import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'timeline',
    pathMatch: 'full'
  },
  {
    path: 'timeline',
    loadComponent: () =>
      import('./pages/timeline-page/timeline-page.component').then(m => m.TimelinePageComponent)
  },
  {
    path: '**',
    redirectTo: 'timeline'
  }
];
