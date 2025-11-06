import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
        children: [
            {
                path: 'change-detection',
                title: 'Change Detection',
                loadComponent: () => import('./dashboard/pages/change-detection/change-detection').then(m => m.ChangeDetection)
            },
            {
                path: 'control-flow',
                title: 'Control Flow',
                loadComponent: () => import('./dashboard/pages/control-flow/control-flow').then(m => m.ControlFlow)
            },
            {
                path: 'defer-options',
                title: 'Defer Options',
                loadComponent: () => import('./dashboard/pages/defer-options/defer-options').then(m => m.DeferOptions)
            },
            {
                path: 'defer-views',
                title: 'Defer Views',
                loadComponent: () => import('./dashboard/pages/defer-views/defer-views').then(m => m.DeferViews)
            },
            {
                path: 'user/:id',
                title: 'User',
                loadComponent: () => import('./dashboard/pages/user/user').then(m => m.User)
            },
            {
                path: 'user-list',
                title: 'User List',
                loadComponent: () => import('./dashboard/pages/users/users').then(m => m.Users)
            },
            {
                path: 'view-transition',
                title: 'View Transition',
                loadComponent: () => import('./dashboard/pages/view-transition/view-transition').then(m => m.ViewTransition)
            },
            {
                path: '',
                redirectTo: 'change-detection',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];
