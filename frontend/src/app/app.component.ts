import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar class="glass-nav" *ngIf="showNavbar">
      <span class="logo gradient-text">WorldPlate</span>
      <span class="spacer"></span>
      
      <div class="nav-links">
        <button mat-button routerLink="/tables" routerLinkActive="active-link">
          <mat-icon>table_restaurant</mat-icon> Tables
        </button>
        <button mat-button routerLink="/queue" routerLinkActive="active-link">
          <mat-icon>people</mat-icon> Queue
        </button>
      </div>

      <div class="user-actions" *ngIf="auth.user$ | async as user; else loginBtn">
        <span class="welcome">Hi, {{ user.name }}</span>
        <button mat-raised-button color="warn" (click)="auth.logout()">Logout</button>
      </div>
      <ng-template #loginBtn>
        <button mat-raised-button color="primary" routerLink="/login">Login</button>
      </ng-template>
    </mat-toolbar>
    
    <!-- Conditionally remove padding for Landing Page to allow full bleed -->
    <main class="content-wrapper" [class.no-padding]="!showNavbar">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .glass-nav {
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(16px);
      background: rgba(11, 11, 11, 0.8) !important;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      padding: 0 24px;
      height: 70px;
    }
    .logo {
      font-size: 24px;
      letter-spacing: -0.5px;
      margin-right: 32px;
    }
    .spacer { flex: 1 1 auto; }
    .nav-links button {
      margin: 0 4px;
      color: var(--text-secondary);
      transition: all 0.3s ease;
    }
    .nav-links button.active-link {
      color: var(--text-primary);
      background: rgba(255,255,255,0.1);
    }
    .nav-links mat-icon { margin-right: 4px; }
    .welcome { margin-right: 16px; font-size: 14px; color: var(--text-secondary); }
    
    .content-wrapper {
      padding: 32px;
      max-width: 1200px;
      margin: 0 auto;
      animation: fadeIn 0.5s ease-out;
    }
    .content-wrapper.no-padding {
      padding: 0;
      max-width: 100%;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AppComponent implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);
  showNavbar = true;

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide navbar if we are on the landing page or manager dashboard
      this.showNavbar = event.urlAfterRedirects !== '/' && !event.urlAfterRedirects.startsWith('/manager');
    });
  }
}
