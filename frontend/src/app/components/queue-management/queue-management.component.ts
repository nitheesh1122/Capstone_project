import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueService } from '../../services/queue.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-queue-management',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="container">
      <h2>Queue Status</h2>
      
      <!-- User Status Card -->
      <mat-card *ngIf="status" [@cardAnimation]>
        <mat-card-header>
          <mat-card-title>Waiting Line</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="stats-row">
            <div class="stat-item">
                <span class="label">Total Waiting</span>
                <span class="value">{{ status.queueLength || 0 }}</span>
            </div>
            <div class="stat-item">
                <span class="label">Est. Wait</span>
                <span class="value">{{ status.estimatedWaitTime || 0 }}m</span>
            </div>
          </div>
          
          <div class="user-status-section" *ngIf="status.yourPosition; else notInQueue" [@fadeIn]>
            <div class="queue-ticket">
                <span class="ticket-label">Your Position</span>
                <span class="ticket-number">#{{ status.yourPosition }}</span>
            </div>
            <p class="wait-msg">Please wait near the entrance area.</p>
            <button mat-raised-button color="warn" (click)="leaveQueue()">Leave Queue</button>
          </div>
          
          <ng-template #notInQueue>
            <div class="join-section">
                <p>Join the line to get seated!</p>
                <button mat-raised-button color="primary" size="large" (click)="joinQueue()">Join Queue Now</button>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>

      <!-- Manager View: Full List -->
      <div *ngIf="isManager() && status?.queue" class="queue-list-container">
          <h3>Current Queue</h3>
          <ul [@listAnimation]="status.queue.length">
              <li *ngFor="let user of status.queue" class="queue-item">
                  <span class="user-info">
                      <strong>{{ user.name }}</strong>
                      <span class="joined-at">Joined: {{ user.queue_joined_at | date:'shortTime' }}</span>
                  </span>
                  <span class="status-badge">Waiting</span>
              </li>
          </ul>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 600px; margin: 0 auto; }
    h2, h3 { text-align: center; color: #333; margin-bottom: 20px; }
    
    mat-card { margin-bottom: 30px; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
    
    .stats-row { display: flex; justify-content: space-around; padding: 15px 0; background: #f9fafb; border-bottom: 1px solid #eee; }
    .stat-item { display: flex; flexDirection: column; align-items: center; }
    .stat-item .label { font-size: 0.8rem; color: #666; text-transform: uppercase; letter-spacing: 1px; }
    .stat-item .value { font-size: 1.5rem; font-weight: bold; color: #333; }

    .user-status-section { padding: 30px 20px; text-align: center; }
    .queue-ticket { 
        background: linear-gradient(135deg, #3f51b5, #5c6bc0); 
        color: white; 
        padding: 20px; 
        border-radius: 12px; 
        display: inline-block; 
        margin-bottom: 20px;
        box-shadow: 0 4px 15px rgba(63, 81, 181, 0.4);
    }
    .ticket-label { display: block; font-size: 0.9rem; opacity: 0.9; margin-bottom: 5px; }
    .ticket-number { display: block; font-size: 3rem; font-weight: bold; line-height: 1; }
    .wait-msg { color: #666; margin-bottom: 20px; }

    .join-section { padding: 40px 20px; text-align: center; }
    .join-section p { font-size: 1.1rem; margin-bottom: 20px; color: #555; }

    .queue-list-container { background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    ul { list-style: none; padding: 0; margin: 0; }
    .queue-item { 
        padding: 15px; 
        border-bottom: 1px solid #f0f0f0; 
        display: flex; 
        justify-content: space-between; 
        align-items: center;
        transition: background 0.2s;
    }
    .queue-item:last-child { border-bottom: none; }
    .queue-item:hover { background: #f9f9f9; }
    
    .user-info { display: flex; flex-direction: column; }
    .joined-at { font-size: 0.8rem; color: #999; }
    .status-badge { 
        background: #e3f2fd; 
        color: #1976d2; 
        padding: 4px 8px; 
        border-radius: 4px; 
        font-size: 0.75rem; 
        font-weight: bold; 
    }
  `],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger('50ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true }),
        query(':leave', [
          animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(20px)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class QueueManagementComponent implements OnInit {
  status: any;
  queueService = inject(QueueService);
  auth = inject(AuthService);
  user: any;

  ngOnInit() {
    this.auth.user$.subscribe(u => this.user = u);
    this.loadStatus();
  }

  loadStatus() {
    this.queueService.getQueueStatus().subscribe(data => this.status = data);
  }

  joinQueue() {
    this.queueService.joinQueue().subscribe(() => this.loadStatus());
  }

  leaveQueue() {
    this.queueService.leaveQueue().subscribe(() => this.loadStatus());
  }

  isManager() {
    return this.user?.role === 'Manager' || this.user?.role === 'Admin';
  }
}
