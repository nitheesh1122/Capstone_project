import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="glass-panel login-card">
        <h2 class="gradient-text title">Welcome Back</h2>
        <p class="subtitle">Access your restaurant dashboard</p>
        
        <form (ngSubmit)="login()" class="login-form">
          <mat-form-field appearance="fill" class="custom-field">
            <mat-label>Email Address</mat-label>
            <input matInput [(ngModel)]="email" name="email" required placeholder="Enter your email">
          </mat-form-field>
          
          <mat-form-field appearance="fill" class="custom-field">
            <mat-label>Password</mat-label>
            <input matInput type="password" [(ngModel)]="password" name="password" required placeholder="Enter your password">
          </mat-form-field>
          
          <div class="actions">
            <button mat-raised-button color="primary" class="login-btn" type="submit">
              Sign In
            </button>
            <div class="register-link">
              <span>New here?</span>
              <a routerLink="/register" [queryParams]="{ role: role }">Create Account ({{role}})</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 40px;
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .title {
      font-size: 32px;
      margin-bottom: 8px;
      text-align: center;
    }
    .subtitle {
      text-align: center;
      color: var(--text-secondary);
      margin-bottom: 32px;
      font-weight: 300;
      font-size: 16px;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .login-btn {
      width: 100%;
      padding: 24px 0;
      font-size: 16px;
      background: var(--primary-gradient) !important;
      color: white !important;
      margin-top: 16px;
      transition: transform 0.2s;
    }
    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.5);
    }
    .register-link {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: var(--text-secondary);
    }
    .register-link a {
      color: #a855f7;
      font-weight: 600;
      margin-left: 8px;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  role = 'Customer'; // Default
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['role']) {
        this.role = params['role'];
      }
    });
  }

  login() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (user: any) => { // User object is emitted from tap
        const role = this.auth.getUser()?.role || this.auth.getUser()?.user?.role || 'Customer';

        if (role === 'Manager' || role === 'Admin') {
          this.router.navigate(['/manager']);
        } else {
          this.router.navigate(['/customer-dashboard']);
        }
      },
      error: (err) => alert('Login failed')
    });
  }
}
