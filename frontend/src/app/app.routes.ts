import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./features/layout/app-layout/app-layout.component').then((m) => m.AppLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'accounts',
        loadComponent: () =>
          import('./features/accounts/accounts-list/accounts-list.component').then((m) => m.AccountsListComponent),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./features/transactions/transaction-grid/transaction-grid.component').then(
            (m) => m.TransactionGridComponent,
          ),
      },
      {
        path: 'tags',
        loadComponent: () =>
          import('./features/tags/tags-grid/tags-grid.component').then((m) => m.TagsGridComponent),
      },
      {
        path: 'charts',
        loadComponent: () =>
          import('./features/charts/balance-evolution/balance-evolution.component').then(
            (m) => m.BalanceEvolutionComponent,
          ),
      },
      {
        path: 'budgets',
        loadComponent: () =>
          import('./features/budgets/budgets/budgets.component').then((m) => m.BudgetsComponent),
      },
      {
        path: 'recurrents',
        loadComponent: () =>
          import('./features/recurrents/recurrents-list/recurrents-list.component').then(
            (m) => m.RecurrentsListComponent,
          ),
      },
      {
        path: 'rules',
        loadComponent: () =>
          import('./features/tags/tag-rules/tag-rules.component').then((m) => m.TagRulesComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/user/user-profile/user-profile.component').then((m) => m.UserProfileComponent),
      },
      { path: '', redirectTo: 'transactions', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
