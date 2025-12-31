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

interface Offer {
    id: number;
    title: string;
    description: string;
    type: string;
    value: string;
    code: string;
    color: string;
    icon: string;
}

interface Staff {
    id: string;
    name: string;
    role: string;
    phone: string;
    email: string;
    shift: string;
    status: 'Active' | 'On Leave' | 'Absent';
    salary: number;
    rating: number;
    feedback: string;
    attendanceStr?: string; // For display
}


@Component({
    selector: 'app-manager-dashboard',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    template: `
    <div class="dashboard-container">
    <!--Sidebar -->
        <aside class="sidebar">
            <div class="logo">
                <mat-icon class="logo-icon"> restaurant_menu </mat-icon>
                    <h2> WorldPlate </h2>
                    </div>

                    <nav class="side-nav">
                        <a class="nav-item" [class.active] = "currentView === 'dashboard'" (click) = "setView('dashboard')">
                            <mat-icon> dashboard </mat-icon> Dashboard
                            </a>
                            <a class="nav-item" [class.active] = "currentView === 'menu-management'" (click) = "setView('menu-management')">
                                <mat-icon> restaurant </mat-icon> Menu Management
                                </a>
                                <a class="nav-item" [class.active] = "currentView === 'table-reservations'" (click) = "setView('table-reservations')">
                                    <mat-icon> table_restaurant </mat-icon> Table Reservations
                                    </a>
                                    <a class="nav-item" [class.active] = "currentView === 'offers'" (click) = "setView('offers')">
                                        <mat-icon> local_offer </mat-icon> Offers & Discounts
                                        </a>
                                        <a class="nav-item" [class.active] = "currentView === 'earnings'" (click) = "setView('earnings')">
                                            <mat-icon> payments </mat-icon> Earnings / Payouts
                                                </a>
                                                <a class="nav-item" [class.active] = "currentView === 'staff'" (click) = "setView('staff')">
                                                    <mat-icon> people </mat-icon> Staff Management
                                                    </a>
                                                    </nav>


                                                                        </aside>

                                                                        <!--Main Content-->
                                                                            <main class="main-content">
                                                                                <!--Header -->
                                                                                    <header class="top-header">
                                                                                        <h1>{{ getTitle() }}</h1>
                                                                                            <div class="header-actions">
                                                                                                <div class="search-bar">
                                                                                                    <mat-icon> search </mat-icon>
                                                                                                    <input type = "text" placeholder = "Search here...">
                                                                                                        </div>
                                                                                                        <button class="icon-btn"> <mat-icon> notifications </mat-icon></button>
                                                                                                            <div class="user-profile" (click) = "showProfileMenu = !showProfileMenu" style = "cursor: pointer; position: relative;">
                                                                                                                <img src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg" alt = "User" class="avatar-3d">
                                                                                                                    <span>{{ user?.name || 'Manager' }}</span>
                                                                                                                        <mat-icon> arrow_drop_down </mat-icon>

                                                                                                                        <div class="profile-menu" *ngIf="showProfileMenu" (click) = "$event.stopPropagation()">
                                                                                                                            <button class="menu-item" (click) = "logout()">
                                                                                                                                <mat-icon> logout </mat-icon> Logout
                                                                                                                                </button>
                                                                                                                                </div>
                                                                                                                                </div>
                                                                                                                                </div>
                                                                                                                                </header>

                                                                                                                                <!--DASHBOARD VIEW-->
                                                                                                                                    <div *ngIf="currentView === 'dashboard'">
                                                                                                                                        <!--Table Status Overview-->
                                                                                                                                            <div class="status-metrics">
                                                                                                                                                <div class="metric-card">
                                                                                                                                                    <div class="metric-icon total"> <mat-icon> restaurant </mat-icon></div>
                                                                                                                                                        <div class="metric-info">
                                                                                                                                                            <span class="label"> Total Tables </span>
                                                                                                                                                                <span class="value"> {{ totalTables }}</span>
                                                                                                                                                                    </div>
                                                                                                                                                                    </div>
                                                                                                                                                                    <div class="metric-card">
                                                                                                                                                                        <div class="metric-icon occupied"> <mat-icon> people </mat-icon></div>
                                                                                                                                                                            <div class="metric-info">
                                                                                                                                                                                <span class="label"> Occupied </span>
                                                                                                                                                                                    <span class="value"> {{ occupiedTables }}</span>
                                                                                                                                                                                        </div>
                                                                                                                                                                                        </div>
                                                                                                                                                                                        <div class="metric-card">
                                                                                                                                                                                            <div class="metric-icon reserved"> <mat-icon> event </mat-icon></div>
                                                                                                                                                                                                <div class="metric-info">
                                                                                                                                                                                                    <span class="label"> Reserved </span>
                                                                                                                                                                                                        <span class="value"> {{ reservedTables }}</span>
                                                                                                                                                                                                            </div>
                                                                                                                                                                                                            </div>
                                                                                                                                                                                                            <div class="metric-card">
                                                                                                                                                                                                                <div class="metric-icon available"> <mat-icon> check_circle </mat-icon></div>
                                                                                                                                                                                                                    <div class="metric-info">
                                                                                                                                                                                                                        <span class="label"> Available </span>
                                                                                                                                                                                                                            <span class="value"> {{ availableTables }}</span>
                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                <!--Live Table Management-->
                                                                                                                                                                                                                                    <div class="section-title">
                                                                                                                                                                                                                                        <h3>Live Floor Status </h3>
                                                                                                                                                                                                                                            </div>

                                                                                                                                                                                                                                            <div class="table-grid">
                                                                                                                                                                                                                                                <div class="table-item" *ngFor="let table of tables"
                                                                                                                                                                                                                                                [ngClass] = "getStatusClass(table.status)"
                                                                                                                                                                                                                                                    (click) = "selectTable(table)">

                                                                                                                                                                                                                                                    <div class="table-header">
                                                                                                                                                                                                                                                        <span class="table-name"> {{ table.name }}</span>
                                                                                                                                                                                                                                                            <span class="seats"> <mat-icon> group </mat-icon> {{ table.seats }}</span>
                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                <div class="table-body">
                                                                                                                                                                                                                                                                    <mat-icon class="status-icon">
                                                                                                                                                                                                                                                                        {{ table.status === 'Occupied' ? 'restaurant_menu' : (table.status === 'Reserved' ? 'timer' : 'check_circle_outline') }}
</mat-icon>
    <span class="status-text"> {{ table.status }}</span>
        <span class="time-elapsed" *ngIf="table.time !== '-'"> {{ table.time }}</span>
            </div>
            </div>
            </div>


            <!--Food Menu Categories-->
                <div class="section-title">
                    <h3>Food Menu </h3>
                        <div class="nav-arrows">
                            <button class="arrow-btn"> <mat-icon> chevron_left </mat-icon></button>
                                <button class="arrow-btn"> <mat-icon> chevron_right </mat-icon></button>
                                    </div>
                                    </div>

                                    <div class="categories-row">
                                        <div class="cat-item" *ngFor="let cat of categories" [class.active] = "selectedCategory === cat.name" (click) = "setCategory(cat.name)">
                                            <div class="cat-img">
                                                <img [src]="cat.image">
                                                    </div>
                                                    <span> {{ cat.name }}</span>
                                                        </div>
                                                        </div>

                                                        <!--Food Menu Grid-->
                                                            <div class="section-title">
                                                                <h3>{{ selectedCategory === 'All' ? 'Menu Items' : selectedCategory }}</h3>
                                                                    <a href = "#" class="view-all"> View All </a>
                                                                        </div>

                                                                        <div class="trending-grid">
                                                                            <div class="trend-card" *ngFor="let item of filteredMenuItems">
                                                                                <div class="trend-img" style = "width: 80px; height: 80px; border-radius: 12px; overflow: hidden;">
                                                                                    <img [src]="item.image" style = "width: 100%; height: 100%; object-fit: cover;">
                                                                                        </div>
                                                                                        <div class="trend-info">
                                                                                            <span class="week-tag"> {{ item.category }}</span>
                                                                                                <h4> {{ item.name }}</h4>
                                                                                                    <div class="price-add">
                                                                                                        <span class="price">₹{{ item.price }} </span>
                                                                                                            <button class="add-btn" (click) = "addToOrder(item)"> +</button>
                                                                                                                </div>
                                                                                                                </div>
                                                                                                                </div>
                                                                                                                </div>

                                                                                                                </div>
                                                                                                                <!--END DASHBOARD VIEW-->

                                                                                                                    <!--MENU MANAGEMENT VIEW-->
                                                                                                                        <!--TABLE RESERVATIONS VIEW-->
                                                                                                                            <!--TABLE RESERVATIONS VIEW-->
                                                                                                                                <div *ngIf="currentView === 'table-reservations'" class="reservation-view-container">
                                                                                                                                    <div class="reservation-floor-plan">
                                                                                                                                        <div class="floor-header">
                                                                                                                                            <div class="fh-left">
                                                                                                                                                <h3>Floor Plan </h3>
                                                                                                                                                    <span class="badge-pill"> {{ tables.length }} Tables </span>
                                                                                                                                                        </div>
                                                                                                                                                        <div class="floor-legend">
                                                                                                                                                            <div class="legend-pill available"> <span class="dot"> </span> Available</div>
                                                                                                                                                                <div class="legend-pill occupied"> <span class="dot"> </span> Occupied</div>
                                                                                                                                                                    <div class="legend-pill reserved"> <span class="dot"> </span> Reserved</div>
                                                                                                                                                                        </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div class="floor-grid-container">
                                                                                                                                                                            <div class="table-card-realistic" *ngFor="let table of tables"
                                                                                                                                                                            [ngClass] = " [getStatusClass(table.status), getSizeClass(table.seats)]"
                                                                                                                                                                                (click) = "selectTable(table)">

                                                                                                                                                                                <div class="table-surface">
                                                                                                                                                                                    <span class="ts-name"> {{ table.id }}</span>
                                                                                                                                                                                        </div>

                                                                                                                                                                                        <!--Chairs Logic-->
                                                                                                                                                                                            <div class="chair top" *ngIf="table.seats>= 1"> </div>
                                                                                                                                                                                                <div class="chair bottom" *ngIf="table.seats>= 2"> </div>

                                                                                                                                                                                                    <div class="chair left" *ngIf="table.seats>= 3 && table.seats <= 4"> </div>
                                                                                                                                                                                                        <div class="chair right" *ngIf="table.seats>= 4 && table.seats <= 4"> </div>

                                                                                                                                                                                                            <div class="chair top-left" *ngIf="table.seats>= 5"> </div>
                                                                                                                                                                                                                <div class="chair top-right" *ngIf="table.seats>= 6"> </div>
                                                                                                                                                                                                                    <div class="chair bottom-left" *ngIf="table.seats>= 5"> </div>
                                                                                                                                                                                                                        <div class="chair bottom-right" *ngIf="table.seats>= 6"> </div>

                                                                                                                                                                                                                            <div class="chair left" *ngIf="table.seats>= 7"> </div>
                                                                                                                                                                                                                                <div class="chair right" *ngIf="table.seats>= 8"> </div>

                                                                                                                                                                                                                                    <div class="chair top-mid" *ngIf="table.seats>= 9"> </div>
                                                                                                                                                                                                                                        <div class="chair bottom-mid" *ngIf="table.seats>= 10"> </div>

                                                                                                                                                                                                                                            <div class="table-status-dot" [ngClass] = "getStatusClass(table.status)"> </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                <!--MENU MANAGEMENT VIEW(Food Only)-->
                                                                                                                                                                                                                                                    <div *ngIf="currentView === 'menu-management'" class="menu-management-container">
                                                                                                                                                                                                                                                        <div class="mm-layout">
                                                                                                                                                                                                                                                            <div class="mm-menu-col full-width-col">
                                                                                                                                                                                                                                                                <div class="section-headers">
                                                                                                                                                                                                                                                                    <h3>Global Food Menu </h3>
                                                                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                                                                        <!--Categories -->
                                                                                                                                                                                                                                                                            <div class="categories-row compact">
                                                                                                                                                                                                                                                                                <div class="cat-item" *ngFor="let cat of categories"
                                                                                                                                                                                                                                                                                [class.active] = "selectedCategory === cat.name"
                                                                                                                                                                                                                                                                                    (click) = "setCategory(cat.name)">
                                                                                                                                                                                                                                                                                    <div class="cat-img small">
                                                                                                                                                                                                                                                                                        <img [src]="cat.image">
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                            <span> {{ cat.name }}</span>
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                                                                <!--Menu Grid-->
<!--Menu Grid-->
<div class="menu-list-compact full-grid-menu">
    <div class="menu-list-item" *ngFor="let item of filteredMenuItems">
        <div class="ml-img">
            <img [src]="item.image" loading="lazy">
            <div class="ml-overlay">
                <button class="ml-quick-add" (click)="addToOrder(item)">
                    <mat-icon>add_shopping_cart</mat-icon>
                    Add Now
                </button>
            </div>
        </div>
        <div class="ml-info-container">
            <div class="ml-info">
                <div class="ml-top-row">
                    <span class="category-tag">{{ item.category }}</span>
                    <mat-icon *ngIf="item.isPopular" class="popular-fire">whatshot</mat-icon>
                </div>
                <h4>{{ item.name }}</h4>
            </div>
            <div class="ml-price-row">
                <div class="ml-price">₹{{ item.price }}</div>
                <button class="ml-add-btn" (click)="addToOrder(item)">
                    <mat-icon>add</mat-icon>
                </button>
            </div>
        </div>
    </div>
    <div *ngIf="filteredMenuItems.length === 0" class="empty-menu-state">
        <p>No items found in this category.</p>
    </div>
</div>
                                                                                                                                                                </div>
                                                                                                                                                                </div>
                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                            <!--END MENU MANAGEMENT VIEW-->

                                                                                                                                                                                                                                                                                                                                                <!--OFFERS VIEW-->
                                                                                                                                                                                                                                                                                                                                                    <!--OFFERS VIEW-->
                                                                                                                                                                                                                                                                                                                                                        <div *ngIf="currentView === 'offers'" class="offers-view-container">
                                                                                                                                                                                                                                                                                                                                                            <div class="view-header">
                                                                                                                                                                                                                                                                                                                                                                <div class="vh-left">
                                                                                                                                                                                                                                                                                                                                                                    <h3>Offers & Discounts </h3>
                                                                                                                                                                                                                                                                                                                                                                    <span class="badge-pill"> {{ offers.length }} Active </span>
                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                        <button class="btn-action primary compact"> <mat-icon> add </mat-icon> Create Offer</button>
                                                                                                                                                                                                                                                                                                                                                                            </div>

                                                                                                                                                                                                                                                                                                                                                                            <div class="offers-grid">
                                                                                                                                                                                                                                                                                                                                                                                <div class="offer-card" *ngFor="let offer of coupons" [ngClass] = "offer.color">
                                                                                                                                                                                                                                                                                                                                                                                    <div class="offer-left" [style.background]="offer.color"><div class="ticket-holes"></div><span class="pct">{{ offer.discount }}</span><small>COUPON</small></div><div class="offer-right"><h3>{{ offer.code }}</h3><p>{{ offer.desc }}</p><button class="btn-copy" (click)="copyCode(offer.code)">Copy Code</button></div>
                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                            </div>

                                                                                                                                                                                                                                                                                                                                                                                                                            <!--EARNINGS VIEW-->
                                                                                                                                                                                                                                                                                                                                                                                                                                <div *ngIf="currentView === 'earnings'" class="earnings-view-container">
                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="earnings-header">
                                                                                                                                                                                                                                                                                                                                                                                                                                        <h3>Financial Overview </h3>
                                                                                                                                                                                                                                                                                                                                                                                                                                            <!--Filter Removed as requested -->
                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                <!--KPI Grid - Creative Redesign-->
                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="kpi-grid creative-layout">
                                                                                                                                                                                                                                                                                                                                                                                                                                                        <!--Card 1: Revenue(Dark Premium)-->
                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="kpi-card creative dark-grad">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="kpi-top">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="icon-box"> <mat-icon> account_balance_wallet </mat-icon></div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <span class="trend-badge positive"> +12% </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="kpi-main">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <span class="kpi-label"> Total Revenue </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <h2 class="kpi-value">₹{{ earningsStats.totalRevenue | number }} </h2>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="kpi-bg-pattern"> </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <!--Card 2: Profit(Green Soft)-->
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="kpi-card creative green-soft">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="kpi-top">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="icon-box"> <mat-icon> savings </mat-icon></div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <span class="trend-badge positive"> +8% </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="kpi-main">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span class="kpi-label"> Net Profit </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <h2 class="kpi-value">₹{{ earningsStats.netProfit | number }} </h2>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="mini-chart-line up"> </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <!--Card 3: AOV(Blue Soft)-->
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="kpi-card creative blue-soft">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="kpi-top">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="icon-box"> <mat-icon> shopping_bag </mat-icon></div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="kpi-main">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span class="kpi-label"> Avg. Order Value </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 <span class="trend-badge neutral"> 0% </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <h2 class="kpi-value">₹{{ earningsStats.aov }} </h2>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="kpi-footer">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <span class="trend-text neutral"> No change vs last month </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <!--Card 4: Pending(Orange Warning)-->
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="kpi-card creative orange-soft">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="kpi-top">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="icon-box"> <mat-icon> pending </mat-icon></div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <mat-icon class="alert-icon"> info </mat-icon>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="kpi-main">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <span class="kpi-label"> Pending Payout </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <h2 class="kpi-value">₹{{ earningsStats.pendingPayout | number }} </h2>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span class="process-date"> Process by 30 Dec </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="charts-row">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <!--Revenue Chart(Simulated)-->
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="chart-card main-chart">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="card-head">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <h4>Revenue Trends </h4>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <button class="icon-btn-small"> <mat-icon> more_horiz </mat-icon></button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="bar-chart-container">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="bar-group" *ngFor="let val of revenueTrend; let i = index">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="bar" [style.height.%] = " (val / 10000) * 100" title = "₹{{val}}"> </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <span class="bar-label"> {{ ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i] }}</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <!--Payment Split-->
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="chart-card payment-split">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="card-head">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <h4>Payment Modes </h4>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="donut-container">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="donut-chart">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="center-text">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <span>Total </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <strong> 100% </strong>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="legend-list">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="legend-item" *ngFor="let item of paymentSplit">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span class="dot" [style.background] = "item.color"> </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <span class="l-name"> {{ item.mode }}</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <span class="l-val"> {{ item.percentage }}% </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="details-row">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <!--Product Performance(User Request)-->
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="details-card products-perf">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="card-head">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <h4>Product Performance </h4>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span class="badge-pill"> Insights </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="perf-section">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <h5 class="section-label up">🔥 Top Selling (Most Ordered) </h5>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="perf-list">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="perf-item" *ngFor="let item of topSellingItems">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="pi-info">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <span class="pi-name"> {{ item.name }}</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <span class="pi-sub"> {{ item.sold }} orders </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span class="pi-rev">₹{{ item.revenue | number }} </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="divider-dash"> </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="perf-section">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <h5 class="section-label down">⚠️ Low Performing (Needs Attention) </h5>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="perf-list">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="perf-item" *ngFor="let item of lowPerformingItems">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="pi-info">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <span class="pi-name"> {{ item.name }}</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span class="pi-sub"> {{ item.sold }} orders </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <span class="pi-rev">₹{{ item.revenue | number }} </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <!--Recent Payouts-->
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="details-card payouts-list">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="card-head">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <h4>Recent Settlements </h4>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <button class="text-btn"> View All </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <table class="simple-table">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <thead>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <tr>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <th>Transaction ID </th>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <th> Date & Time </th>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <th> Amount </th>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <th> Status </th>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </tr>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </thead>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <tbody>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <tr *ngFor="let txn of recentPayouts">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <td class="mono"> {{ txn.id }}</td>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <td class="text-muted"> {{ txn.date }}</td>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <td class="font-bold">₹{{ txn.amount | number }} </td>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <td> <span class="status-pill {{ txn.status.toLowerCase() }}"> {{ txn.status }}</span></td>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </tr>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </tbody>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </table>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <!--STAFF VIEW-->
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <!--STAFF VIEW-->
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div *ngIf="currentView === 'staff'" class="staff-view-container">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <!--Staff Directory Column-->
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="staff-directory-col">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="view-header">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="vh-left">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <h3>Staff Directory </h3>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <span class="badge-pill"> {{ staffList.length }} Staff </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <button class="btn-action primary compact" (click) = "openAddStaffModal()">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <mat-icon> person_add </mat-icon> Add New Staff
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="staff-list">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="staff-card" *ngFor="let staff of staffList">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="staff-header">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="staff-avatar">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span class="initials"> {{ staff.name.charAt(0) }}</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="staff-main-info">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <h4>{{ staff.name }}</h4>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <span class="role-badge" [ngClass] = "staff.role.toLowerCase()"> {{ staff.role }}</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span class="status-dot" [ngClass] = "staff.status.toLowerCase().replace(' ', '-')"> </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="staff-info-grid">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="si-item">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <mat-icon> phone </mat-icon> {{ staff.phone }}
</div>
    <div class="si-item">
        <mat-icon> schedule </mat-icon> {{ staff.shift }}
</div>
    <div class="si-item" *ngIf="staff.email">
        <mat-icon> email </mat-icon> {{ staff.email }}
</div>
    </div>

    <div class="staff-perf-row">
        <span class="rating-val">⭐ {{ staff.rating }} </span>
            <span class="feedback-prev"> "{{ staff.feedback }}" </span>
                </div>

                <div class="staff-actions">
                    <div class="attendance-toggle">
                        <button class="att-btn present" [class.active] = "staff.status === 'Active'"> P </button>
                            <button class="att-btn absent" [class.active] = "staff.status === 'Absent'"> A </button>
                                <button class="att-btn leave" [class.active] = "staff.status === 'On Leave'"> L </button>
                                    </div>
                                    <button class="icon-btn-small" style = "margin-left: auto;"> <mat-icon> edit </mat-icon></button>
                                        </div>
                                        </div>
                                        </div>
                                        </div>

                                        <!--Right Column: Stats & Add Button-->
                                            <div class="add-staff-col">
                                                <div class="quick-stats-card">
                                                    <h4>Today's Attendance</h4>
                                                        <div class="att-stat-row">
                                                            <span class="label"> Present </span>
                                                                <span class="val green"> 12 </span>
                                                                    </div>
                                                                    <div class="att-stat-row">
                                                                        <span class="label"> Absent </span>
                                                                            <span class="val red"> 1 </span>
                                                                                </div>
                                                                                <div class="att-stat-row">
                                                                                    <span class="label"> On Leave </span>
                                                                                        <span class="val orange"> 2 </span>
                                                                                            </div>
                                                                                            </div>

                                                                                            <!--Top Performers Card-->
                                                                                                <div class="top-performers-card">
                                                                                                    <h4>Top Performers 🏆</h4>
                                                                                                        <div class="tp-list">
                                                                                                            <div class="tp-item" *ngFor="let tp of topPerformers; let i = index">
                                                                                                                <div class="tp-rank"> {{ i + 1 }}</div>
                                                                                                                    <div class="tp-avatar" [style.background] = "tp.avatarColor" [style.color] = "tp.color">
                                                                                                                        {{ tp.name.charAt(0) }}
</div>
    <div class="tp-info">
        <h5>{{ tp.name }}</h5>
            <span> {{ tp.role }}</span>
                </div>
                <div class="tp-rating">
                    <mat-icon> star </mat-icon> {{ tp.rating }}
</div>
    </div>
    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         <button class="view-all-link"> View All Rankings </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         <!-- New Recruitment Activity Card -->
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         <div class="activity-card">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             <h4>Recent Recruitment </h4>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             <div class="activity-list">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 <div class="activity-item">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     <div class="activity-icon join"> <mat-icon> person_add </mat-icon></div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     <div class="activity-info">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         <p><strong> Priya S.</strong> joined as <span> Chef </span></p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         <small> 2 hours ago </small>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 <div class="activity-item">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     <div class="activity-icon training"> <mat-icon> school </mat-icon></div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     <div class="activity-info">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         <p> Mandatory <strong> Safety Training </strong> completed. </p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         <small> 5 hours ago </small>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         </div>
        </div>
        </div>

        <!--Add Staff Modal Overlay-->
            <div class="modal-overlay" *ngIf="showAddStaffModal" (click) = "closeAddStaffModal()">
                <div class="modal-content" (click) = "$event.stopPropagation()">
                    <div class="modal-header">
                        <h3><mat-icon> person_add </mat-icon> Add New Staff</h3>
                        <button class="icon-btn-small" (click) = "closeAddStaffModal()"> <mat-icon> close </mat-icon></button>
                            </div>

                            <div class="modal-body">
                                <div class="form-group">
                                    <label>Full Name </label>
                                        <input type = "text" placeholder = "e.g. Rahul Sharma">
                                            </div>
                                            <div class="form-group">
                                                <label>Role </label>
                                                <select>
                                                <option>Chef </option>
                                                <option> Waiter </option>
                                                <option> Manager </option>
                                                <option> Cashier </option>
                                                <option> Housekeeping </option>
                                                </select>
                                                </div>
                                                <div class="form-row">
                                                    <div class="form-group">
                                                        <label>Phone No </label>
                                                            <input type = "text" placeholder = "+91 98...">
                                                                </div>
                                                                <div class="form-group">
                                                                    <label>Shift </label>
                                                                    <select>
                                                                    <option>Morning </option>
                                                                    <option> Evening </option>
                                                                    <option> Night </option>
                                                                    </select>
                                                                    </div>
                                                                    </div>
                                                                    <div class="form-group">
                                                                        <label>Email </label>
                                                                        <input type = "email" placeholder = "staff@example.com">
                                                                            </div>
                                                                            <div class="form-group">
                                                                                <label>Monthly Salary </label>
                                                                                    <input type = "number" placeholder = "?">
                                                                                        </div>

                                                                                        <button class="btn-action primary full-width" (click) = "closeAddStaffModal()"> Onboard Staff </button>
                                                                                            </div>
                                                                                            </div>
                                                                                            </div>


                                                                                            <!--Order Details Side Panel(Overlay) - Shared across views-->
                                                                                                <div class="order-panel-overlay" *ngIf="selectedTable" (click) = "closeDetails()"> </div>
                                                                                                    <div class="order-details-panel" [class.open] = "selectedTable">
                                                                                                        <div class="panel-header">
                                                                                                            <h2>{{ selectedTable?.name }}</h2>
                                                                                                                <button mat-icon-button (click)="closeDetails()"> <mat-icon> close </mat-icon></button>
                                                                                                                    </div>

                                                                                                                    <div class="panel-body">
                                                                                                                        <div class="status-badge-row">
                                                                                                                            <span class="status-pill-large" [ngClass] = "getStatusClass(selectedTable?.status)">
                                                                                                                                {{ selectedTable?.status }}
</span>
    </div>

    <!--New Booking Details Section-->
        <div class="details-grid" *ngIf="selectedTable?.status !== 'Available'">
            <div class="detail-card">
                <div class="dt-icon"> <mat-icon> person </mat-icon></div>
                    <div class="dt-info">
                        <span class="dt-label"> Booked By </span>
                            <span class="dt-value"> {{ selectedTable?.bookedBy || 'Walk-in' }}</span>
                                </div>
                                </div>
                                <div class="detail-card">
                                    <div class="dt-icon"> <mat-icon> event_seat </mat-icon></div>
                                        <div class="dt-info">
                                            <span class="dt-label"> Guests </span>
                                                <span class="dt-value"> {{ selectedTable?.occupiedSeats || 0 }}/{{ selectedTable?.seats }}</span>
                                                    </div>
                                                    </div>
                                                    <div class="detail-card">
                                                        <div class="dt-icon"> <mat-icon> schedule </mat-icon></div>
                                                            <div class="dt-info">
                                                                <span class="dt-label"> Time </span>
                                                                    <span class="dt-value"> {{ selectedTable?.bookingStart }}</span>
                                                                        </div>
                                                                        </div>
                                                                        <div class="detail-card">
                                                                            <div class="dt-icon"> <mat-icon> hourglass_empty </mat-icon></div>
                                                                                <div class="dt-info">
                                                                                    <span class="dt-label"> Duration </span>
                                                                                        <span class="dt-value"> {{ selectedTable?.time }}</span>
                                                                                            </div>
                                                                                            </div>
                                                                                            </div>

                                                                                            <h3 class="panel-section-title"> Current Orders </h3>

                                                                                                <div class="order-list-refined" *ngIf="selectedTable?.orders?.length> 0; else noOrders">
                                                                                                    <div class="order-row" *ngFor="let order of selectedTable.orders">
                                                                                                        <div class="or-left">
                                                                                                            <span class="or-qty"> {{ order.qty }}x </span>
                                                                                                                <div class="or-details">
                                                                                                                    <span class="or-name"> {{ order.name }}</span>
                                                                                                                        <span class="or-meta" *ngIf="order.status === 'Preparing'"> Preparing • {{ order.eta }} </span>
                                                                                                                            </div>
                                                                                                                            </div>
                                                                                                                            <span class="or-status {{ order.status.toLowerCase() }}"> {{ order.status }}</span>
                                                                                                                                </div>
                                                                                                                                </div>
                                                                                                                                <ng-template #noOrders>
                                                                                                                                    <div class="empty-state-panel">
                                                                                                                                        <mat-icon> restaurant </mat-icon>
                                                                                                                                        <p> No items ordered yet.</p>
                                                                                                                                            </div>
                                                                                                                                            </ng-template>

                                                                                                                                            <div class="bill-card" *ngIf="selectedTable?.orders?.length> 0">
                                                                                                                                                <div class="bill-row total">
                                                                                                                                                    <span>Total Amount </span>
                                                                                                                                                        <span class="amount">₹{{ getTotalBill() }} </span>
                                                                                                                                                            </div>
                                                                                                                                                            <div class="bill-note"> Values include taxes </div>
                                                                                                                                                                </div>
                                                                                                                                                                </div>

                                                                                                                                                                <div class="panel-footer" *ngIf="selectedTable?.orders?.length> 0">
                                                                                                                                                                    <div class="action-buttons">
                                                                                                                                                                        <button class="btn-action primary"> Add Items </button>
                                                                                                                                                                            <button class="btn-action secondary"> Checkout </button>
                                                                                                                                                                                </div>
                                                                                                                                                                                </div>
                                                                                                                                                                                </div>

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
    /* Scrollbar Styling - Premium Minimal */
    * { scrollbar-width: thin; scrollbar-color: #e0e0e0 transparent; } /* Firefox */
    
    *::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
    *::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px; /* Space from edges */
}
    *::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 10px;
    border: 2px solid transparent; /* Creates padding effect */
    background-clip: content-box;
}
    *::-webkit-scrollbar-thumb:hover {
    background: #666;
    background-clip: content-box;
}

    /* Ensure containers don't double scroll */
    /* Ensure containers don't double scroll */
    .dashboard-container { overflow: hidden; position: relative; }
    /* .main-content styles moved to specific block below */
    .offers-view-container, .staff-view-container, .mm-layout {
    padding-right: 10px; /* Space for scrollbar */
}
    * { box-sizing: border-box; }

    .dashboard-container {
    display: flex;
    height: 100%;
    width: 100%;
}

    /* Sidebar */
    .sidebar {
    width: var(--sidebar-width);
    min-width: var(--sidebar-width);
    background: #050505;
    padding: 30px 20px;
    z-index: 100; /* Ensure over modal if needed, but under profile menu */
}

    /* Profile Menu */
    .profile-menu {
    position: absolute; top: 100%; right: 0; background: white;
    border: 1px solid var(--border-color); border-radius: 12px;
    padding: 5px; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    min-width: 150px; z-index: 1000; margin-top: 10px;
}
    .menu-item {
    display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px;
    border: none; background: transparent; color: #e74c3c; font-weight: 600;
    cursor: pointer; border-radius: 8px; text-align: left;
}
    .menu-item:hover { background: #fee; }
    .menu-item mat-icon { font-size: 1.2rem; }
    .sidebar { display: flex; flex-direction: column; border-right: 1px solid #222; }
    .logo {
    display: flex; align-items: center; gap: 10px; margin-bottom: 40px; color: var(--primary-orange);
}
    .logo h2 { font-size: 1.4rem; margin: 0; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
    .logo-icon { font-size: 2rem; width: 2rem; height: 2rem; }

    .side-nav { display: flex; flex-direction: column; gap: 8px; flex: 1; overflow-y: auto; }
    .nav-item {
    display: flex; align-items: center; gap: 15px; padding: 12px 15px;
    color: #aaa; text-decoration: none; border-radius: 12px; cursor: pointer;
    font-weight: 500; transition: 0.2s; font-size: 0.9rem;
}
    .nav-item:hover, .nav-item.active { background: #1a1a1a; color: var(--primary-orange); }
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
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

    /* Main Content */
    .main-content {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 30px 40px;
    background: #121212;
    display: flex;
    flex-direction: column;
}

    /* Header */
    .top-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .top-header h1 { font-size: 1.8rem; font-weight: 700; color: #fff; margin: 0; }
    
    .header-actions { display: flex; gap: 20px; align-items: center; }
    .search-bar {
    background: #1a1a1a; border-radius: 30px; padding: 10px 20px; display: flex; align-items: center;
    border: 1px solid #333; width: 300px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
    .search-bar mat-icon { color: #999; margin-right: 10px; }
    .search-bar input { border: none; outline: none; width: 100%; font-size: 0.9rem; background: transparent; color: white; }
    
    .icon-btn {
    background: #1a1a1a; border: 1px solid #333; border-radius: 50%; width: 45px; height: 45px;
    cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff;
    transition: 0.2s;
}
    .icon-btn:hover { background: #252525; color: var(--primary-orange); }
    
    .user-profile { display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 0.95rem; cursor: pointer; color: white; }
    .user-profile img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); }

    /* Filters */
    .order-filters { margin-bottom: 30px; }
    .order-filters h3 { margin: 0 0 15px 0; font-size: 1.1rem; font-weight: 600; }
    .filter-chips { display: flex; gap: 12px; flex-wrap: wrap; }
    .chip {
    background: #1a1a1a; padding: 8px 18px; border-radius: 25px; font-size: 0.9rem;
    font-weight: 600; cursor: pointer; border: 1px solid #333; display: flex; align-items: center; gap: 8px;
    transition: 0.2s; color: #aaa;
}
    .chip:hover { border-color: #ddd; background: #f9f9f9; }
    .chip.active { background: #2d3436; color: white; border-color: #2d3436; }
    .chip.badge {
    background: #eee; color: #333; width: 22px; height: 22px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;
}
    .chip.active.badge { background: #555; color: white; }
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
    background: #1e1e1e; border-radius: 24px; padding: 25px; text-align: center;
    border: 1px solid #333; transition: all 0.3s ease;
    display: flex; flex-direction: column; align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
    .order-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); border-color: transparent; }
    
    .card-header { width: 100%; display: flex; justify-content: space-between; font-size: 0.8rem; color: #888; margin-bottom: 20px; font-weight: 500; }
    .table-no { font-weight: 700; color: #fff; }
    
    .food-img-circle { width: 120px; height: 120px; margin: 0 auto 20px; position: relative; }
    .food-img-circle img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); transition: 0.3s; }
    .order-card:hover.food-img-circle img { transform: scale(1.05); }
    
    .order-card h4 { margin: 0 0 15px 0; font-size: 1.1rem; font-weight: 700; color: #fff; }
    
    .status-badge { padding: 8px 20px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .status-badge.dine -in { background: #ffe0d5; color: var(--primary-orange); }
    .status-badge.served { background: #e0f2f1; color: #009688; }
    .status-badge.wait-list { background: #e3f2fd; color: #2196f3; }
    .status-badge.take-away { background: #ffebee; color: #f44336; }

    /* Categories */
    .section-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
    .section-title h3 { margin: 0; font-size: 1.2rem; color: #fff; }
    
    .nav-arrows { display: flex; gap: 10px; }
    .arrow-btn {
    width: 32px; height: 32px; border-radius: 50%; border: none; background: #1a1a1a;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); color: #ccc; transition: 0.2s;
}
    .arrow-btn:hover { background: var(--primary-orange); color: white; }
    
    .categories-row { display: flex; gap: 25px; overflow-x: auto; padding: 5px 5px 20px 5px; margin-bottom: 20px; }
    .cat-item { display: flex; flex-direction: column; align-items: center; gap: 12px; min-width: 90px; cursor: pointer; opacity: 0.7; transition: 0.2s; }
    .cat-item:hover, .cat-item.active { opacity: 1; transform: translateY(-2px); }
    .cat-img { width: 70px; height: 70px; border-radius: 50%; overflow: hidden; border: 2px solid transparent; transition: 0.2s; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); }
    .cat-item:hover.cat-img { border-color: var(--primary-orange); }
    .cat-img img { width: 100%; height: 100%; object-fit: cover; }
    .cat-item span { font-size: 0.85rem; font-weight: 600; color: #ccc; }

    /* Trending */
    .trending-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 25px; margin-bottom: 50px; }
    .trend-card {
    background: #1e1e1e; padding: 15px; border-radius: 20px;
    display: flex; align-items: center; gap: 15px; border: 1px solid #333;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); transition: 0.2s;
}
    .trend-card:hover { border-color: var(--primary-orange); box-shadow: 0 5px 15px rgba(255, 87, 34, 0.1); }
    .trend-info { flex: 1; }
    .week-tag { font-size: 0.65rem; color: #999; display: block; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
    .trend-info h4 { margin: 0 0 10px 0; font-size: 1rem; font-weight: 700; color: #fff; }
    .price-add { display: flex; align-items: center; justify-content: space-between; }
    .price-add .price { font-weight: 800; color: #fff; font-size: 1.1rem; }
    .add-btn {
    width: 28px; height: 28px; border-radius: 50%; background: #ffe0d5;
    color: var(--primary-orange); border: none; font-weight: bold; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
    padding-bottom: 2px;
}

    /* Status Metrics */
    .status-metrics { display: flex; gap: 20px; margin-bottom: 40px; }
    .metric-card {
    flex: 1; background: #1e1e1e; padding: 20px; border-radius: 16px;
    display: flex; align-items: center; gap: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    border: 1px solid #333; transition: 0.2s;
}
    .metric-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05); }
    .metric-icon {
    width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
}
    .metric-icon.total { background: rgba(33, 150, 243, 0.15); color: #2196f3; }
    .metric-icon.occupied { background: rgba(255, 87, 34, 0.15); color: #ff5722; }
    .metric-icon.reserved { background: rgba(255, 152, 0, 0.15); color: #ff9800; }
    .metric-icon.available { background: rgba(46, 204, 113, 0.15); color: #2ecc71; }
    
    .metric-info { display: flex; flex-direction: column; }
    .metric-info .label { font-size: 0.85rem; color: #ccc; margin-bottom: 5px; }
    .metric-info .value { font-size: 1.4rem; font-weight: 700; color: #fff; }

    /* Table Grid */
    .table-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px;
}
    .table-item {
    background: #1e1e1e; border-radius: 16px; padding: 20px; cursor: pointer;
    border: 2px solid transparent; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
}
    .table-item:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08); }
    
    .table-item.occupied { border-color: #ff5722; background: rgba(255, 87, 34, 0.05); }
    .table-item.occupied .status-icon { color: #ff5722; }
    .table-item.occupied .status-text { color: #ff5722; }

    .table-item.available { border-color: #2ecc71; background: rgba(46, 204, 113, 0.05); }
    .table-item.available .status-icon { color: #2ecc71; }
    .table-item.available .status-text { color: #2ecc71; }

    .table-item.reserved { border-color: #ff9800; background: rgba(255, 152, 0, 0.05); }
    .table-item.reserved .status-icon { color: #ff9800; }
    .table-item.reserved .status-text { color: #ff9800; }

    .table-header { display: flex; justify-content: space-between; margin-bottom: 15px; font-weight: 700; color: #fff; }
    .seats { display: flex; align-items: center; gap: 5px; font-size: 0.8rem; color: #ccc; font-weight: 500; }
    .seats mat-icon { font-size: 1rem; width: 1rem; height: 1rem; }

    .table-body { display: flex; flex-direction: column; align-items: center; gap: 5px; }
    .status-icon { font-size: 2.5rem; width: 2.5rem; height: 2.5rem; margin-bottom: 5px; }
    .status-text { font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .time-elapsed { font-size: 0.8rem; color: #ccc; margin-top: 5px; font-weight: 500; }

    /* Order Details Panel */
    .order-panel-overlay {
    position: fixed; inset: 0; background: rgba(0, 0, 0, 0.3); z-index: 99;
    animation: fadeIn 0.2s ease-out;
}
    .order-details-panel {
    position: fixed; top: 0; right: -400px; width: 380px; height: 100vh;
    background: #1a1a1a; z-index: 100; padding: 0; box-shadow: -5px 0 30px rgba(0, 0, 0, 0.4);
    transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex; flex-direction: column;
}
    .order-details-panel.open { right: 0; }
    
    .panel-header { padding: 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; }
    .panel-header h2 { margin: 0; font-size: 1.3rem; }
    
    .panel-body { padding: 25px; flex: 1; overflow-y: auto; }
    .order-status-banner {
    padding: 10px; border-radius: 8px; text-align: center; font-weight: 700; text-transform: uppercase;
    font-size: 0.85rem; margin-bottom: 25px; letter-spacing: 0.5px;
}
    .order-status-banner.occupied { background: rgba(255, 87, 34, 0.15); color: #ff5722; }
    .order-status-banner.available { background: rgba(0, 150, 136, 0.15); color: #009688; }
    .order-status-banner.reserved { background: rgba(255, 152, 0, 0.15); color: #ff9800; }

    .order-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f9f9f9; }
    .item-details h4 { margin: 0 0 5px 0; font-size: 1rem; color: #fff; }
    .item-details.qty { color: #888; font-size: 0.85rem; font-weight: 600; }
    .item-details.eta { color: #ff9800; font-size: 0.75rem; font-weight: 500; font-style: italic; }
    .item-status { font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: capitalize; }
    .item-status.preparing { background: #fff3e0; color: #ff9800; }
    .item-status.ready { background: #e0f2f1; color: #009688; }
    .item-status.served { background: #f0f0f0; color: #888; }

    .empty-state { text-align: center; margin-top: 50px; color: #ccc; }
    .empty-state mat-icon { font-size: 4rem; width: 4rem; height: 4rem; margin-bottom: 10px; opacity: 0.5; }
    .empty-state p { font-size: 0.95rem; }

    .bill-summary {
    border-top: 2px dashed #eee;
    margin-top: 20px;
    padding-top: 20px;
}
    .bill-row { display: flex; justify-content: space-between; align-items: center; }
    .bill-row.total { font-size: 1.3rem; font-weight: 800; color: #fff; }

    .panel-footer { padding: 25px; border-top: 1px solid #333; background: #1e1e1e; }
    .action-buttons { display: flex; gap: 15px; }
    .btn-action { flex: 1; padding: 12px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; transition: 0.2s; }
    .btn-action.primary { background: var(--primary-orange); color: white; }
    .btn-action.secondary { background: #121212; border: 1px solid #333; color: #ccc; }
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
    background: #1e1e1e;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    border: 1px solid #333;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    height: 100%;
    overflow: hidden;
}

    /* Menu Column - Fixed & Clean */
    .mm-menu-col {
    flex: 1;
    background: #121212; /* Consistent Dark Theme */
    border-radius: 24px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    border: 1px solid #222;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

    /* Full Width Overrides */
    .mm-tables-col.full-width-col {
    width: 100% !important;
    max-width: none!important;
    min-width: 0!important;
    flex: 1;
}
    .mm-menu-col.full-width-col {
    width: 100% !important;
    max-width: none!important;
    flex: 1;
}

    .placeholder-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: white;
    border-radius: 20px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
    padding: 40px;
    text-align: center;
}
    .empty-state-large mat-icon { font-size: 5rem; width: 5rem; height: 5rem; color: #eee; margin-bottom: 20px; }
    .empty-state-large h3 { margin: 0 0 10px 0; color: #333; font-size: 1.5rem; }
    .empty-state-large p { color: #888; font-size: 1rem; max-width: 400px; margin: 0 auto; line-height: 1.5; }
    .metrics-row {
    width: 100%;
    max-width: 600px;
}
    
    .mm-tables-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 10px;
    overflow-y: auto;
    grid-auto-flow: dense;
}
    .mm-tables-grid.full-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 30px;
}
    
    .menu-list-compact.full-grid-menu {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}
    
    .status-legend-pill {
    display: flex;
    gap: 15px;
    margin-bottom: 25px;
    padding: 5px;
}
    .legend-pill {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 700;
        color: #ccc;
        border: 1px solid #333;
        background: #252525;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .legend-pill.available { background: #1a2e1a; color: #66bb6a; border-color: #2e7d32; }
    .legend-pill.occupied { background: #2e1a1a; color: #ef5350; border-color: #c62828; }
    .legend-pill.reserved { background: #2e201a; color: #ffa726; border-color: #ef6c00; }
    
    .legend-pill .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; box-shadow: 0 0 5px currentColor; }
    
    .table-card-realistic {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
    .table-card-realistic:hover { transform: scale(1.05); z-index: 10; }
    .table-card-realistic:active { transform: scale(0.95); }

    .table-surface {
    width: 80px;
    height: 80px;
    background: #1a1a1a;
    border: 1px solid #444;
    border-radius: 16px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), inset 0 2px 5px rgba(255,255,255,0.05);
    font-weight: 800;
    font-size: 1.2rem;
    color: #fff;
    transition: 0.3s;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    position: relative;
}
    .table-surface::before {
        content: ''; position: absolute; inset: 0; border-radius: inherit;
        background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%);
        pointer-events: none;
    }

    /* Sizes */
    .table-card-realistic.size-small { width: 80px; height: 80px; }
    .table-card-realistic.size-small .table-surface { width: 60px; height: 60px; border-radius: 50%; } /* Round Small */
    
    .table-card-realistic.size-large { width: 140px; } 
    .table-card-realistic.size-large .table-surface { width: 120px; }
    
    .table-card-realistic.size-xl { width: 180px; grid-column: span 2; }
    .table-card-realistic.size-xl .table-surface { width: 160px; }

    .table-card-realistic.occupied .table-surface { border-color: #ef5350; background: rgba(239, 83, 80, 0.15); color: #ef5350; }
    .table-card-realistic.available .table-surface { border-color: #66bb6a; background: rgba(102, 187, 106, 0.15); color: #66bb6a; }
    .table-card-realistic.reserved .table-surface { border-color: #ffa726; background: rgba(255, 167, 38, 0.15); color: #ffa726; }

    .chair {
    position: absolute;
    width: 30px;
    height: 10px;
    background: #444;
    border-radius: 4px;
    z-index: 1;
    transition: 0.3s;
}

    /* Table Reservations Full View Styles */
    .reservation-view-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
    
    .reservation-floor-plan {
    background: #1e1e1e;
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    border: 1px solid #333;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

    .floor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px dashed #333;
}
    
    .fh-left h3 {
    margin: 0;
    font-size: 1.4rem;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
}
    
    .badge-pill {
    background: #f5f5f5;
    color: #666;
    font-size: 0.8rem;
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 600;
    margin-left: 10px;
    vertical-align: middle;
}

    .floor-legend {
    display: flex;
    gap: 12px;
}

    .floor-grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 40px;
    padding: 20px 0;
    overflow-y: auto;
    flex: 1;
}

    /* Ensure table cards render correctly in this container */
    .reservation-floor-plan.table-card-realistic {
    margin: 0 auto;
}

    /* Refined Order Panel Styles */
    .status-badge-row {
    display: flex;
    justify-content: center;
    margin-bottom: 25px;
}
    .status-pill-large {
    padding: 8px 30px;
    border-radius: 30px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.9rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
    .status-pill-large.occupied { background: linear-gradient(135deg, #2a0e0e, #3e1212); color: #ef5350; border: 1px solid #c62828; }
    .status-pill-large.available { background: linear-gradient(135deg, #0e1f14, #142e1b); color: #66bb6a; border: 1px solid #2e7d32; }
    .status-pill-large.reserved { background: linear-gradient(135deg, #2a1c05, #3e2808); color: #ffa726; border: 1px solid #ef6c00; }

    .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 30px;
}
    .detail-card {
    background: #252525;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 12px;
}
    .dt-icon mat-icon { font-size: 1.5rem; color: #aaa; width: 24px; height: 24px; }
    .dt-info { display: flex; flex-direction: column; }
    .dt-label { font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    .dt-value { font-size: 0.95rem; font-weight: 700; color: #fff; margin-top: 2px; }

    .order-list-refined { margin-bottom: 25px; max-height: 250px; overflow-y: auto; padding-right: 5px; }
    .order-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f5;
}
    .or-left { display: flex; gap: 12px; align-items: center; }
    .or-qty {
    font-weight: 700;
    color: #ff9800;
    background: #fff3e0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 0.9rem;
}
    .or-details { display: flex; flex-direction: column; }
    .or-name { font-weight: 600; color: #fff; font-size: 1rem; }
    .or-meta { font-size: 0.75rem; color: #aaa; font-style: italic; margin-top: 2px; }
    .or-status {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 6px;
    text-transform: capitalize;
}
    .or-status.preparing { color: #f57c00; background: #fff3e0; }
    .or-status.served { color: #66bb6a; background: #e8f5e9; }
    
    .bill-card {
    background: #252525;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 20px;
}
    .bill-row.total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 5px;
}
    .bill-row.total.amount {
    font-size: 1.5rem;
    font-weight: 800;
    color: #fff;
}
    .bill-note { text-align: right; font-size: 0.75rem; color: #aaa; }
    
    .empty-state-panel {
    text-align: center;
    padding: 40px 20px;
    color: #ccc;
}
    .empty-state-panel mat-icon { font-size: 3rem; width: 3rem; height: 3rem; margin-bottom: 10px; opacity: 0.5; }
    .table-card-realistic.occupied .table-surface {
        background: radial-gradient(circle, #2a0e0e 0%, #3e1212 100%);
        border-color: #ef5350;
        box-shadow: 0 0 15px rgba(239, 83, 80, 0.2), inset 0 0 10px rgba(0,0,0,0.5);
        color: white;
    }
    .table-card-realistic.available .table-surface {
        background: radial-gradient(circle, #0e1f14 0%, #142e1b 100%);
        border-color: #4ade80;
        box-shadow: 0 0 15px rgba(74, 222, 128, 0.15), inset 0 0 10px rgba(0,0,0,0.5);
        color: white;
    }
    .table-card-realistic.reserved .table-surface {
        background: radial-gradient(circle, #2a1c05 0%, #3e2808 100%);
        border-color: #ffa726;
        box-shadow: 0 0 15px rgba(255, 167, 38, 0.2), inset 0 0 10px rgba(0,0,0,0.5);
        color: white;
    }
    
    .table-card-realistic.occupied .chair { background: #441818; border-color: #5c2020; }
    .table-card-realistic.available .chair { background: #1a3322; border-color: #25442e; }
    .table-card-realistic.reserved .chair { background: #422d10; border-color: #5c3e16; }

    /* Chair Positioning Logic - Premium */
    .chair {
        position: absolute;
        width: 34px;
        height: 14px;
        background: #333;
        border-radius: 6px;
        z-index: 1;
        transition: 0.3s;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        border: 1px solid #222;
    }
    
    .table-card-realistic:hover .chair.top { transform: translateY(4px) translateX(-50%); }
    .table-card-realistic:hover .chair.bottom { transform: translateY(-4px) translateX(-50%); }
    .table-card-realistic:hover .chair.left { transform: translateX(4px) translateY(-50%); }
    .table-card-realistic:hover .chair.right { transform: translateX(-4px) translateY(-50%); }

    /* Standard / Small */
    .chair.top { top: -8px; left: 50%; transform: translateX(-50%); }
    .chair.bottom { bottom: -8px; left: 50%; transform: translateX(-50%); }
    .chair.left { left: -8px; top: 50%; width: 14px; height: 34px; transform: translateY(-50%); }
    .chair.right { right: -8px; top: 50%; width: 14px; height: 34px; transform: translateY(-50%); }

    /* Large (Rectangle) overrides */
    .size-large.chair.top { left: 50%; }
    .size-large.chair.top-left { top: -8px; left: 20px; width: 34px; height: 14px; position: absolute; }
    .size-large.chair.top-right { top: -8px; right: 20px; width: 34px; height: 14px; position: absolute; }
    .size-large.chair.bottom-left { bottom: -8px; left: 20px; width: 34px; height: 14px; position: absolute; }
    .size-large.chair.bottom-right { bottom: -8px; right: 20px; width: 34px; height: 14px; position: absolute; }
    
    /* XL overrides */
    .size-xl.chair.top { left: 50%; }
    .size-xl.chair.top-mid { top: -8px; left: 40%; width: 34px; height: 14px; position: absolute; }
    .size-xl.chair.bottom-mid { bottom: -8px; right: 40%; width: 34px; height: 14px; position: absolute; }
    
    .size-small.chair.top { top: 6px; }
    .size-small.chair.bottom { bottom: 6px; }

    .table-status-dot {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    z-index: 3;
    border: 2px solid rgba(0,0,0,0.2);
    box-shadow: 0 0 0 2px rgba(255,255,255,0.05);
}
    .table-status-dot.occupied { background: #ef5350; box-shadow: 0 0 8px #ef5350; }
    .table-status-dot.available { background: #4ade80; box-shadow: 0 0 8px #4ade80; }
    .table-status-dot.reserved { background: #ffa726; box-shadow: 0 0 8px #ffa726; }

    /* Menu Column */
    .mm-menu-col {
    flex: 1;
    background: #1e1e1e;
    border-radius: 20px;
    padding: 25px;
    display: flex;
    flex-direction: column;
    border: 1px solid #333;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    overflow: hidden; /* Important for inner scroll */
    height: 100%;
}
    
    .section-headers { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-shrink: 0; }
    .section-headers h3 { margin: 0; font-size: 1.1rem; font-weight: 700; color: #fff; }
    
    .categories-row.compact { padding-bottom: 10px; margin-bottom: 20px; flex-shrink: 0; }
    .cat-img.small { width: 50px; height: 50px; }
    
    .menu-list-compact {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    overflow-y: auto;
    padding: 10px;
    padding-bottom: 20px;
    flex: 1;
    width: 100%;
}
.menu-list-compact.full-grid-menu {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  width: 100%;
  height: 100%;
  padding-bottom: 50px;
}
    
    .menu-list-item {
    display: flex;
    flex-direction: column;
    background: #1e1e1e;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    position: relative;
    height: auto; /* Allow content to define height */
    min-height: 320px;
}
    .menu-list-item:hover {
    border-color: var(--primary-orange);
    box-shadow: 0 15px 45px rgba(255, 87, 34, 0.2);
    transform: translateY(-8px);
}
    .ml-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: 0.3s;
}
    .menu-list-item:hover .ml-overlay { opacity: 1; }
    .ml-quick-add {
    background: var(--primary-orange); color: white; border: none;
    padding: 10px 20px; border-radius: 30px; font-weight: 700;
    display: flex; align-items: center; gap: 8px; cursor: pointer;
    transform: translateY(20px); transition: 0.3s;
}
    .menu-list-item:hover .ml-quick-add { transform: translateY(0); }
    .popular-fire { color: #ff5722; font-size: 1.2rem; }
    .ml-top-row { display: flex; justify-content: space-between; align-items: center; }
    
    .ml-img {
    width: 100%;
    height: 180px;
    overflow: hidden;
    position: relative;
}
    .ml-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
    .menu-list-item:hover .ml-img img { transform: scale(1.08); }
    
    .ml-info-container {
        padding: 16px;
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: space-between;
        gap: 12px;
        background: linear-gradient(180deg, #1e1e1e 0%, #161616 100%);
    }

    .ml-info { display: flex; flex-direction: column; gap: 4px; }
    .ml-info h4 {
    margin: 0;
    font-size: 1.1rem;
    color: #fff;
    font-weight: 600;
    letter-spacing: 0.3px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
    .ml-info .category-tag { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: 500; }
    
    .ml-price-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        padding-top: 12px;
        border-top: 1px dashed rgba(255,255,255,0.1);
    }

    .ml-price {
    font-weight: 800;
    font-size: 1.4rem;
    color: #fff;
    margin: 0;
    font-family: 'Outfit', sans-serif;
}
    
    .ml-add-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #333;
    color: var(--primary-orange);
    border: 1px solid #444;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}
    .ml-add-btn:hover { background: var(--primary-orange); color: white; border-color: var(--primary-orange); box-shadow: 0 4px 12px rgba(255, 87, 34, 0.4); } 
    .ml-add-btn mat-icon { font-size: 1.2rem; }

    /* Shared View Headers */
    .view-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0; }
    .vh-left { display: flex; align-items: center; gap: 15px; } 
    .vh-left h3 { margin: 0; font-size: 1.3rem; font-weight: 700; color: #333; }
    .btn-action.compact { padding: 8px 20px; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; width: auto; flex: none; margin-right: 5px; } /* Added margin-right */
    .btn-action.compact mat-icon { font-size: 1.2rem; width: 1.2rem; height: 1.2rem; }
    .badge-pill { background: #eee; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; color: #555; margin: 0; }

        /* OFFERS VIEW STYLES */
    .offers-view-container { height: 100%; display: flex; flex-direction: column; overflow-y: auto; padding-right: 20px; }
    .offers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; margin-bottom: 40px; }
    
    .offer-card { background: #1a1a1a; border-radius: 12px; display: flex; overflow: hidden; border: 1px solid #333; height: 160px; position: relative; }
    
    .offer-left { 
        width: 120px; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; 
        color: white; font-weight: 800; position: relative; border-right: 2px dashed rgba(0,0,0,0.3);
    }
    .ticket-holes { position: absolute; right: -8px; top: 0; bottom: 0; width: 16px; background-image: radial-gradient(circle, #0c0c0c 6px, transparent 0); background-size: 100% 20px; }
    
    .pct { font-size: 1.3rem; text-align: center; line-height: 1.1; word-break: break-word; }
    .offer-left small { font-size: 0.6rem; letter-spacing: 1px; margin-top: 5px; opacity: 0.8; }
    
    .offer-right { flex: 1; padding: 20px; display: flex; flex-direction: column; justify-content: center; gap: 8px; }
    .offer-right h3 { margin: 0; font-size: 1.4rem; color: var(--primary-orange); letter-spacing: 1px; }
    .offer-right p { margin: 0; font-size: 0.85rem; color: #aaa; line-height: 1.4; }
    
    .btn-copy { 
        margin-top: 5px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); 
        color: white; padding: 6px 15px; border-radius: 6px; cursor: pointer; width: fit-content; font-size: 0.8rem; 
        transition: 0.2s;
    }
    .btn-copy:hover { background: white; color: black; }

    .bank-offers { margin-top: 30px; }
    .bank-offers h3 { margin-bottom: 20px; font-size: 1.2rem; color: #fff; }
    .bank-card { display: flex; align-items: center; gap: 15px; background: #1a1a1a; padding: 20px; border-radius: 12px; margin-bottom: 15px; border: 1px solid #333; }
    .bank-card mat-icon { font-size: 2rem; width: 2rem; height: 2rem; color: var(--primary-orange); }
    .bank-card h4 { margin: 0 0 5px 0; color: #fff; }
    .bank-card p { margin: 0; font-size: 0.85rem; color: #aaa; }

    /* EARNINGS VIEW STYLES - Premium Dashboard */
    .earnings-view-container {
    height: 100%; display: flex; flex-direction: column; overflow-y: auto;
    padding-right: 15px; gap: 30px;
}
    
    .earnings-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .earnings-header h3 { margin: 0; font-size: 1.5rem; font-weight: 800; color: #fff; letter-spacing: -0.5px; }

    /* Creative KPI Grid */
    .kpi-grid.creative-layout {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 25px;
    margin-bottom: 30px; /* Add breathing room below single row */
}

    .kpi-card.creative {
    padding: 24px;
    border-radius: 24px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 160px;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box - shadow 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.03);
}
    .kpi-card.creative:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    z-index: 1;
}

    /* Card Themes - Dark Tech Versions */
    .kpi-card.dark-grad {
    background: linear-gradient(135deg, #2d3436, #000000);
    color: white;
    border: 1px solid #444;
}
    .kpi-card.green-soft {
    background: #0f291e;
    border: 1px solid #14532d;
}
    .kpi-card.blue-soft {
    background: #0f1c30;
    border: 1px solid #1e3a8a;
}
    .kpi-card.orange-soft {
    background: #2a1205;
    border: 1px solid #7c2d12;
}

    /* Card Elements */
    .kpi-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
}
    
    .icon-box {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    backdrop-filter: blur(4px);
}
    .dark-grad.icon-box { background: rgba(255, 255, 255, 0.2); color: white; }
    .green-soft.icon-box { background: #dcfce7; color: #16a34a; }
    .blue-soft.icon-box { background: #dbeafe; color: #2563eb; }
    .orange-soft.icon-box { background: #ffedd5; color: #ea580c; }

    .trend-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;
}
    .dark-grad .trend-badge { background: rgba(255, 255, 255, 0.15); color: #69f0ae; }
    .green-soft .trend-badge { background: #dcfce7; color: #15803d; }
    
    .kpi-label { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; margin-bottom: 8px; display: block; }
    .dark-grad .kpi-label { color: rgba(255, 255, 255, 0.8); }
    .green-soft .kpi-label { color: #86efac; }
    .blue-soft .kpi-label { color: #93c5fd; }
    .orange-soft .kpi-label { color: #fdba74; }

    .kpi-value { margin: 0; font-size: 2rem; font-weight: 800; line-height: 1; letter-spacing: -1px; }
    .dark-grad .kpi-value { color: white; }
    .green-soft .kpi-value { color: #dcfce7; }
    .blue-soft .kpi-value { color: #dbeafe; }
    .orange-soft .kpi-value { color: #ffedd5; }

    /* Specific Layouts */
    .kpi-row { display: flex; gap: 15px; align-items: center; margin-bottom: 20px; }
    .kpi-footer { font-size: 0.8rem; font-weight: 600; color: #64748b; }
    .process-date { font-size: 0.8rem; font-weight: 600; color: #c2410c; margin-top: 5px; display: block; display: flex; align-items: center; gap: 5px; }
    .process-date::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #c2410c; display: inline-block; }

    .kpi-bg-pattern {
    position: absolute; right: -20px; bottom: -20px; width: 100px; height: 100px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%; pointer-events: none;
}
    .mini-chart-line {
    height: 4px; width: 60px; border-radius: 2px;
    background: linear-gradient(90deg, #16a34a, transparent);
    margin-top: 10px;
}
    .alert-icon { opacity: 0.5; color: #ea580c; }
    
    .charts-row { display: flex; gap: 25px; min-height: 320px; }
    .chart-card { background: #1e1e1e; border-radius: 24px; padding: 25px; border: 1px solid #333; display: flex; flex-direction: column; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
    .chart-card.main-chart { flex: 2; }
    .chart-card.payment-split { flex: 1; min-width: 300px; }
    
    .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
    .card-head h4 { margin: 0; font-size: 1.1rem; font-weight: 700; color: #fff; }

    /* Simple CSS Bar Chart */
    .bar-chart-container { flex: 1; display: flex; align-items: flex-end; justify-content: space-between; padding-top: 20px; gap: 10px; height: 180px; }
    .bar-group { display: flex; flex-direction: column; align-items: center; gap: 10px; height: 100%; justify-content: flex-end; flex: 1; }
    .bar { width: 30px; background: linear-gradient(180deg, #ff7675, #ff9f43); border-radius: 8px 8px 0 0; transition: height 0.5s ease; min-height: 5px; opacity: 0.8; }
    .bar:hover { opacity: 1; transform: scaleX(1.1); }
    .bar-label { font-size: 0.8rem; font-weight: 600; color: #888; }
    
    .donut-container { display: flex; flex-direction: column; gap: 20px; align-items: center; height: 100%; justify-content: center; }
    .donut-chart {
    width: 140px; height: 140px; border-radius: 50%;
    background: conic-gradient(#6c5ce7 0% 65%, #0984e3 65% 85%, #00b894 85% 100%);
    position: relative; display: flex; align-items: center; justify-content: center;
}
    .donut-chart::after {
    content: ''; position: absolute; width: 100px; height: 100px;
    background: #1e1e1e; border-radius: 50%;
}
    .center-text { position: absolute; z-index: 2; text-align: center; display: flex; flex-direction: column; }
    .center-text span { font-size: 0.8rem; color: #aaa; }
    .center-text strong { font-size: 1.2rem; color: #fff; }
    
    .legend-list { width: 100%; display: flex; flex-direction: column; gap: 10px; }
    .legend-item { display: flex; align-items: center; justify-content: space-between; font-size: 0.9rem; font-weight: 600; color: #ccc; }
    .legend-item .dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 10px; }
    .l-name { flex: 1; }

    .details-row { display: flex; gap: 25px; }
    .details-card { background: #1e1e1e; border-radius: 24px; padding: 25px; border: 1px solid #333; flex: 1; }
    .details-card.products-perf { flex: 1.2; }
    
    .perf-section { margin-bottom: 20px; }
    .perf-section:last-child { margin-bottom: 0; }
    .section-label { font-size: 0.85rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 15px; }
    .section-label.up { color: #00b894; }
    .section-label.down { color: #d63031; }
    
    .perf-list { display: flex; flex-direction: column; gap: 12px; }
    .perf-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #252525; border-radius: 12px; border: 1px solid #333; }
    .pi-info { display: flex; flex-direction: column; }
    .pi-name { font-weight: 700; color: #fff; font-size: 0.95rem; }
    .pi-sub { font-size: 0.75rem; color: #888; font-weight: 600; }
    .pi-rev { font-weight: 800; color: #fff; font-size: 0.95rem; }
    
    .divider-dash { height: 1px; border-bottom: 2px dashed #eee; margin: 20px 0; }
    
    .simple-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .simple-table th { text-align: left; font-size: 0.75rem; color: #888; text-transform: uppercase; font-weight: 700; padding: 10px; border-bottom: 1px solid #333; }
    .simple-table td { padding: 12px 10px; font-size: 0.9rem; color: #ddd; font-weight: 500; border-bottom: 1px solid #2a2a2a; }
    .simple-table.mono { font-family: monospace; color: #ccc; letter-spacing: -0.5px; background: #252525; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; }
    .status-pill { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
    .status-pill.processed { background: #fff3e0; color: #ef6c00; }
    .status-pill.settled { background: #e8f5e9; color: #2e7d32; }
    .text-btn { background: none; border: none; color: var(--primary-orange); font-weight: 600; cursor: pointer; font-size: 0.85rem; }
    .staff-view-container { display: flex; height: 100%; gap: 30px; }
    .staff-directory-col { flex: 2; display: flex; flex-direction: column; overflow: hidden; }
    .staff-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; overflow-y: auto; padding: 5px; padding-bottom: 40px; }
    
    .add-staff-col { width: 320px; min-width: 320px; display: flex; flex-direction: column; gap: 25px; }

    /* Staff Card */
    .staff-card { background: #1e1e1e; border-radius: 20px; padding: 20px; border: 1px solid #333; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); transition: 0.2s; }
    .staff-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4); border-color: #555; }
    
    .staff-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; position: relative; }
    .staff-avatar {
    width: 50px; height: 50px; border-radius: 14px; background: #e3f2fd; color: #2196f3;
    display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem;
}
    .staff-title h4 { margin: 0 0 4px 0; font-size: 1rem; color: #fff; }
    .rating-row { display: flex; align-items: center; gap: 5px; font-size: 0.8rem; color: #888; margin-top: 2px; }
    .rating-row .star { font-size: 1rem; width: 1rem; height: 1rem; color: #fbc02d; }
    .role-badge { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 3px 8px; border-radius: 6px; background: #eee; color: #666; }

    /* Role Colors */
    .role-badge.chef { background: #ffebee; color: #d32f2f; }
    .role-badge.waiter { background: #e3f2fd; color: #1976d2; }
    .role-badge.manager { background: #e8f5e9; color: #388e3c; }
    .role-badge.cashier { background: #fff8e1; color: #ffa000; }
    
    .status-dot { width: 10px; height: 10px; border-radius: 50%; position: absolute; top: 0; right: 0; }
    .status-dot.active { background: #4caf50; box-shadow: 0 0 0 3px #e8f5e9; }
    .status-dot.absent { background: #f44336; box-shadow: 0 0 0 3px #ffebee; }
    .status-dot.on-leave { background: #ff9800; box-shadow: 0 0 0 3px #fff3e0; } /* 'on leave' class name handles space replacement in JS if used directly, else handled manually */
    
    .staff-info-grid { display: grid; grid-template-columns: 1fr; gap: 8px; font-size: 0.85rem; color: #aaa; margin-bottom: 15px; }
    .si-item { display: flex; align-items: center; gap: 8px; }
    .si-item mat-icon { font-size: 1rem; width: 1rem; height: 1rem; color: #aaa; }
    
    .staff-perf-row { display: flex; justify-content: space-between; align-items: center; background: #252525; padding: 8px 12px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #333; }
    .rating-val { font-weight: 700; color: #fff; font-size: 0.9rem; }
    .feedback-prev { font-style: italic; color: #888; font-size: 0.75rem; max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    
    .staff-actions { display: flex; align-items: center; }
    .attendance-toggle { display: flex; background: #f0f0f0; padding: 3px; border-radius: 30px; }
    .att-btn {
    width: 28px; height: 28px; border-radius: 50%; border: none; font-size: 0.75rem; font-weight: 700;
    cursor: pointer; background: transparent; color: #888; transition: 0.2s;
}
    .att-btn.active.present { background: #4caf50; color: white; }
    .att-btn.active.absent { background: #f44336; color: white; }
    .att-btn.active.leave { background: #ff9800; color: white; }
    
    .icon-btn-small {
    width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
    color: #ccc; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease;
}
    .icon-btn-small mat-icon { font-size: 1.2rem; width: 1.2rem; height: 1.2rem; }
    .icon-btn-small:hover { background: rgba(255, 87, 34, 0.2); color: #ff5722; border-color: #ff5722; transform: rotate(15deg); }

    /* Form Card Styles - Premium Upgrade */
    .form-card {
    background: #1e1e1e;
    border-radius: 24px;
    padding: 30px;
    border: 1px solid #333;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    position: relative;
    overflow: hidden;
}
    .form-card::before {
    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 6px;
    background: linear-gradient(90deg, #ff5722, #ff9f43);
}
    .form-card h3 {
    margin: 0 0 25px 0; font-size: 1.25rem; font-weight: 800;
    display: flex; align-items: center; gap: 12px; color: #fff;
}
    .form-card h3 mat-icon {
    color: var(--primary-orange); background: #2a1a1a;
    padding: 8px; border-radius: 12px; width: auto; height: auto; font-size: 1.4rem; border: 1px solid #ff5722;
}
    
    .form-group { margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; }
    .form-group label {
    font-size: 0.7rem; font-weight: 800; color: #9ca3af; margin-left: 6px;
    text-transform: uppercase; letter-spacing: 0.5px;
}
    .form-group input, .form-group select {
    padding: 10px 14px; border-radius: 10px; border: 1px solid #333;
    font-size: 0.9rem; outline: none; transition: all 0.2s ease;
    background: #121212; font-family: inherit; color: #fff; font-weight: 600;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.5);
}
    .form-group input::placeholder { color: #d1d5db; font-weight: 400; }
    .form-group input:hover, .form-group select:hover { border-color: #d1d5db; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03); }
    .form-group input:focus, .form-group select:focus {
    border-color: var(--primary-orange);
    box-shadow: 0 0 0 3px rgba(255, 87, 34, 0.15);
    transform: translateY(-1px);
    background: #1a1a1a;
}
    
    .form-row { display: flex; gap: 20px; }
    .form-row.form-group { flex: 1; }
    
    .full-width {
    width: 100%; margin-top: 15px; background: linear-gradient(135deg, #ff5722, #f4511e);
    color: white; border: none; padding: 12px; border-radius: 10px;
    font-size: 0.95rem; font-weight: 700; letter-spacing: 0.5px;
    box-shadow: 0 6px 15px rgba(255, 87, 34, 0.2);
    cursor: pointer; transition: all 0.2s ease; position: relative; overflow: hidden;
}
    .full-width:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(255, 87, 34, 0.3); }
    .full-width:active { transform: translateY(0); }
    
    .quick-stats-card { background: #252525; color: white; border-radius: 24px; padding: 30px; margin-top: 0; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); border: 1px solid #333; }
    .quick-stats-card h4 { margin: 0 0 20px 0; opacity: 0.9; font-weight: 600; font-size: 1.1rem; }

    .top-performers-card { background: #1e1e1e; border-radius: 24px; padding: 25px; margin-top: 25px; border: 1px solid #333; }
    .top-performers-card h4 { margin: 0 0 20px 0; font-size: 1.1rem; color: #fff; font-weight: 700; }
    .tp-list { display: flex; flex-direction: column; gap: 15px; }
    .tp-item { display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 1px dashed #f0f0f0; }
    .tp-item:last-child { border-bottom: none; }
    .tp-rank { font-weight: 800; color: #ddd; font-size: 1.2rem; min-width: 20px; }
    .tp-avatar { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; }
    .tp-info { flex: 1; display: flex; flex-direction: column; }
    .tp-info h5 { margin: 0; font-size: 0.95rem; color: #fff; }
    .tp-info span { font-size: 0.75rem; color: #888; text-transform: uppercase; font-weight: 600; margin-top: 2px; }
    .tp-rating { display: flex; align-items: center; gap: 4px; font-weight: 700; color: #333; font-size: 0.9rem; background: #fff8e1; padding: 4px 8px; border-radius: 8px; color: #fbc02d; }
    .tp-rating mat-icon { font-size: 1rem; width: 1rem; height: 1rem; }
    
    .view-all-link {
    width: 100%; margin-top: 15px; background: transparent; color: #aaa; border: 1px solid #333; padding: 10px; border-radius: 12px;
    font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: 0.2s;
}
    .view-all-link:hover { background: #333; color: #fff; }

    /* New Activity Card Styles */
    .activity-card { background: #1e1e1e; border-radius: 24px; padding: 25px; margin-top: 25px; border: 1px solid #333; }
    .activity-card h4 { margin: 0 0 20px 0; font-size: 1.1rem; color: #fff; font-weight: 700; }
    .activity-list { display: flex; flex-direction: column; gap: 15px; }
    .activity-item { display: flex; align-items: center; gap: 12px; }
    .activity-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
    .activity-icon.join { background: #1b5e20; color: #a5d6a7; }
    .activity-icon.training { background: #01579b; color: #81d4fa; }
    .activity-info p { margin: 0; font-size: 0.85rem; color: #ddd; }
    .activity-info small { color: #888; font-size: 0.75rem; }
    .activity-info strong { color: #fff; }
    .activity-info span { color: #ff9f43; font-weight: 700; }
    .view-all-link {
    width: 100%; margin-top: 15px; background: transparent; border: none;
    color: var(--primary-orange); font-size: 0.85rem; font-weight: 600; cursor: pointer; text-align: center;
}

    .big-btn {
    margin-top: 20px;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    background: #1a1a1a; color: var(--primary-orange); border: 2px dashed var(--primary-orange);
    box-shadow: none; padding: 12px; border-radius: 12px; font-weight: 700; transition: 0.2s;
}
    .big-btn:hover {
    background: #2a1a1a; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(255, 87, 34, 0.2);
}
    .big-btn mat-icon { font-size: 1.5rem; width: 1.5rem; height: 1.5rem; }

    /* Modal Styles */
    .modal-overlay {
    position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px);
    z-index: 1000; display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease-out;
}
    .modal-content {
    background: #1e1e1e; width: 380px; border-radius: 20px; overflow: hidden;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex; flex-direction: column;
    max-height: 90vh; border: 1px solid #333;
}
    .modal-header {
    padding: 15px 20px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;
    background: #252525;
}
    .modal-header h3 { margin: 0; font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 8px; color: #fff; }
    .modal-header h3 mat-icon { color: var(--primary-orange); font-size: 1.4rem; height: 1.4rem; width: 1.4rem; }
    
    .modal-body { padding: 20px; overflow-y: auto; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; }}
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }}
    .quick-stats-card h4 { margin: 0 0 20px 0; opacity: 0.8; font-weight: 500; }
    .att-stat-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.9rem; }
    .att-stat-row.val { font-weight: 700; padding: 4px 10px; border-radius: 6px; min-width: 30px; text-align: center; }
    .val.green { background: rgba(76, 175, 80, 0.2); color: #81c784; }
    .val.red { background: rgba(244, 67, 54, 0.2); color: #e57373; }
    .val.orange { background: rgba(255, 152, 0, 0.2); color: #ffb74d; }

`]
})
export class ManagerDashboardComponent implements OnInit {
    auth = inject(AuthService);
    user: any = null;
    showProfileMenu = false;

    logout() {
        this.auth.logout();
    }

    currentView: 'dashboard' | 'menu-management' | 'table-reservations' | 'offers' | 'earnings' | 'staff' = 'dashboard';
    selectedFilter = 'All';
    selectedCategory = 'All';

    // Offers Data
    coupons = [
        { code: 'WELCOME50', discount: '50% OFF', desc: 'Get 50% off on your first order. Max discount ₹150.', color: '#ff9f43' },
        { code: 'WEEKEND', discount: 'Free Delivery', desc: 'Free delivery on all orders this weekend. Min order ₹300.', color: '#2ecc71' },
        { code: 'BURGER10', discount: '10% OFF', desc: 'Flat 10% off on all Burgers.', color: '#e74c3c' },
        { code: 'PARTY25', discount: '25% OFF', desc: 'Order for 5+ people and get 25% off.', color: '#9b59b6' }
    ];

    copyCode(code: string) {
        navigator.clipboard.writeText(code);
        alert('Coupon code ' + code + ' copied to clipboard!');
    }

    ngOnInit() {
        this.user = this.auth.getUser();
    }

    // Categories
    categories = [
        { name: 'All', image: 'https://loremflickr.com/100/100/restaurant,food' },
        { name: 'Starters', image: 'https://loremflickr.com/100/100/appetizer,snack' },
        { name: 'Soups & Salads', image: 'https://loremflickr.com/100/100/salad,soup' },
        { name: 'Main Course', image: 'https://loremflickr.com/100/100/curry,dinner' },
        { name: 'Rice & Biryani', image: 'https://loremflickr.com/100/100/biryani,rice' },
        { name: 'Breads & Rotis', image: 'https://loremflickr.com/100/100/naan,bread' },
        { name: 'Snacks', image: 'https://loremflickr.com/100/100/burger,fries' },
        { name: 'Desserts', image: 'https://loremflickr.com/100/100/dessert,cake' },
        { name: 'Beverages', image: 'https://loremflickr.com/100/100/drink,juice' }
    ];

    // 50+ Food Items with Working Images
    menuItems: FoodItem[] = [
        // Starters
        { id: 1, name: 'Paneer Tikka', category: 'Starters', price: 340, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=80', isPopular: true },
        { id: 2, name: 'Chicken 65', category: 'Starters', price: 380, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80' },
        { id: 3, name: 'Gobi Manchurian', category: 'Starters', price: 260, image: 'https://images.unsplash.com/photo-1625450112373-518349479b1d?auto=format&fit=crop&w=500&q=80' },
        { id: 4, name: 'Veg Spring Roll', category: 'Starters', price: 220, image: 'https://images.unsplash.com/photo-1544025162-d76690b67f61?auto=format&fit=crop&w=500&q=80' },
        { id: 5, name: 'Fried Calamari', category: 'Starters', price: 420, image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=500&q=80' },
        { id: 6, name: 'Chicken Tikka', category: 'Starters', price: 380, image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=500&q=80' },
        { id: 7, name: 'Hara Bhara Kebab', category: 'Starters', price: 280, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80' },
        { id: 8, name: 'Fish Fingers', category: 'Starters', price: 350, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=80' },

        // Soups & Salads
        { id: 9, name: 'Caesar Salad', category: 'Soups & Salads', price: 280, image: 'https://loremflickr.com/500/500/caesarsalad', isPopular: true },
        { id: 10, name: 'Tomato Soup', category: 'Soups & Salads', price: 160, image: 'https://loremflickr.com/500/500/tomatosoup' },
        { id: 11, name: 'Sweet Corn Soup', category: 'Soups & Salads', price: 180, image: 'https://loremflickr.com/500/500/cornsoup' },
        { id: 12, name: 'Greek Salad', category: 'Soups & Salads', price: 320, image: 'https://loremflickr.com/500/500/greeksalad' },
        { id: 13, name: 'Manchow Soup', category: 'Soups & Salads', price: 190, image: 'https://loremflickr.com/500/500/soup,chinese' },

        // Main Course
        { id: 14, name: 'Paneer Butter Masala', category: 'Main Course', price: 380, image: 'https://loremflickr.com/500/500/paneer,butter', isPopular: true },
        { id: 15, name: 'Butter Chicken', category: 'Main Course', price: 480, image: 'https://loremflickr.com/500/500/butterchicken,curry' },
        { id: 16, name: 'Kadai Paneer', category: 'Main Course', price: 360, image: 'https://loremflickr.com/500/500/paneer,curry' },
        { id: 17, name: 'Dal Makhani', category: 'Main Course', price: 320, image: 'https://loremflickr.com/500/500/dalmakhani,lentil' },
        { id: 18, name: 'Chicken Curry', category: 'Main Course', price: 420, image: 'https://loremflickr.com/500/500/chickencurry' },
        { id: 19, name: 'Mutton Rogan Josh', category: 'Main Course', price: 550, image: 'https://loremflickr.com/500/500/muttoncurry' },
        { id: 20, name: 'Malai Kofta', category: 'Main Course', price: 380, image: 'https://loremflickr.com/500/500/kofta,curry' },
        { id: 21, name: 'Veg Kolhapuri', category: 'Main Course', price: 340, image: 'https://loremflickr.com/500/500/vegcurry,spicy' },

        // Rice & Biryani
        { id: 22, name: 'Chicken Biryani', category: 'Rice & Biryani', price: 450, image: 'https://loremflickr.com/500/500/chickenbiryani', isPopular: true },
        { id: 23, name: 'Veg Dum Biryani', category: 'Rice & Biryani', price: 340, image: 'https://loremflickr.com/500/500/vegbiryani' },
        { id: 24, name: 'Jeera Rice', category: 'Rice & Biryani', price: 220, image: 'https://loremflickr.com/500/500/rice,cumin' },
        { id: 25, name: 'Mutton Biryani', category: 'Rice & Biryani', price: 580, image: 'https://loremflickr.com/500/500/muttonbiryani' },
        { id: 26, name: 'Steamed Rice', category: 'Rice & Biryani', price: 180, image: 'https://loremflickr.com/500/500/whiterice' },
        { id: 27, name: 'Curd Rice', category: 'Rice & Biryani', price: 210, image: 'https://loremflickr.com/500/500/curdrice' },

        // Breads & Rotis
        { id: 29, name: 'Butter Naan', category: 'Breads & Rotis', price: 70, image: 'https://loremflickr.com/500/500/naan,butter', isPopular: true },
        { id: 30, name: 'Garlic Naan', category: 'Breads & Rotis', price: 90, image: 'https://loremflickr.com/500/500/naan,garlic' },
        { id: 31, name: 'Tandoori Roti', category: 'Breads & Rotis', price: 50, image: 'https://loremflickr.com/500/500/roti,indian' },
        { id: 32, name: 'Paratha', category: 'Breads & Rotis', price: 60, image: 'https://loremflickr.com/500/500/paratha,bread' },

        // Snacks
        { id: 35, name: 'Samosa Chat', category: 'Snacks', price: 120, image: 'https://loremflickr.com/500/500/samosa' },
        { id: 36, name: 'Pav Bhaji', category: 'Snacks', price: 180, image: 'https://loremflickr.com/500/500/pavbhaji' },
        { id: 37, name: 'Grilled Sandwich', category: 'Snacks', price: 160, image: 'https://loremflickr.com/500/500/sandwich,grilled' },
        { id: 38, name: 'Veg Burger', category: 'Snacks', price: 190, image: 'https://loremflickr.com/500/500/burger,veg' },
        { id: 39, name: 'French Fries', category: 'Snacks', price: 140, image: 'https://loremflickr.com/500/500/frenchfries' },
        { id: 40, name: 'Masala Dosa', category: 'Snacks', price: 180, image: 'https://loremflickr.com/500/500/dosa,indian' },
        { id: 99, name: 'User Choice Pizza', category: 'Snacks', price: 450, image: 'https://loremflickr.com/500/500/pizza,veg' },

        // Desserts
        { id: 41, name: 'Gulab Jamun', category: 'Desserts', price: 150, image: 'https://loremflickr.com/500/500/gulabjamun', isPopular: true },
        { id: 42, name: 'Rasmalai', category: 'Desserts', price: 180, image: 'https://loremflickr.com/500/500/rasmalai,sweet' },
        { id: 43, name: 'Chocolate Brownie', category: 'Desserts', price: 240, image: 'https://loremflickr.com/500/500/brownie' },
        { id: 44, name: 'Ice Cream', category: 'Desserts', price: 120, image: 'https://loremflickr.com/500/500/icecream,scoop' },

        // Beverages
        { id: 46, name: 'Cold Coffee', category: 'Beverages', price: 180, image: 'https://loremflickr.com/500/500/coldcoffee' },
        { id: 47, name: 'Masala Chai', category: 'Beverages', price: 60, image: 'https://loremflickr.com/500/500/chai,tea' },
        { id: 48, name: 'Fresh Lime Soda', category: 'Beverages', price: 110, image: 'https://loremflickr.com/500/500/limesoda,drink' },
        { id: 49, name: 'Lassi', category: 'Beverages', price: 130, image: 'https://loremflickr.com/500/500/lassi,yogurt' },
        { id: 50, name: 'Mango Smoothie', category: 'Beverages', price: 190, image: 'https://loremflickr.com/500/500/mangosmoothie' }
    ];

    // Table Data
    tables: any[] = [
        {
            id: 1, name: 'Table 01', status: 'Occupied', seats: 2, occupiedSeats: 2, time: '12 min', bookingStart: '18:30', bookingEnd: '19:30', bookedBy: 'Rajesh M.',
            orders: [
                { name: 'Chicken Biryani', qty: 2, status: 'Preparing', eta: '15 min' },
                { name: 'Coke', qty: 2, status: 'Served', eta: '0 min' }
            ]
        },
        { id: 2, name: 'Table 02', status: 'Available', seats: 2, occupiedSeats: 0, orders: [], time: '-', bookingStart: '-', bookingEnd: '-' },
        { id: 3, name: 'Table 03', status: 'Reserved', seats: 4, occupiedSeats: 0, orders: [], time: '19:00', bookingStart: '19:00', bookingEnd: '21:00', bookedBy: 'Sarah W.' },
        {
            id: 4, name: 'Table 04', status: 'Occupied', seats: 6, occupiedSeats: 5, time: '25 min', bookingStart: '18:15', bookingEnd: '19:45', bookedBy: 'Amit K.',
            orders: [
                { name: 'Masala Dosa', qty: 3, status: 'Ready', eta: '2 min' }
            ]
        },
        { id: 5, name: 'Table 05', status: 'Available', seats: 4, occupiedSeats: 0, orders: [], time: '-', bookingStart: '-', bookingEnd: '-' },
        {
            id: 6, name: 'Table 06', status: 'Occupied', seats: 10, occupiedSeats: 7, time: '5 min', bookingStart: '18:45', bookingEnd: '20:45', bookedBy: 'Big Family',
            orders: [
                { name: 'User Choice Pizza', qty: 1, status: 'Preparing', eta: '20 min' },
                { name: 'French Fries', qty: 2, status: 'Served', eta: '0 min' }
            ]
        },
        { id: 7, name: 'Table 07', status: 'Reserved', seats: 2, occupiedSeats: 0, orders: [], time: '20:00', bookingStart: '20:00', bookingEnd: '21:30', bookedBy: 'John D.' },
        { id: 8, name: 'Table 08', status: 'Available', seats: 8, occupiedSeats: 0, orders: [], time: '-', bookingStart: '-', bookingEnd: '-' },
        {
            id: 9, name: 'Table 09', status: 'Occupied', seats: 4, occupiedSeats: 2, time: '40 min', bookingStart: '18:00', bookingEnd: '19:30', bookedBy: 'Couple 1',
            orders: [
                { name: 'Club Sandwich', qty: 2, status: 'Served', eta: '0 min' }
            ]
        },
        { id: 10, name: 'Table 10', status: 'Available', seats: 6, occupiedSeats: 0, orders: [], time: '-', bookingStart: '-', bookingEnd: '-' },
        {
            id: 12, name: 'Table 12', status: 'Occupied', seats: 2, occupiedSeats: 2, time: '10 min', bookingStart: '18:40', bookingEnd: '19:40', bookedBy: 'Solo Diner',
            orders: [
                { name: 'Cold Coffee', qty: 2, status: 'Served', eta: '0 min' }
            ]
        },
        { id: 13, name: 'Table 13', status: 'Available', seats: 4, occupiedSeats: 0, orders: [], time: '-', bookingStart: '-', bookingEnd: '-' },
        {
            id: 14, name: 'Table 14', status: 'Occupied', seats: 8, occupiedSeats: 6, time: '1 hr', bookingStart: '19:00', bookingEnd: '21:00', bookedBy: 'Office Party',
            orders: [
                { name: 'Paneer Tikka', qty: 4, status: 'served', eta: '0 min' }
            ]
        },
        { id: 15, name: 'Table 15', status: 'Reserved', seats: 2, occupiedSeats: 0, orders: [], time: '21:00', bookingStart: '21:00', bookingEnd: '22:00', bookedBy: 'Late Night' },
        { id: 16, name: 'Table 16', status: 'Available', seats: 6, occupiedSeats: 0, orders: [], time: '-', bookingStart: '-', bookingEnd: '-' }
    ];

    // Offers Data
    offers: Offer[] = [
        { id: 1, title: 'Student Special', description: 'Valid with Student ID', type: 'Discount', value: '15% OFF', code: 'STUDENT15', color: 'orange', icon: 'school' },
        { id: 2, title: 'Family Feast', description: 'Buy 1 Get 1 Free on Main Course', type: 'BOGO', value: 'BOGO', code: 'FAMILYFUN', color: 'green', icon: 'family_restroom' },
        { id: 3, title: 'Thursday Blast', description: 'Flat discount on total bill every Thursday', type: 'Special Day', value: '20% OFF', code: 'THURS20', color: 'purple', icon: 'calendar_today' },
        { id: 4, title: 'Birthday Bash', description: 'Discount + Free Dessert', type: 'Occasion', value: '10% + Free Dessert', code: 'BDAYTREAT', color: 'pink', icon: 'cake' },
        { id: 5, title: 'Corporate Lunch', description: 'For corporate employee groups', type: 'Corporate', value: '20% OFF', code: 'CORP20', color: 'blue', icon: 'business' },
        { id: 6, title: 'New Bee', description: 'Complimentary Starter for new customers', type: 'Welcome', value: 'Free Starter', code: 'WELCOME', color: 'teal', icon: 'fiber_new' }
    ];

    // Staff Data
    staffList: Staff[] = [
        { id: 'S001', name: 'Arjun Kumar', role: 'Chef', phone: '9876543210', email: 'arjun@wp.com', shift: 'Morning', status: 'Active', salary: 45000, rating: 4.8, feedback: 'Excellent culinary skills.' },
        { id: 2, name: 'Priya Sharma', role: 'Manager', phone: '9876500000', email: 'priya@wp.com', shift: 'General', status: 'Active', salary: 60000, rating: 5.0, feedback: 'Great leadership.' },
        { id: 'S003', name: 'Rahul Singh', role: 'Waiter', phone: '9000012345', email: 'rahul@wp.com', shift: 'Evening', status: 'Active', salary: 20000, rating: 4.2, feedback: 'Friendly with guests.' },
        { id: 'S004', name: 'Sundar P.', role: 'Cleaning', phone: '8888899999', email: 'sundar@wp.com', shift: 'Night', status: 'On Leave', salary: 15000, rating: 4.5, feedback: 'Very diligent.' },
        { id: 'S005', name: 'Anita Roy', role: 'Cashier', phone: '7777766666', email: 'anita@wp.com', shift: 'Morning', status: 'Absent', salary: 25000, rating: 3.8, feedback: 'Needs to be faster.' },
        { id: 'S006', name: 'Vikram Malhotra', role: 'Chef', phone: '9898989898', email: 'vikram@wp.com', shift: 'Evening', status: 'Active', salary: 42000, rating: 4.6, feedback: 'Master of spices.' },
        { id: 'S007', name: 'Neha Gupta', role: 'Waiter', phone: '9123456780', email: 'neha@wp.com', shift: 'Morning', status: 'Active', salary: 21000, rating: 4.9, feedback: 'Always smiling.' },
        { id: 'S008', name: 'Rohan Das', role: 'Delivery', phone: '8765432109', email: 'rohan@wp.com', shift: 'Night', status: 'Active', salary: 18000, rating: 4.7, feedback: 'Very punctual.' },
        { id: 'S009', name: 'Sita Vermani', role: 'Housekeeping', phone: '7654321098', email: 'sita@wp.com', shift: 'Morning', status: 'On Leave', salary: 16000, rating: 4.4, feedback: 'Keeps area spotless.' },
        { id: 'S010', name: 'Karan Mehra', role: 'Waiter', phone: '6543210987', email: 'karan@wp.com', shift: 'Evening', status: 'Active', salary: 20000, rating: 4.1, feedback: 'Good styling.' },
        { id: 'S011', name: 'Deepa Sethi', role: 'Cashier', phone: '5432109876', email: 'deepa@wp.com', shift: 'Evening', status: 'Active', salary: 26000, rating: 4.3, feedback: 'Efficient handling.' },
        { id: 'S012', name: 'Amitabh Jha', role: 'Chef', phone: '4321098765', email: 'amitabh@wp.com', shift: 'Night', status: 'Active', salary: 40000, rating: 4.5, feedback: 'Great night menu.' },
        { id: 'S013', name: 'Pooja Hegde', role: 'Manager', phone: '3210987654', email: 'pooja@wp.com', shift: 'Evening', status: 'Absent', salary: 55000, rating: 4.7, feedback: 'Team player.' },
        { id: 'S014', name: 'Manoj Bajpayee', role: 'Delivery', phone: '2109876543', email: 'manoj@wp.com', shift: 'General', status: 'Active', salary: 19000, rating: 4.8, feedback: 'Safe driver.' },
        { id: 'S015', name: 'Kavita Krishnamurthy', role: 'Housekeeping', phone: '1098765432', email: 'kavita@wp.com', shift: 'Evening', status: 'Active', salary: 15500, rating: 4.6, feedback: 'Very thorough.' }
    ] as any[]; // Cast to avoid strict type issues with ID type mismatch in mock

    newStaff: any = { name: '', role: 'Waiter', phone: '', email: '', shift: 'Morning', salary: 0 };
    showAddStaffModal = false;

    topPerformers = [
        { name: 'Priya Sharma', role: 'Manager', rating: 5.0, avatarColor: '#e3f2fd', color: '#1976d2' },
        { name: 'Arjun Kumar', role: 'Chef', rating: 4.8, avatarColor: '#ffebee', color: '#d32f2f' },
        { name: 'Sundar P.', role: 'Cleaning', rating: 4.5, avatarColor: '#fff3e0', color: '#f57c00' }
    ];

    staffStats = {
        activeNow: 12,
        onLeave: 2,
        lateArrivals: 1
    };

    recentActivities = [
        { type: 'join', user: 'Rahul Gupta', action: 'Joined as Waiter', time: '2 hours ago', icon: 'person_add' },
        { type: 'training', user: 'Chef Vikrant', action: 'Completed Safety Training', time: '5 hours ago', icon: 'school' }
    ];

    openAddStaffModal() {
        this.showAddStaffModal = true;
    }

    closeAddStaffModal() {
        this.showAddStaffModal = false;
    }


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

    getSizeClass(seats: number) {
        if (seats <= 2) return 'size-small';
        if (seats >= 6 && seats < 8) return 'size-large';
        if (seats >= 8) return 'size-xl';
        return '';
    }

    selectTable(table: any) {
        this.selectedTable = table;
    }

    setView(view: 'dashboard' | 'menu-management' | 'table-reservations' | 'offers' | 'earnings' | 'staff') {
        this.currentView = view;
    }

    getTitle() {
        if (this.currentView === 'dashboard') return 'Dashboard';
        if (this.currentView === 'menu-management') return 'Menu Management';
        if (this.currentView === 'table-reservations') return 'Table Reservations';
        if (this.currentView === 'offers') return 'Offers & Discounts';
        if (this.currentView === 'earnings') return 'Earnings & Payouts';
        if (this.currentView === 'staff') return 'Staff Management';
        return 'Dashboard';
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

    getTotalBill() {
        if (!this.selectedTable || !this.selectedTable.orders) return 0;
        return this.selectedTable.orders.reduce((total: number, order: any) => {
            const menuItem = this.menuItems.find(item => item.name === order.name);
            return total + (menuItem ? menuItem.price * order.qty : 0);
        }, 0);
    }
    // Earnings Data Mock
    earningsStats = {
        totalRevenue: 124500,
        netProfit: 86400,
        aov: 1250,
        pendingPayout: 12400
    };

    revenueTrend = [4500, 6200, 5800, 7100, 6900, 8500, 9200]; // Last 7 days

    paymentSplit = [
        { mode: 'UPI / Online', percentage: 65, color: '#6c5ce7' },
        { mode: 'Credit/Debit Card', percentage: 20, color: '#0984e3' },
        { mode: 'Cash', percentage: 15, color: '#00b894' }
    ];

    topSellingItems = [
        { name: 'Chicken Biryani', sold: 145, revenue: 55100, trend: 'up' },
        { name: 'Paneer Butter Masala', sold: 120, revenue: 34800, trend: 'up' },
        { name: 'Butter Naan', sold: 350, revenue: 17500, trend: 'stable' }
    ];

    lowPerformingItems = [
        { name: 'Vegan Salad', sold: 12, revenue: 3000, trend: 'down' },
        { name: 'Plain Rice', sold: 25, revenue: 3000, trend: 'stable' }
    ];

    recentPayouts = [
        { id: 'TXN-8842', date: '28 Dec, 10:00 AM', amount: 42500, status: 'Processed' },
        { id: 'TXN-8841', date: '27 Dec, 06:00 PM', amount: 38200, status: 'Settled' },
        { id: 'TXN-8840', date: '26 Dec, 07:45 PM', amount: 45100, status: 'Settled' }
    ];
}
