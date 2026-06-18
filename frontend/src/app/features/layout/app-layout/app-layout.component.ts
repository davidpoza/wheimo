import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, DrawerModule],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
})
export class AppLayoutComponent {
  readonly authService = inject(AuthService);
  mobileMenuOpen = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Transactions', icon: 'pi pi-list', route: '/transactions' },
    { label: 'Accounts', icon: 'pi pi-bank', route: '/accounts' },
    { label: 'Tags', icon: 'pi pi-tags', route: '/tags' },
    { label: 'Charts', icon: 'pi pi-chart-bar', route: '/charts' },
    { label: 'Budgets', icon: 'pi pi-wallet', route: '/budgets' },
  ];

  logout() {
    this.authService.logout().subscribe();
  }
}
