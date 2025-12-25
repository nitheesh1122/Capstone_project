import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, RouterModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Register as {{ role }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="register()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Name</mat-label>
              <input matInput [(ngModel)]="name" name="name" required>
            </mat-form-field>
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput [(ngModel)]="email" name="email" required>
            </mat-form-field>
             <mat-form-field appearance="fill" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" [(ngModel)]="password" name="password" required>
            </mat-form-field>
            
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Role</mat-label>
              <mat-select [(ngModel)]="role" name="role">
                <mat-option value="Customer">Customer</mat-option>
                <mat-option value="Manager">Manager</mat-option>
              </mat-select>
            </mat-form-field>
            
            <div class="actions">
              <button mat-raised-button color="primary" type="submit">Register</button>
              <a mat-button routerLink="/login" [queryParams]="{ role: role }">Login</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { display: flex; justify-content: center; padding-top: 50px; min-height: 80vh; align-items: center; }
    mat-card { width: 100%; max-width: 400px; padding: 20px; }
    .full-width { width: 100%; margin-bottom: 10px; }
    .actions { display: flex; justify-content: space-between; margin-top: 20px; align-items: center; }
  `]
})
export class RegisterComponent implements OnInit {
  name = '';
  email = '';
  password = '';
  role = 'Customer';
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

  register() {
    this.auth.register({ name: this.name, email: this.email, password: this.password, role: this.role }).subscribe({
      next: () => {
        alert('Registration successful. Please login.');
        this.router.navigate(['/login'], { queryParams: { role: this.role } });
      },
      error: (err) => alert('Registration failed')
    });
  }
}
