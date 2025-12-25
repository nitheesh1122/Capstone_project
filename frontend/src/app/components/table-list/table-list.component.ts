import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableService } from '../../services/table.service';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Floor Plan</h2>
        <div *ngIf="isManager()" class="manager-controls">
            <button mat-raised-button color="accent" (click)="addTable()">
                <mat-icon>add</mat-icon> Add Table
            </button>
        </div>
      </div>
      
      <div class="legend">
        <span class="status-dot available"></span> Available
        <span class="status-dot occupied"></span> Occupied
        <span class="status-dot reserved"></span> Reserved
      </div>

      <div class="floor-plan">
        <div *ngFor="let table of tables" 
             class="table-wrapper"
             [style.width]="'120px'" 
             [style.height]="'120px'">
             
            <!-- Chairs Layout -->
            <div class="chairs-container" [ngClass]="{'round-layout': table.type === 'Round', 'square-layout': table.type !== 'Round'}">
                <div *ngFor="let chair of getChairs(table.capacity); let i = index" 
                     class="chair"
                     [style.transform]="getChairTransform(i, table.capacity, table.type)">
                </div>
            </div>

            <!-- The Table Shape -->
            <div class="table-shape" 
                 [ngClass]="[table.type?.toLowerCase() || 'square', table.status.toLowerCase()]"
                 (click)="isManager() ? toggleStatus(table) : null"
                 matTooltip="Table {{ table.table_number }} - {{ table.status }}"
                 [matTooltipPosition]="'above'">
                 
                 <div class="table-info">
                    <span class="t-num">{{ table.table_number }}</span>
                    <span class="t-cap">{{ table.capacity }} <mat-icon style="font-size: 10px; height: 10px; width: 10px;">person</mat-icon></span>
                 </div>
            </div>

            <!-- Delete Action (absolute positioned) -->
            <button *ngIf="isManager()" 
                    class="delete-btn" 
                    mat-icon-button 
                    color="warn" 
                    (click)="deleteTable(table.id)">
                <mat-icon>close</mat-icon>
            </button>
        </div>
      </div>
      
      <div *ngIf="tables.length === 0" class="empty-state">
        <p>No tables configured. Add one to start.</p>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 30px; background: #f5f5f5; min-height: 80vh; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    
    .legend { display: flex; gap: 15px; margin-bottom: 30px; font-size: 0.9rem; color: #666; }
    .status-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 5px; }
    .status-dot.available { background: #4caf50; box-shadow: 0 0 5px #4caf50; }
    .status-dot.occupied { background: #f44336; box-shadow: 0 0 5px #f44336; }
    .status-dot.reserved { background: #ff9800; box-shadow: 0 0 5px #ff9800; }

    .floor-plan { 
        display: flex; 
        flex-wrap: wrap; 
        gap: 60px; 
        padding: 40px; 
        background: white; 
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        justify-content: center;
    }

    .table-wrapper { position: relative; display: flex; justify-content: center; align-items: center; }

    /* Chairs */
    .chairs-container { position: absolute; width: 100%; height: 100%; pointer-events: none; }
    .chair { 
        position: absolute; 
        width: 30px; 
        height: 10px; 
        background: #333; 
        border-radius: 4px;
        left: 50%;
        top: 50%;
        margin-left: -15px; /* half width */
        margin-top: -5px; /* half height */
        transform-origin: center;
    }
    
    /* Table Shapes */
    .table-shape {
        width: 80px;
        height: 80px;
        position: relative;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        border: 2px solid rgba(255,255,255,0.2);
    }
    .table-shape:hover { transform: scale(1.05); z-index: 10; }

    .table-shape.round { border-radius: 50%; }
    .table-shape.square { border-radius: 12px; }

    /* Status Colors */
    .available { background: linear-gradient(135deg, #4caf50, #43a047); color: white; }
    .occupied { background: linear-gradient(135deg, #f44336, #e53935); color: white; }
    .reserved { background: linear-gradient(135deg, #ff9800, #fb8c00); color: white; }

    .table-info { text-align: center; }
    .t-num { display: block; font-size: 1.2rem; font-weight: bold; }
    .t-cap { font-size: 0.8rem; opacity: 0.9; display: flex; align-items: center; justify-content: center; gap: 2px; }

    .delete-btn { position: absolute; top: -10px; right: -10px; z-index: 5; transform: scale(0.8); background: white; border: 1px solid #ddd; }
    
    .empty-state { text-align: center; color: #888; margin-top: 50px; }
  `]
})
export class TableListComponent implements OnInit {
  tables: any[] = [];
  tableService = inject(TableService);
  auth = inject(AuthService);
  user: any;

  ngOnInit() {
    this.auth.user$.subscribe(u => this.user = u);
    this.loadTables();
  }

  loadTables() {
    this.tableService.getTables().subscribe(data => this.tables = data);
  }

  isManager() {
    return this.user?.role === 'Manager' || this.user?.role === 'Admin';
  }

  addTable() {
    const num = prompt('Table Number:');
    const cap = prompt('Capacity (e.g., 2, 4, 6):');
    const shape = prompt('Shape (Round or Square)?', 'Square');

    if (num && cap) {
      // Normailize shape input
      let finalShape = 'Square';
      if (shape && shape.toLowerCase().includes('round')) finalShape = 'Round';

      this.tableService.addTable({
        table_number: num,
        capacity: parseInt(cap),
        type: finalShape,
        status: 'Available'
      }).subscribe(() => this.loadTables());
    }
  }

  deleteTable(id: number) {
    if (confirm('Delete this table?')) {
      this.tableService.deleteTable(id).subscribe(() => this.loadTables());
    }
  }

  toggleStatus(table: any) {
    if (!this.isManager()) return;

    const statuses = ['Available', 'Occupied', 'Reserved'];
    const currentIndex = statuses.indexOf(table.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    this.tableService.updateTable(table.id, { status: nextStatus }).subscribe(() => this.loadTables());
  }

  getChairs(capacity: number): any[] {
    return new Array(capacity || 0).fill(0);
  }

  getChairTransform(index: number, total: number, type: string): string {
    // Distance from center
    const radius = 55;

    if (type === 'Round') {
      const angle = (index / total) * 360;
      return `rotate(${angle}deg) translate(${radius}px)`;
    } else {
      // Square/Rectangle logic approx
      // Distribute evenly around the square perimeter? 
      // Simplified: Just use radial for now as it looks okay for squares too if rotated
      const angle = (index / total) * 360;
      return `rotate(${angle}deg) translate(${radius}px)`;
    }
  }
}
