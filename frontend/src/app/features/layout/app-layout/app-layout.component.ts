import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, DrawerModule, TranslocoModule],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
})
export class AppLayoutComponent {
  readonly authService = inject(AuthService);
  mobileMenuOpen = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'layout.menu.upcoming', icon: 'pi pi-clock', route: '/upcoming' },
    { label: 'layout.menu.transactions', icon: 'pi pi-list', route: '/transactions' },
    { label: 'layout.menu.accounts', icon: 'pi pi-credit-card', route: '/accounts' },
    { label: 'layout.menu.tags', icon: 'pi pi-tags', route: '/tags' },
    { label: 'layout.menu.charts', icon: 'pi pi-chart-bar', route: '/charts' },
    { label: 'layout.menu.budgets', icon: 'pi pi-wallet', route: '/budgets' },
    { label: 'layout.menu.recurrents', icon: 'pi pi-refresh', route: '/recurrents' },
    { label: 'layout.menu.rules', icon: 'pi pi-sliders-h', route: '/rules' },
  ];
}
