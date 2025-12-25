import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

interface OrderCard {
  tableNo: string;
  orderId: string;
  image: string;
  itemName: string;
  status: 'Dine in' | 'served' | 'Wait list' | 'Take away';
}

interface FoodItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  isPopular?: boolean;
}

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="dashboard-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="logo">
          <mat-icon class="logo-icon">restaurant_menu</mat-icon>
          <h2>WorldPlate</h2>
        </div>

        <nav class="side-nav">
          <a class="nav-item" [class.active]="currentView === 'dashboard'" (click)="setView('dashboard')">
            <mat-icon>dashboard</mat-icon> Dashboard
          </a>
          <a class="nav-item" [class.active]="currentView === 'menu-management'" (click)="setView('menu-management')">
            <mat-icon>restaurant</mat-icon> Menu Management
          </a>
          <a class="nav-item"><mat-icon>table_restaurant</mat-icon> Table Reservations</a>
          <a class="nav-item"><mat-icon>local_offer</mat-icon> Offers & Discounts</a>
          <a class="nav-item"><mat-icon>payments</mat-icon> Earnings / Payouts</a>
          <a class="nav-item"><mat-icon>people</mat-icon> Staff Management</a>
        </nav>

        <div class="upgrade-card">
          <mat-icon>lock</mat-icon>
          <div class="upgrade-text">
            <h4>Unlock New Features</h4>
            <p>Maximize Your Food Delivery Management Efficiency</p>
            <button class="btn-upgrade">Upgrade</button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Header -->
        <header class="top-header">
          <h1>{{ getTitle() }}</h1>
          <div class="header-actions">
            <div class="search-bar">
              <mat-icon>search</mat-icon>
              <input type="text" placeholder="Search here...">
            </div>
            <button class="icon-btn"><mat-icon>notifications</mat-icon></button>
            <div class="user-profile">
              <img src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg" alt="User" class="avatar-3d">
              <span>{{ user?.name || 'Manager' }}</span>
            </div>
          </div>
        </header>

        <!-- DASHBOARD VIEW -->
        <div *ngIf="currentView === 'dashboard'">
        <!-- Table Status Overview -->
        <div class="status-metrics">
          <div class="metric-card">
            <div class="metric-icon total"><mat-icon>restaurant</mat-icon></div>
            <div class="metric-info">
              <span class="label">Total Tables</span>
              <span class="value">{{ totalTables }}</span>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon occupied"><mat-icon>people</mat-icon></div>
            <div class="metric-info">
              <span class="label">Occupied</span>
              <span class="value">{{ occupiedTables }}</span>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon reserved"><mat-icon>event</mat-icon></div>
            <div class="metric-info">
              <span class="label">Reserved</span>
              <span class="value">{{ reservedTables }}</span>
            </div>
          </div>
          <div class="metric-card">
             <div class="metric-icon available"><mat-icon>check_circle</mat-icon></div>
             <div class="metric-info">
               <span class="label">Available</span>
               <span class="value">{{ availableTables }}</span>
             </div>
          </div>
        </div>

        <!-- Live Table Management -->
        <div class="section-title">
          <h3>Live Floor Status</h3>
        </div>

        <div class="table-grid">
           <div class="table-item" *ngFor="let table of tables" 
                [ngClass]="getStatusClass(table.status)"
                (click)="selectTable(table)"

              <div class="table-header">
                <span class="table-name">{{ table.name }}</span>
                <span class="seats"><mat-icon>group</mat-icon> {{ table.seats }}</span>
              </div>
              <div class="table-body">
                 <mat-icon class="status-icon">
                    {{ table.status === 'Occupied' ? 'restaurant_menu' : (table.status === 'Reserved' ? 'timer' : 'check_circle_outline') }}
                 </mat-icon>
                 <span class="status-text">{{ table.status }}</span>
                 <span class="time-elapsed" *ngIf="table.time !== '-'">{{ table.time }}</span>
              </div>
           </div>
        </div>

        <!-- Order Details Side Panel (Overlay) -->
        <div class="order-panel-overlay" *ngIf="selectedTable" (click)="closeDetails()"></div>
        <div class="order-details-panel" [class.open]="selectedTable">
           <div class="panel-header">
              <h2>{{ selectedTable?.name }} - Orders</h2>
              <button mat-icon-button (click)="closeDetails()"><mat-icon>close</mat-icon></button>
           </div>
           
           <div class="panel-body">
              <div class="order-status-banner" [ngClass]="getStatusClass(selectedTable?.status)">
                 {{ selectedTable?.status }}
              </div>

              <div class="order-list" *ngIf="selectedTable?.orders?.length > 0; else noOrders">
                 <div class="order-item" *ngFor="let order of selectedTable.orders">
                    <div class="item-details">
                       <h4>{{ order.name }}</h4>
                       <div class="qty-time">
                           <span class="qty">x{{ order.qty }}</span>
                           <span class="eta" *ngIf="order.eta && order.status === 'Preparing'"> • Est: {{ order.eta }}</span>
                       </div>
                    </div>
                    <span class="item-status {{ order.status.toLowerCase() }}">{{ order.status }}</span>
                 </div>
              </div>
              <ng-template #noOrders>
                 <div class="empty-state">
                    <mat-icon>no_meals</mat-icon>
                    <p>No active orders for this table.</p>
                 </div>
              </ng-template>
           </div>
           
           <div class="panel-footer" *ngIf="selectedTable?.orders?.length > 0">
              <div class="action-buttons">
                 <button class="btn-action primary">Add Items</button>
                 <button class="btn-action secondary">Bill Table</button>
              </div>
           </div>
        </div>

        <!-- Food Menu Categories -->
        <div class="section-title">
          <h3>Food Menu</h3>
          <div class="nav-arrows">
            <button class="arrow-btn"><mat-icon>chevron_left</mat-icon></button>
            <button class="arrow-btn"><mat-icon>chevron_right</mat-icon></button>
          </div>
        </div>
        
        <div class="categories-row">
            <div class="cat-item" *ngFor="let cat of categories" [class.active]="selectedCategory === cat.name" (click)="setCategory(cat.name)">
              <div class="cat-img">
                 <img [src]="cat.image">
              </div>
              <span>{{ cat.name }}</span>
            </div>
        </div>

        <!-- Food Menu Grid -->
        <div class="section-title">
           <h3>{{ selectedCategory === 'All' ? 'Menu Items' : selectedCategory }}</h3>
           <a href="#" class="view-all">View All</a>
        </div>
        
        <div class="trending-grid">
           <div class="trend-card" *ngFor="let item of filteredMenuItems">
              <div class="trend-img" style="width: 80px; height: 80px; border-radius: 12px; overflow: hidden;">
                 <img [src]="item.image" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div class="trend-info">
                 <span class="week-tag">{{ item.category }}</span>
                 <h4>{{ item.name }}</h4>
                 <div class="price-add">
                    <span class="price">₹{{ item.price }}</span>
                    <button class="add-btn" (click)="addToOrder(item)">+</button>
                 </div>
              </div>
           </div>
        </div>
        
        </div>
        <!-- END DASHBOARD VIEW -->

        <!-- MENU MANAGEMENT VIEW -->
        <div *ngIf="currentView === 'menu-management'" class="menu-management-container">
            
            <div class="mm-layout">
                <!-- Left: Tables List -->
                <div class="mm-tables-col">
                    <div class="section-headers">
                        <h3>Tables</h3>
                        <span class="badge">{{ tables.length }}</span>
                    </div>
                    <div class="mm-tables-grid">
                        <div class="table-card-realistic" *ngFor="let table of tables"
                             [ngClass]="getStatusClass(table.status)"
                             (click)="selectTable(table)">
                             
                             <div class="table-surface">
                                <span class="ts-name">{{ table.id }}</span>
                             </div>

                             <!-- Chairs (Dynamic based on seats) -->
                             <div class="chair top"></div>
                             <div class="chair bottom"></div>
                             <div class="chair left" *ngIf="table.seats >= 4"></div>
                             <div class="chair right" *ngIf="table.seats >= 4"></div>
                             <div class="chair top-left" *ngIf="table.seats >= 6"></div>
                             <div class="chair bottom-right" *ngIf="table.seats >= 6"></div>
                             
                             <div class="table-status-dot" [ngClass]="getStatusClass(table.status)"></div>
                        </div>
                    </div>
                </div>

                <!-- Right: Global Menu -->
                <div class="mm-menu-col">
                    <div class="section-headers">
                        <h3>Global Food Menu</h3>
                    </div>

                    <!-- Categories -->
                    <div class="categories-row compact">
                        <div class="cat-item" *ngFor="let cat of categories" 
                             [class.active]="selectedCategory === cat.name" 
                             (click)="setCategory(cat.name)">
                          <div class="cat-img small">
                             <img [src]="cat.image">
                          </div>
                          <span>{{ cat.name }}</span>
                        </div>
                    </div>

                    <!-- Menu Grid -->
                    <div class="menu-list-compact">
                       <div class="menu-list-item" *ngFor="let item of filteredMenuItems">
                           <div class="ml-img">
                               <img [src]="item.image" alt="{{item.name}}">
                           </div>
                           <div class="ml-info">
                               <h4>{{ item.name }}</h4>
                           </div>
                           <div class="ml-price">₹{{ item.price }}</div>
                           <button class="ml-add-btn" (click)="addToOrder(item)">+</button>
                       </div>
                       <div *ngIf="filteredMenuItems.length === 0" class="empty-menu-state">
                           <p>No items found in this category.</p>
                       </div>
                    </div>
                </div>
            </div>

        </div> 
        <!-- END MENU MANAGEMENT VIEW -->

      </main>

    </div>
  `,
  styles: [`
     /* Layout Variables */
    :host {
      --primary-orange: #ff5722;
      --bg-light: #f5f6fa;
      --sidebar-width: 260px;
      --right-panel-width: 380px;
      --text-dark: #333;
      --text-grey: #888;
      display: block;
      height: 100vh;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg-light);
      color: var(--text-dark);
    }

    /* Scrollbar Styling */
    *::-webkit-scrollbar { width: 6px; height: 6px; }
    *::-webkit-scrollbar-track { background: transparent; }
    *::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
    *::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }

    .dashboard-container {
      display: flex;
      height: 100%;
      width: 100%;
    }

    /* Sidebar */
    .sidebar {
      width: var(--sidebar-width);
      min-width: var(--sidebar-width);
      background: white;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #f0f0f0;
    }
    .logo {
       display: flex; align-items: center; gap: 10px; margin-bottom: 40px; color: var(--primary-orange);
    }
    .logo h2 { font-size: 1.4rem; margin: 0; font-weight: 800; color: #333; letter-spacing: -0.5px; }
    .logo-icon { font-size: 2rem; width: 2rem; height: 2rem; }

    .side-nav { display: flex; flex-direction: column; gap: 8px; flex: 1; overflow-y: auto; }
    .nav-item {
       display: flex; align-items: center; gap: 15px; padding: 12px 15px;
       color: #666; text-decoration: none; border-radius: 12px; cursor: pointer;
       font-weight: 500; transition: 0.2s; font-size: 0.9rem;
    }
    .nav-item:hover, .nav-item.active { background: #fff0e9; color: var(--primary-orange); }
    /* Ensure Icon Alignment */
    .nav-item mat-icon { 
        font-size: 1.3rem; width: 24px; text-align: center; display: flex; align-items: center; justify-content: center;
    }

    .upgrade-card {
       background: linear-gradient(135deg, #ff9f43, #ff5722);
       color: white; padding: 20px; border-radius: 20px; text-align: center;
       position: relative; margin-top: 20px;
    }
    .upgrade-card mat-icon { font-size: 3rem; width: 3rem; height: 3rem; opacity: 0.2; position: absolute; top: 10px; right: 10px; }
    .upgrade-text h4 { margin: 0 0 5px 0; font-size: 0.95rem; }
    .upgrade-text p { font-size: 0.75rem; opacity: 0.9; margin-bottom: 15px; line-height: 1.4; }
    .btn-upgrade { 
        background: white; color: var(--primary-orange); border: none; 
        padding: 8px 20px; border-radius: 20px; font-weight: 600; cursor: pointer; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    /* Main Content */
    .main-content {
       flex: 1;
       padding: 30px 40px;
       overflow-y: auto;
       background: #fcfcfc;
    }

    /* Header */
    .top-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .top-header h1 { font-size: 1.8rem; font-weight: 700; color: #2d3436; margin: 0; }
    
    .header-actions { display: flex; gap: 20px; align-items: center; }
    .search-bar {
       background: white; border-radius: 30px; padding: 10px 20px; display: flex; align-items: center;
       border: 1px solid #eee; width: 300px; box-shadow: 0 2px 10px rgba(0,0,0,0.02);
    }
    .search-bar mat-icon { color: #999; margin-right: 10px; }
    .search-bar input { border: none; outline: none; width: 100%; font-size: 0.9rem; }
    
    .icon-btn { 
        background: white; border: 1px solid #eee; border-radius: 50%; width: 45px; height: 45px; 
        cursor: pointer; display: flex; align-items: center; justify-content: center; color: #666;
        transition: 0.2s;
    }
    .icon-btn:hover { background: #f5f5f5; color: var(--primary-orange); }
    
    .user-profile { display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 0.95rem; cursor: pointer; }
    .user-profile img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

    /* Filters */
    .order-filters { margin-bottom: 30px; }
    .order-filters h3 { margin: 0 0 15px 0; font-size: 1.1rem; font-weight: 600; }
    .filter-chips { display: flex; gap: 12px; flex-wrap: wrap; }
    .chip {
       background: white; padding: 8px 18px; border-radius: 25px; font-size: 0.9rem;
       font-weight: 600; cursor: pointer; border: 1px solid #eee; display: flex; align-items: center; gap: 8px;
       transition: 0.2s; color: #666;
    }
    .chip:hover { border-color: #ddd; background: #f9f9f9; }
    .chip.active { background: #2d3436; color: white; border-color: #2d3436; }
    .chip .badge {
       background: #eee; color: #333; width: 22px; height: 22px; border-radius: 50%;
       display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;
    }
    .chip.active .badge { background: #555; color: white; }
    .badge.orange { background: #ffe0d5; color: var(--primary-orange); }
    .badge.green { background: #e0f2f1; color: #009688; }
    .badge.blue { background: #e3f2fd; color: #2196f3; }
    .badge.red { background: #ffebee; color: #f44336; }

    /* Active Orders Grid */
    .active-orders-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); 
        gap: 25px; 
        margin-bottom: 40px; 
    }
    .order-card { 
        background: white; border-radius: 24px; padding: 25px; text-align: center; 
        border: 1px solid #eee; transition: all 0.3s ease;
        display: flex; flex-direction: column; align-items: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.02);
    }
    .order-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.08); border-color: transparent; }
    
    .card-header { width: 100%; display: flex; justify-content: space-between; font-size: 0.8rem; color: #888; margin-bottom: 20px; font-weight: 500; }
    .table-no { font-weight: 700; color: #2d3436; }
    
    .food-img-circle { width: 120px; height: 120px; margin: 0 auto 20px; position: relative; }
    .food-img-circle img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; box-shadow: 0 10px 25px rgba(0,0,0,0.15); transition: 0.3s; }
    .order-card:hover .food-img-circle img { transform: scale(1.05); }
    
    .order-card h4 { margin: 0 0 15px 0; font-size: 1.1rem; font-weight: 700; color: #2d3436; }
    
    .status-badge { padding: 8px 20px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .status-badge.dine-in { background: #ffe0d5; color: var(--primary-orange); }
    .status-badge.served { background: #e0f2f1; color: #009688; }
    .status-badge.wait-list { background: #e3f2fd; color: #2196f3; }
    .status-badge.take-away { background: #ffebee; color: #f44336; }

    /* Categories */
    .section-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
    .section-title h3 { margin: 0; font-size: 1.2rem; }
    
    .nav-arrows { display: flex; gap: 10px; }
    .arrow-btn { 
        width: 32px; height: 32px; border-radius: 50%; border: none; background: white; 
        cursor: pointer; display: flex; align-items: center; justify-content: center; 
        box-shadow: 0 2px 5px rgba(0,0,0,0.05); color: #ccc; transition: 0.2s;
    }
    .arrow-btn:hover { background: var(--primary-orange); color: white; }
    
    .categories-row { display: flex; gap: 25px; overflow-x: auto; padding: 5px 5px 20px 5px; margin-bottom: 20px; }
    .cat-item { display: flex; flex-direction: column; align-items: center; gap: 12px; min-width: 90px; cursor: pointer; opacity: 0.7; transition: 0.2s; }
    .cat-item:hover, .cat-item.active { opacity: 1; transform: translateY(-2px); }
    .cat-img { width: 70px; height: 70px; border-radius: 50%; overflow: hidden; border: 2px solid transparent; transition: 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .cat-item:hover .cat-img { border-color: var(--primary-orange); }
    .cat-img img { width: 100%; height: 100%; object-fit: cover; }
    .cat-item span { font-size: 0.85rem; font-weight: 600; color: #2d3436; }

    /* Trending */
    .trending-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 25px; margin-bottom: 50px; }
    .trend-card { 
        background: white; padding: 15px; border-radius: 20px; border: 1px solid #1fa02cb0; 
        display: flex; align-items: center; gap: 15px; border: 1px solid transparent;
        box-shadow: 0 2px 10px rgba(0,0,0,0.03); transition: 0.2s;
    }
    .trend-card:hover { border-color: var(--primary-orange); box-shadow: 0 5px 15px rgba(255, 87, 34, 0.1); }
    .trend-info { flex: 1; }
    .week-tag { font-size: 0.65rem; color: #999; display: block; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
    .trend-info h4 { margin: 0 0 10px 0; font-size: 1rem; font-weight: 700; }
    .price-add { display: flex; align-items: center; justify-content: space-between; }
    .price-add .price { font-weight: 800; color: #2d3436; font-size: 1.1rem; }
    .add-btn { 
        width: 28px; height: 28px; border-radius: 50%; background: #ffe0d5; 
        color: var(--primary-orange); border: none; font-weight: bold; cursor: pointer;
        display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
        padding-bottom: 2px;
    }

    /* Status Metrics */
    .status-metrics { display: flex; gap: 20px; margin-bottom: 40px; }
    .metric-card { 
      flex: 1; background: white; padding: 20px; border-radius: 16px; 
      display: flex; align-items: center; gap: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.02);
      border: 1px solid #f0f0f0; transition: 0.2s;
    }
    .metric-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.05); }
    .metric-icon { 
      width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; 
      font-size: 1.5rem;
    }
    .metric-icon.total { background: #e3f2fd; color: #2196f3; }
    .metric-icon.occupied { background: #ffe0d5; color: #ff5722; }
    .metric-icon.reserved { background: #fff3e0; color: #ff9800; }
    .metric-icon.available { background: #e0f2f1; color: #009688; }
    .metric-info { display: flex; flex-direction: column; }
    .metric-info .label { font-size: 0.85rem; color: #888; margin-bottom: 5px; }
    .metric-info .value { font-size: 1.4rem; font-weight: 700; color: #2d3436; }

    /* Table Grid */
    .table-grid { 
        display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; 
    }
    .table-item { 
       background: white; border-radius: 16px; padding: 20px; cursor: pointer;
       border: 2px solid transparent; box-shadow: 0 4px 10px rgba(0,0,0,0.02);
       transition: 0.2s;
    }
    .table-item:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
    
    .table-item.occupied { border-color: #ffccbc; background: #fffbfb; }
    .table-item.occupied .status-icon { color: #ff5722; }
    .table-item.occupied .status-text { color: #ff5722; }

    .table-item.available { border-color: #b2dfdb; background: #f0fcfb; }
    .table-item.available .status-icon { color: #009688; }
    .table-item.available .status-text { color: #009688; }

    .table-item.reserved { border-color: #ffe0b2; background: #fff8f0; }
    .table-item.reserved .status-icon { color: #ff9800; }
    .table-item.reserved .status-text { color: #ff9800; }

    .table-header { display: flex; justify-content: space-between; margin-bottom: 15px; font-weight: 700; color: #333; }
    .seats { display: flex; align-items: center; gap: 5px; font-size: 0.8rem; color: #888; font-weight: 500; }
    .seats mat-icon { font-size: 1rem; width: 1rem; height: 1rem; }

    .table-body { display: flex; flex-direction: column; align-items: center; gap: 5px; }
    .status-icon { font-size: 2.5rem; width: 2.5rem; height: 2.5rem; margin-bottom: 5px; }
    .status-text { font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .time-elapsed { font-size: 0.8rem; color: #888; margin-top: 5px; font-weight: 500; }

    /* Order Details Panel */
    .order-panel-overlay {
       position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 99;
       animation: fadeIn 0.2s ease-out;
    }
    .order-details-panel {
       position: fixed; top: 0; right: -400px; width: 380px; height: 100vh;
       background: white; z-index: 100; padding: 0; box-shadow: -5px 0 30px rgba(0,0,0,0.1);
       transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
       display: flex; flex-direction: column;
    }
    .order-details-panel.open { right: 0; }
    
    .panel-header { padding: 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; }
    .panel-header h2 { margin: 0; font-size: 1.3rem; }
    
    .panel-body { padding: 25px; flex: 1; overflow-y: auto; }
    .order-status-banner {
       padding: 10px; border-radius: 8px; text-align: center; font-weight: 700; text-transform: uppercase;
       font-size: 0.85rem; margin-bottom: 25px; letter-spacing: 0.5px;
    }
    .order-status-banner.occupied { background: #ffe0d5; color: #ff5722; }
    .order-status-banner.available { background: #e0f2f1; color: #009688; }
    .order-status-banner.reserved { background: #fff3e0; color: #ff9800; }

    .order-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f9f9f9; }
    .item-details h4 { margin: 0 0 5px 0; font-size: 1rem; color: #333; }
    .item-details .qty { color: #888; font-size: 0.85rem; font-weight: 600; }
    .item-details .eta { color: #ff9800; font-size: 0.75rem; font-weight: 500; font-style: italic; }
    .item-status { font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: capitalize; }
    .item-status.preparing { background: #fff3e0; color: #ff9800; }
    .item-status.ready { background: #e0f2f1; color: #009688; }
    .item-status.served { background: #f0f0f0; color: #888; }

    .empty-state { text-align: center; margin-top: 50px; color: #ccc; }
    .empty-state mat-icon { font-size: 4rem; width: 4rem; height: 4rem; margin-bottom: 10px; opacity: 0.5; }
    .empty-state p { font-size: 0.95rem; }

    .panel-footer { padding: 25px; border-top: 1px solid #eee; background: #fafafa; }
    .action-buttons { display: flex; gap: 15px; }
    .btn-action { flex: 1; padding: 12px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; transition: 0.2s; }
    .btn-action.primary { background: var(--primary-orange); color: white; }
    .btn-action.secondary { background: white; border: 1px solid #ddd; color: #555; }
    .btn-action:hover { opacity: 0.9; transform: translateY(-1px); }

    /* Menu Management Specific Styles */
    .menu-management-container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .mm-layout {
        display: flex;
        gap: 30px;
        height: calc(100vh - 140px); /* Adjust based on header */
    }
    
    /* Tables Column */
    .mm-tables-col {
        width: 340px;
        min-width: 340px;
        background: white;
        border-radius: 20px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        border: 1px solid #eee;
        box-shadow: 0 4px 15px rgba(0,0,0,0.02);
    }
    .mm-tables-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 25px;
        padding: 10px;
        overflow-y: auto;
    }
    
    .table-card-realistic {
        position: relative;
        width: 100px;
        height: 100px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: 0.2s;
    }
    .table-card-realistic:hover { transform: scale(1.05); }

    .table-surface {
        width: 80px;
        height: 80px;
        background: white;
        border: 2px solid #ddd;
        border-radius: 12px;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        font-weight: 800;
        font-size: 1.2rem;
        color: #333;
    }
    .table-card-realistic.occupied .table-surface { border-color: #ff5722; background: #fff5f2; color: #ff5722; }
    .table-card-realistic.available .table-surface { border-color: #009688; background: #f0fcfb; color: #009688; }
    .table-card-realistic.reserved .table-surface { border-color: #ff9800; background: #fff8f0; color: #ff9800; }

    .chair {
        position: absolute;
        width: 30px;
        height: 10px;
        background: #ddd;
        border-radius: 4px;
        z-index: 1;
    }
    .table-card-realistic.occupied .chair { background: #ffccbc; }
    .table-card-realistic.available .chair { background: #b2dfdb; }
    .table-card-realistic.reserved .chair { background: #ffe0b2; }

    .chair.top { top: -2px; left: 50%; transform: translateX(-50%); }
    .chair.bottom { bottom: -2px; left: 50%; transform: translateX(-50%); }
    .chair.left { left: 0px; top: 50%; width: 10px; height: 30px; transform: translateY(-50%) translateX(-12px); }
    .chair.right { right: 0px; top: 50%; width: 10px; height: 30px; transform: translateY(-50%) translateX(12px); }
    
    .chair.top-left { top: 0; left: 0; width: 10px; height: 30px; transform: rotate(45deg) translate(-5px, -5px); }
    .chair.bottom-right { bottom: 0; right: 0; width: 10px; height: 30px; transform: rotate(45deg) translate(5px, 5px); }

    .table-status-dot {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        z-index: 3;
    }
    .table-status-dot.occupied { background: #ff5722; }
    .table-status-dot.available { background: #009688; }
    .table-status-dot.reserved { background: #ff9800; }

    /* Menu Column */
    .mm-menu-col {
        flex: 1;
        background: white;
        border-radius: 20px;
        padding: 25px;
        display: flex;
        flex-direction: column;
        border: 1px solid #eee;
        box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        overflow: hidden; /* Important for inner scroll */
    }
    
    .section-headers { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-shrink: 0; }
    .section-headers h3 { margin: 0; font-size: 1.1rem; font-weight: 700; color: #2d3436; }
    
    .categories-row.compact { padding-bottom: 10px; margin-bottom: 20px; flex-shrink: 0; }
    .cat-img.small { width: 50px; height: 50px; }
    
    .menu-list-compact {
        display: flex;
        flex-direction: column;
        gap: 15px;
        overflow-y: auto;
        padding: 5px;
        padding-bottom: 20px;
        flex: 1;
        width: 100%;
    }
    
    .menu-list-item {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 15px 20px;
        background: white;
        border-radius: 16px;
        border: 1px solid #e0e0e0;
        transition: all 0.2s ease;
        min-height: 85px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }
    .menu-list-item:hover {
        border-color: var(--primary-orange);
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        transform: translateY(-2px);
    }
    
    .ml-img {
        width: 70px;
        height: 70px;
        border-radius: 12px;
        overflow: hidden;
        flex-shrink: 0;
        background: #f0f0f0;
        border: 1px solid #eee;
    }
    .ml-img img { width: 100%; height: 100%; object-fit: cover; }
    
    .ml-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .ml-info h4 { 
        margin: 0 0 5px 0; 
        font-size: 1.1rem; 
        color: #2d3436 !important; 
        font-weight: 800; 
        line-height: 1.3;
    }
    
    .ml-price { 
        font-weight: 800; 
        font-size: 1.1rem; 
        color: #2d3436 !important; 
        margin-right: 25px; 
    }
    
    .ml-add-btn {
        width: 36px; height: 36px; border-radius: 10px; background: #ffe0d5; 
        color: var(--primary-orange); border: none; font-weight: 800; cursor: pointer;
        display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
        transition: 0.2s;
        flex-shrink: 0;
    }
    .ml-add-btn:hover { background: var(--primary-orange); color: white; }

  `]
})
export class ManagerDashboardComponent implements OnInit {
  auth = inject(AuthService);
  user: any;
  currentView: 'dashboard' | 'menu-management' = 'dashboard';
  selectedFilter = 'All';
  selectedCategory = 'All';

  ngOnInit() {
    this.user = this.auth.getUser();
  }

  // Categories
  categories = [
    { name: 'All', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100' },
    { name: 'Starters', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=100' },
    { name: 'Soups & Salads', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100' },
    { name: 'Main Course', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=100' },
    { name: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100' },
    { name: 'Breads & Rotis', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=100' },
    { name: 'Snacks', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=100' },
    { name: 'Desserts', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=100' },
    { name: 'Beverages', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=100' }
  ];

  // 50+ Food Items with Corrected, Relevant Images
  menuItems: FoodItem[] = [
    // Starters
    { id: 1, name: 'Paneer Tikka', category: 'Starters', price: 280, image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100', isPopular: true },
    { id: 2, name: 'Chicken 65', category: 'Starters', price: 320, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=100' },
    { id: 3, name: 'Gobi Manchurian', category: 'Starters', price: 220, image: 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=100' },
    { id: 4, name: 'Veg Spring Roll', category: 'Starters', price: 180, image: 'https://images.unsplash.com/photo-1544681280-d210d7754142?w=100' },
    { id: 5, name: 'Fried Calamari', category: 'Starters', price: 350, image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=100' },
    { id: 6, name: 'Chicken Tikka', category: 'Starters', price: 320, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=100' },
    { id: 7, name: 'Hara Bhara Kebab', category: 'Starters', price: 240, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100' },
    { id: 8, name: 'Fish Fingers', category: 'Starters', price: 300, image: 'https://images.unsplash.com/photo-1535924298132-0544558e807e?w=100' },

    // Soups & Salads
    { id: 9, name: 'Caesar Salad', category: 'Soups & Salads', price: 250, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=100', isPopular: true },
    { id: 10, name: 'Tomato Soup', category: 'Soups & Salads', price: 120, image: 'https://images.unsplash.com/photo-1547592166-23acbe32263b?w=100' },
    { id: 11, name: 'Sweet Corn Soup', category: 'Soups & Salads', price: 130, image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=100' },
    { id: 12, name: 'Greek Salad', category: 'Soups & Salads', price: 280, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100' },
    { id: 13, name: 'Manchow Soup', category: 'Soups & Salads', price: 140, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=100' },

    // Main Course
    { id: 14, name: 'Paneer Butter Masala', category: 'Main Course', price: 290, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=100', isPopular: true },
    { id: 15, name: 'Butter Chicken', category: 'Main Course', price: 350, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=100' },
    { id: 16, name: 'Kadai Paneer', category: 'Main Course', price: 280, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=100' },
    { id: 17, name: 'Dal Makhani', category: 'Main Course', price: 240, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=100' },
    { id: 18, name: 'Chicken Curry', category: 'Main Course', price: 320, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=100' },
    { id: 19, name: 'Mutton Rogan Josh', category: 'Main Course', price: 450, image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?w=100' },
    { id: 20, name: 'Malai Kofta', category: 'Main Course', price: 300, image: 'https://images.unsplash.com/photo-1567188040754-0170929a005a?w=100' },
    { id: 21, name: 'Veg Kolhapuri', category: 'Main Course', price: 260, image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee397?w=100' },

    // Rice & Biryani
    { id: 22, name: 'Chicken Biryani', category: 'Rice & Biryani', price: 380, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100', isPopular: true },
    { id: 23, name: 'Veg Dum Biryani', category: 'Rice & Biryani', price: 260, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=100' },
    { id: 24, name: 'Jeera Rice', category: 'Rice & Biryani', price: 160, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=100' },
    { id: 25, name: 'Mutton Biryani', category: 'Rice & Biryani', price: 450, image: 'https://images.unsplash.com/photo-1633945274381-3331b98a31f7?w=100' },
    { id: 26, name: 'Steamed Rice', category: 'Rice & Biryani', price: 120, image: 'https://images.unsplash.com/photo-1536304993881-ff002453bef1?w=100' },
    { id: 27, name: 'Curd Rice', category: 'Rice & Biryani', price: 150, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=100' },
    { id: 28, name: 'Egg Biryani', category: 'Rice & Biryani', price: 300, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100' },

    // Breads & Rotis
    { id: 29, name: 'Butter Naan', category: 'Breads & Rotis', price: 50, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=100', isPopular: true },
    { id: 30, name: 'Garlic Naan', category: 'Breads & Rotis', price: 60, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=100' },
    { id: 31, name: 'Tandoori Roti', category: 'Breads & Rotis', price: 30, image: 'https://images.unsplash.com/photo-1506802913710-40e2e66339c9?w=100' },
    { id: 32, name: 'Paratha', category: 'Breads & Rotis', price: 40, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=100' },
    { id: 33, name: 'Aloo Paratha', category: 'Breads & Rotis', price: 80, image: 'https://images.unsplash.com/photo-1604908555239-b9d9fb15eb4a?w=100' },
    { id: 34, name: 'Roomali Roti', category: 'Breads & Rotis', price: 50, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=100' },

    // Snacks
    { id: 35, name: 'Samosa Chat', category: 'Snacks', price: 90, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=100' },
    { id: 36, name: 'Pav Bhaji', category: 'Snacks', price: 140, image: 'https://images.unsplash.com/photo-1606491956091-7db13088b482?w=100' },
    { id: 37, name: 'Grilled Sandwich', category: 'Snacks', price: 120, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=100' },
    { id: 38, name: 'Veg Burger', category: 'Snacks', price: 150, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100' },
    { id: 39, name: 'French Fries', category: 'Snacks', price: 110, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e06497?w=100' },
    { id: 40, name: 'Masala Dosa', category: 'Snacks', price: 120, image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=100' },

    // Desserts
    { id: 41, name: 'Gulab Jamun', category: 'Desserts', price: 90, image: 'https://images.unsplash.com/photo-1517244683333-60f482d8c971?w=100', isPopular: true },
    { id: 42, name: 'Rasmalai', category: 'Desserts', price: 120, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=100' },
    { id: 43, name: 'Chocolate Brownie', category: 'Desserts', price: 180, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100' },
    { id: 44, name: 'Ice Cream', category: 'Desserts', price: 100, image: 'https://images.unsplash.com/photo-1497034825401-4ffa3cbe97e7?w=100' },
    { id: 45, name: 'Fruit Salad', category: 'Desserts', price: 140, image: 'https://images.unsplash.com/photo-1519996529931-28324d1a2924?w=100' },

    // Beverages
    { id: 46, name: 'Cold Coffee', category: 'Beverages', price: 140, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=100' },
    { id: 47, name: 'Masala Chai', category: 'Beverages', price: 40, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=100' },
    { id: 48, name: 'Fresh Lime Soda', category: 'Beverages', price: 80, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=100' },
    { id: 49, name: 'Lassi', category: 'Beverages', price: 90, image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=100' },
    { id: 50, name: 'Mango Smoothie', category: 'Beverages', price: 150, image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=100' },
    { id: 51, name: 'Virgin Mojito', category: 'Beverages', price: 160, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=100' }
  ];

  // Table Data
  tables: any[] = [
    {
      id: 1, name: 'Table 01', status: 'Occupied', seats: 4, time: '12 min',
      orders: [
        { name: 'Chicken Biryani', qty: 2, status: 'Preparing', eta: '15 min' },
        { name: 'Coke', qty: 2, status: 'Served', eta: '0 min' }
      ]
    },
    { id: 2, name: 'Table 02', status: 'Available', seats: 2, orders: [], time: '-' },
    { id: 3, name: 'Table 03', status: 'Reserved', seats: 6, orders: [], time: '19:00' },
    {
      id: 4, name: 'Table 04', status: 'Occupied', seats: 4, time: '25 min',
      orders: [
        { name: 'Masala Dosa', qty: 3, status: 'Ready', eta: '2 min' }
      ]
    },
    { id: 5, name: 'Table 05', status: 'Available', seats: 2, orders: [], time: '-' },
    {
      id: 6, name: 'Table 06', status: 'Occupied', seats: 8, time: '5 min',
      orders: [
        { name: 'User Choice Pizza', qty: 1, status: 'Preparing', eta: '20 min' },
        { name: 'French Fries', qty: 2, status: 'Served', eta: '0 min' }
      ]
    },
    { id: 7, name: 'Table 07', status: 'Reserved', seats: 4, orders: [], time: '20:00' },
    { id: 8, name: 'Table 08', status: 'Available', seats: 2, orders: [], time: '-' },
    {
      id: 9, name: 'Table 09', status: 'Occupied', seats: 4, time: '40 min',
      orders: [
        { name: 'Club Sandwich', qty: 2, status: 'Served', eta: '0 min' }
      ]
    },
    { id: 10, name: 'Table 10', status: 'Available', seats: 6, orders: [], time: '-' },
    { id: 11, name: 'Table 11', status: 'Available', seats: 4, orders: [], time: '-' },
    {
      id: 12, name: 'Table 12', status: 'Occupied', seats: 2, time: '10 min',
      orders: [
        { name: 'Cold Coffee', qty: 2, status: 'Served', eta: '0 min' }
      ]
    }
  ];

  selectedTable: any = null;

  get filteredOrders() {
    return [];
  }

  get filteredMenuItems() {
    if (this.selectedCategory === 'All') return this.menuItems;
    return this.menuItems.filter(item => item.category === this.selectedCategory);
  }

  // Count Metrics
  get totalTables() { return this.tables.length; }
  get occupiedTables() { return this.tables.filter(t => t.status === 'Occupied').length; }
  get reservedTables() { return this.tables.filter(t => t.status === 'Reserved').length; }
  get availableTables() { return this.tables.filter(t => t.status === 'Available').length; }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  setCategory(cat: string) {
    this.selectedCategory = cat;
  }

  getCount(filter: string) {
    if (filter === 'All') return this.tables.length;
    return this.tables.filter(t => t.status.toLowerCase() === filter.toLowerCase()).length;
  }

  getStatusClass(status: string) {
    return status ? status.toLowerCase().replace(' ', '-') : '';
  }

  selectTable(table: any) {
    this.selectedTable = table;
  }

  setView(view: 'dashboard' | 'menu-management') {
    this.currentView = view;
  }

  getTitle() {
    return this.currentView === 'dashboard' ? 'Dashboard' : 'Menu Management';
  }

  closeDetails() {
    this.selectedTable = null;
  }

  addToOrder(item: any) {
    if (!this.selectedTable) {
      alert('Please select a table orders to add items.');
      return;
    }

    // Check if table has orders array
    if (!this.selectedTable.orders) {
      this.selectedTable.orders = [];
    }

    const existingOrder = this.selectedTable.orders.find((o: any) => o.name === item.name);
    if (existingOrder) {
      existingOrder.qty++;
    } else {
      this.selectedTable.orders.push({
        name: item.name,
        qty: 1,
        status: 'Preparing',
        eta: '10 min'
      });
    }
  }
}
