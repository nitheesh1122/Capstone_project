import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { QueueService } from '../../services/queue.service';

@Component({
    selector: 'app-customer-dashboard',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
    template: `
    <div class="dashboard-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="logo">
          <mat-icon class="logo-icon">restaurant_menu</mat-icon>
          <h2>WorldPlate</h2>
        </div>

        <nav class="side-nav">
          <a class="nav-item" [class.active]="activeTab === 'dashboard'" (click)="activeTab = 'dashboard'">
              <mat-icon>dashboard</mat-icon> Dashboard
          </a>
          <a class="nav-item" [class.active]="activeTab === 'orders'" (click)="activeTab = 'orders'">
              <mat-icon>receipt_long</mat-icon> My Orders 
              <span *ngIf="cart.length" class="cart-badge">{{cart.length}}</span>
          </a>
          <a class="nav-item" [class.active]="activeTab === 'offers'" (click)="activeTab = 'offers'"><mat-icon>local_offer</mat-icon> Offers & Coupons</a>
          
          <div class="nav-divider"></div>
          
          <a class="nav-item" [class.active]="activeTab === 'reservation'" (click)="activeTab = 'reservation'">
              <mat-icon>event_seat</mat-icon> Table Reservation
          </a>
          <a class="nav-item" [class.active]="activeTab === 'events'" (click)="activeTab = 'events'"><mat-icon>celebration</mat-icon> Events & Catering</a>
        </nav>


      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Header -->
        <header class="top-header">
          <h1>{{ activeTab === 'reservation' ? 'Book a Table' : (activeTab === 'orders' ? 'Your Order' : (activeTab === 'offers' ? 'Offers & Coupons' : (activeTab === 'events' ? 'Plan an Event' : 'Dashboard'))) }}</h1>
          
          <div class="header-actions">
            <!-- Search -->
            <div class="search-wrapper">
                <div class="search-bar">
                    <mat-icon>search</mat-icon>
                    <input type="text" placeholder="Search...">
                </div>
                <button class="btn-search-action">
                    <mat-icon>arrow_forward</mat-icon>
                </button>
            </div>

            <button class="icon-btn"><mat-icon>notifications</mat-icon></button>
            <div class="user-profile" *ngIf="auth.user$ | async as user" (click)="showProfileMenu = !showProfileMenu" style="cursor: pointer; position: relative;">
              <!-- Reliable 3D Avatar -->
              <img src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=100" alt="User" class="avatar-3d">
              <span>{{ user.name }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
              
              <div class="profile-menu" *ngIf="showProfileMenu" (click)="$event.stopPropagation()">
                  <button class="menu-item" (click)="logout()">
                      <mat-icon>logout</mat-icon> Logout
                  </button>
              </div>
            </div>
          </div>
        </header>

        <!-- DASHBOARD VIEW -->
        <div *ngIf="activeTab === 'dashboard'" class="dashboard-view">
            <!-- Banners -->
            <div class="banners-grid">
                <div class="welcome-banner" *ngIf="auth.user$ | async as user">
                    <div class="banner-content">
                        <span class="tag">Deal of the weekend</span>
                        <h2>Hello, {{ user.name }}</h2>
                        <p>Get FREE delivery on every weekend.</p>
                        <button class="btn-check-menu">Check Menu</button>
                    </div>
                    <div class="banner-img">
                       <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop" alt="Dish">
                    </div>
                </div>

                <!-- Discount Banner -->
                <div class="discount-banner">
                    <div class="disc-content">
                        <h2>50% Off</h2>
                        <p>The full price of burgers</p>
                        <div class="progress-dots">
                            <span class="dot active"></span><span class="dot"></span><span class="dot"></span>
                        </div>
                    </div>
                    <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" class="burger-img" alt="Burger">
                </div>
            </div>

            <!-- Food Menu Categories -->
            <div class="section-title">
              <h3>Menu Category</h3>
            </div>
            
            <div class="categories-row">
                <div class="cat-item" *ngFor="let cat of categories" 
                     [class.active-cat]="selectedCategory === cat.name"
                     (click)="filterCategory(cat.name)">
                  <div class="cat-img">
                     <img [src]="cat.image" [alt]="cat.name">
                  </div>
                  <span>{{ cat.name }}</span>
                  <button class="cat-btn"><mat-icon>chevron_right</mat-icon></button>
                </div>
            </div>

        <!-- Filtered Items -->
        <div class="section-title" style="margin-top: 40px;">
            <h3>{{ selectedCategory === 'All' ? 'Trending Orders' : selectedCategory + ' Menu' }}</h3>
            <a class="view-all" (click)="filterCategory('All')" style="cursor: pointer" *ngIf="selectedCategory !== 'All'">View All <mat-icon>chevron_right</mat-icon></a>
        </div>
            
        <div class="trending-grid">
          <div class="trend-card" *ngFor="let item of filteredItems">
             <div class="trend-info">
                <!-- Top Meta: Category + Veg/Non-Veg -->
                <div class="meta-row">
                    <div [class]="item.type === 'veg' ? 'veg-icon' : 'non-veg-icon'"></div>
                    <span class="week-tag">{{ item.category }}</span>
                </div>

                <!-- Name + Special Badge -->
                <div class="name-row">
                    <h4>{{ item.name }}</h4>
                    <div class="special-badge-inline" *ngIf="item?.isSpecial" title="Chef's Special">
                        <mat-icon>star</mat-icon>
                    </div>
                </div>

                <!-- Price + Add -->
                <div class="price-add">
                    <span class="price">₹{{ item.price }}</span>
                    <button class="add-btn" (click)="addToCart(item)"><mat-icon>add</mat-icon></button>
                </div>
             </div>
             
             <!-- Right Image -->
             <div class="img-wrapper">
                 <img [src]="item.image" class="trend-img">
             </div>
          </div>
        </div>
        </div>

        <!-- ORDERS VIEW -->
        <div *ngIf="activeTab === 'orders'" class="orders-view">
            <div class="orders-container">
                <div class="orders-header">
                    <h2>Your Order</h2>
                    <p *ngIf="selectedTable" class="table-context">
                        <mat-icon>table_restaurant</mat-icon> Pre-ordering for <strong>{{ selectedTable.name }}</strong> ({{ guests }} Guests)
                    </p>
                </div>

                <!-- Feature 1: Live Order Timeline -->
                <div class="order-timeline" *ngIf="orderPlaced">
                    <div class="timeline-track">
                        <div class="track-fill" [style.width.%]="(orderStep / 3) * 100"></div>
                    </div>
                    <div class="timeline-steps">
                        <div class="t-step" *ngFor="let s of orderSteps; let i = index" [class.active-step]="i <= orderStep">
                            <div class="step-dot">
                                <mat-icon *ngIf="i < orderStep">check</mat-icon>
                                <span *ngIf="i >= orderStep">{{ i + 1 }}</span>
                            </div>
                            <span>{{ s }}</span>
                        </div>
                    </div>
                    <div class="live-status">
                        <span class="pulse-dot"></span> Status: <strong>{{ orderSteps[orderStep] }}</strong>
                    </div>
                </div>

                <div class="cart-empty" *ngIf="cart.length === 0 && !orderPlaced">
                    <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" width="120">
                    <h3>Your cart is empty</h3>
                    <p>Go to dashboard and explore our delicious menu.</p>
                    <button class="btn-check-menu" (click)="activeTab = 'dashboard'">Browse Menu</button>
                </div>

                <div class="cart-list" *ngIf="cart.length > 0">
                     <div class="cart-item" *ngFor="let c of cart">
                        <img [src]="c.item.image" class="cart-img">
                        <div class="cart-details">
                            <h4>{{ c.item.name }}</h4>
                            <span class="price">₹{{ c.item.price }}</span>
                        </div>
                        <div class="qty-control">
                            <button (click)="decreaseQty(c)">-</button>
                            <span>{{ c.quantity }}</span>
                            <button (click)="increaseQty(c)">+</button>
                        </div>
                        <div class="item-total">
                            ₹{{ (c.item.price * c.quantity).toFixed(2) }}
                        </div>
                     </div>
                </div>

                <div class="cart-summary" *ngIf="cart.length > 0">
                    <div class="sum-row">
                        <span>Subtotal</span>
                        <span>₹{{ cartTotal.toFixed(2) }}</span>
                    </div>
                    <div class="sum-row">
                        <span>Tax (10%)</span>
                        <span>₹{{ (cartTotal * 0.1).toFixed(2) }}</span>
                    </div>
                    <div class="divider"></div>
                    <div class="sum-row total">
                        <span>Total</span>
                        <span>₹{{ (cartTotal * 1.1).toFixed(2) }}</span>
                    </div>

                    <button class="btn-place-order" (click)="placeOrder()">
                        {{ selectedTable ? 'Confirm Pre-order' : 'Place Order' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- RESERVATION VIEW -->
        <div *ngIf="activeTab === 'reservation'" class="reservation-view">
            <div class="res-container">
                <!-- Left: Table Map -->
                <div class="table-map-panel">
                    <h3>Select a Table</h3>
                    <div class="table-legend">
                        <span class="legend-item"><span class="dot available"></span> Available</span>
                        <span class="legend-item"><span class="dot booked"></span> Booked</span>
                        <span class="legend-item"><span class="dot selected"></span> Selected</span>
                    </div>
                    
                    <div class="restaurant-floor">
                        <div *ngFor="let t of tables" 
                             class="table-seat" 
                             [class.booked]="t.status === 'booked'"
                             [class.selected]="selectedTable?.id === t.id"
                             [class.available]="t.status === 'available'"
                             [style.left.px]="t.x" 
                             [style.top.px]="t.y"
                             (click)="selectTable(t)">
                            <mat-icon>table_restaurant</mat-icon>
                            <span>{{ t.name }}</span>
                            <small>{{ t.seats }} Seats</small>
                        </div>
                        <!-- Decor Elements -->
                        <div class="wall-deco window" style="top: 0; left: 100px; width: 100px;">Window</div>
                        <div class="wall-deco entrance" style="bottom: 0; right: 50px; width: 80px;">Entrance</div>
                    </div>
                </div>

                <!-- Right: Booking Form -->
                <div class="booking-panel">
                    <h3>Booking Details</h3>
                    
                    <div *ngIf="!selectedTable" class="empty-state">
                        <mat-icon>touch_app</mat-icon>
                        <p>Please select a table from the map to proceed.</p>
                        
                        <!-- Feature 3: Waitlist Card -->
                        <div class="waitlist-card">
                            <div *ngIf="!inQueue">
                                <h4>Tables Full?</h4>
                                <p>Join our smart waitlist and we'll notify you.</p>
                                <button class="btn-join-queue" (click)="joinWaitlist()">Join Waitlist</button>
                            </div>
                            <div *ngIf="inQueue" class="queue-status">
                                <span class="q-pos">#{{ queuePosition }}</span>
                                <div class="q-info">
                                    <span>in line</span>
                                    <small>~{{ queueWaitTime }} mins wait</small>
                                </div>
                                <mat-icon class="spin-icon">hourglass_empty</mat-icon>
                            </div>
                        </div>
                    </div>

                    <div *ngIf="selectedTable" class="booking-form">
                        <div class="selected-summary">
                            <span class="lbl">Table:</span> <strong>{{ selectedTable.name }}</strong>
                            <span class="lbl">Seats:</span> <strong>{{ selectedTable.seats }} People</strong>
                        </div>

                        <div class="form-group">
                            <label>Number of Guests</label>
                            <input type="number" [(ngModel)]="guests" min="1" [max]="selectedTable.seats">
                        </div>

                        <div class="form-group">
                            <label>Date</label>
                            <input type="date" [(ngModel)]="bookingDate">
                        </div>
                        
                        <div class="form-group">
                            <label>Time</label>
                            <input type="time" [(ngModel)]="bookingTime">
                        </div>

                        <div class="divider"></div>
                        
                        <h4>Your Details</h4>
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" [(ngModel)]="customerName" placeholder="John Doe">
                        </div>
                        
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="tel" [(ngModel)]="customerPhone" placeholder="+1 234 567 890">
                        </div>

                        <div class="pre-order-card" [class.active-po]="preOrderFood">
                            <div class="po-icon">
                                <mat-icon>room_service</mat-icon>
                            </div>
                            <div class="po-info">
                                <h5>Pre-order Food</h5>
                                <p>Food served as soon as you arrive</p>
                            </div>
                            <div class="toggle-wrapper">
                                <label class="switch">
                                    <input type="checkbox" [(ngModel)]="preOrderFood">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>

                        <button class="btn-confirm-book" (click)="proceedToBook()">
                            {{ preOrderFood ? 'Proceed to Order Food' : 'Confirm Reservation' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- OFFERS VIEW -->
        <div *ngIf="activeTab === 'offers'" class="offers-view">
            <div class="offers-grid">
                <div class="offer-card" *ngFor="let offer of coupons">
                    <div class="offer-left" [style.background]="offer.color">
                        <div class="ticket-holes"></div>
                        <span class="pct">{{ offer.discount }}</span>
                        <small>COUPON</small>
                    </div>
                    <div class="offer-right">
                        <h3>{{ offer.code }}</h3>
                        <p>{{ offer.desc }}</p>
                        <button class="btn-copy" (click)="copyCode(offer.code)">Copy Code</button>
                    </div>
                </div>
            </div>
            
            <div class="bank-offers">
                <h3>Bank Offers</h3>
                <div class="bank-card">
                    <mat-icon>credit_card</mat-icon>
                    <div>
                        <h4>20% Instant Discount on Citi Bank Cards</h4>
                        <p>Min transaction ₹1000. Max discount ₹250.</p>
                    </div>
                </div>
                 <div class="bank-card">
                    <mat-icon>account_balance_wallet</mat-icon>
                    <div>
                        <h4>10% Cashback using PayPal</h4>
                        <p>Valid once per user.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- EVENTS VIEW -->
        <div *ngIf="activeTab === 'events'" class="events-view">
             <div class="events-hero">
                <div class="hero-text">
                    <h2>Celebrate with Us!</h2>
                    <p>Weddings, Birthdays, Corporate Events - We curate the best memories per plate.</p>
                    <button class="btn-inquire">Inquire Now</button>
                </div>
             </div>

             <div class="event-services">
                 <div class="event-card">
                     <mat-icon>cake</mat-icon>
                     <h4>Birthdays</h4>
                     <p>Custom cakes, decor, and kids menu.</p>
                 </div>
                 <div class="event-card">
                     <mat-icon>groups</mat-icon>
                     <h4>Corporate</h4>
                     <p>Professional setup, buffet, and drinks.</p>
                 </div>
                 <div class="event-card">
                     <mat-icon>volunteer_activism</mat-icon>
                     <h4>Weddings</h4>
                     <p>Grand buffer, live stations, and more.</p>
                 </div>
             </div>
             
             <div class="inquiry-form-section">
                <h3>Request a Quote</h3>
                <div class="inquiry-form-grid">
                    <div class="form-group">
                        <label>Event Type</label>
                        <select [(ngModel)]="eventInquiry.type">
                            <option value="Birthday">Birthday Party</option>
                            <option value="Wedding">Wedding / Engagement</option>
                            <option value="Corporate">Corporate Meet</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Expected Guests</label>
                        <input type="number" [(ngModel)]="eventInquiry.guests">
                    </div>
                    <div class="form-group">
                        <label>Event Date</label>
                        <input type="date" [(ngModel)]="eventInquiry.date">
                    </div>
                     <div class="form-group">
                        <label>Contact Number</label>
                        <input type="tel" [(ngModel)]="eventInquiry.contact">
                    </div>
                </div>
                <button class="btn-submit-event" (click)="submitEventInquiry()">Send Inquiry</button>
             </div>
        </div>
      </main>

      <!-- Feature 3: Smart Service FAB -->
      <div class="smart-service-fab">
        <div class="service-options" *ngIf="showServiceMenu">
            <button (click)="requestService('Water')"><mat-icon>water_drop</mat-icon> Water</button>
            <button (click)="requestService('Bill')"><mat-icon>receipt</mat-icon> Bill</button>
            <button (click)="requestService('Waiter')"><mat-icon>person</mat-icon> Waiter</button>
            <button (click)="requestService('Clean Table')"><mat-icon>cleaning_services</mat-icon> Clean</button>
        </div>
        <button class="fab-main" (click)="showServiceMenu = !showServiceMenu" [class.active-fab]="showServiceMenu">
            <mat-icon>{{ showServiceMenu ? 'close' : 'room_service' }}</mat-icon>
            <span *ngIf="!showServiceMenu">Service</span>
        </button>
      </div>

    </div>
  `,
    styles: [`
    /* Profile Menu */
    .profile-menu {
        position: absolute; top: 100%; right: 0; background: white; 
        border: 1px solid var(--border-color); border-radius: 12px; 
        padding: 5px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); 
        min-width: 150px; z-index: 1000; margin-top: 10px;
    }
    .menu-item {
        display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px;
        border: none; background: transparent; color: #e74c3c; font-weight: 600;
        cursor: pointer; border-radius: 8px; text-align: left;
    }
    .menu-item:hover { background: #fee; }
    .menu-item mat-icon { font-size: 1.2rem; }

    :host {
      --primary-orange: #ff9f43;
      --primary-dark: #2d3436;
      --bg-dark: #050505;
      --bg-card: #141414;
      --bg-sidebar: #111111;
      --text-main: #ffffff;
      --text-muted: #a0a0a0;
      --border-color: rgba(255, 255, 255, 0.08);
      
      --sidebar-width: 260px;
      
      display: block;
      height: 100vh;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg-dark);
      color: var(--text-main);
    }

    .dashboard-container { display: flex; height: 100%; overflow: hidden; }

    /* Sidebar */
    .sidebar {
      width: var(--sidebar-width);
      background: var(--bg-sidebar);
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border-color);
      flex-shrink: 0;
    }
    .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 50px; color: var(--primary-orange); padding-left: 10px; }
    .logo h2 { font-size: 1.4rem; margin: 0; font-weight: 800; color: white; letter-spacing: -0.5px; }
    .logo-icon { font-size: 2rem; width: 2rem; height: 2rem; }

    .side-nav { display: flex; flex-direction: column; gap: 8px; flex: 1; }
    .nav-item {
       display: flex; align-items: center; gap: 16px; padding: 14px 18px;
       color: var(--text-muted); text-decoration: none; border-radius: 16px; cursor: pointer;
       font-weight: 500; transition: all 0.2s ease; font-size: 0.95rem;
       border: 1px solid transparent;
    }
    .nav-item:hover { color: white; background: rgba(255,255,255,0.03); }
    .nav-item.active { background: rgba(255, 159, 67, 0.15); color: var(--primary-orange); border: 1px solid rgba(255, 159, 67, 0.1); }
    .nav-item mat-icon { font-size: 1.2rem; }
    .cart-badge { background: var(--primary-orange); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; font-weight: bold; margin-left: auto; }
    .nav-divider { height: 1px; background: var(--border-color); margin: 10px 0; }



    /* Main Content */
    .main-content { 
      flex: 1; 
      padding: 40px 60px; 
      overflow-y: auto; 
      overflow-x: hidden; /* Prevent horizontal scroll */
      background: var(--bg-dark); 
      max-width: 1600px; 
      margin: 0 auto;
      width: 100%;
    }
    
    .top-header { 
        display: flex; justify-content: space-between; align-items: center; 
        margin-bottom: 40px; height: 50px; flex-wrap: nowrap; gap: 20px;
    }
    .top-header h1 { font-size: 1.8rem; font-weight: 700; margin: 0; white-space: nowrap; }
    
    .header-actions { display: flex; gap: 16px; align-items: center; flex-shrink: 0; }
    
    .search-wrapper { display: flex; align-items: center; gap: 10px; }
    .search-bar { 
        background: var(--bg-card); border-radius: 50px; padding: 0 16px; 
        display: flex; align-items: center; border: 1px solid var(--border-color); 
        width: 240px; color: var(--text-muted); height: 46px;
    }
    .search-bar mat-icon { color: var(--text-muted); margin-right: 8px; font-size: 1.2rem; }
    .search-bar input { 
        border: none; outline: none; background: transparent; 
        width: 100%; color: white; font-size: 0.85rem; height: 100%;
    }
    .search-bar input::placeholder { color: #555; }
    
    .btn-search-action {
        width: 46px; height: 46px; border-radius: 50%;
        background: var(--primary-orange); border: none;
        color: white; display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: 0.2s; flex-shrink: 0;
    }
    .btn-search-action:hover { background: #e67e22; transform: scale(1.05); }

    .icon-btn { 
        background: var(--bg-card); border: 1px solid var(--border-color);
        width: 46px; height: 46px; border-radius: 50%; display: flex; 
        align-items: center; justify-content: center; color: var(--text-muted); cursor: pointer; 
        transition: 0.2s; flex-shrink: 0;
    }
    .icon-btn:hover { background: #222; color: white; border-color: #444; }
    
    .user-profile { 
        display: flex; align-items: center; gap: 10px; 
        font-weight: 600; font-size: 0.9rem; cursor: pointer; 
        padding: 4px 8px; border-radius: 40px; transition: 0.2s; 
        max-width: 200px; flex-shrink: 0;
    }
    .user-profile:hover { background: rgba(255,255,255,0.05); }
    .user-profile img { 
        width: 40px; height: 40px; border-radius: 50%; 
        object-fit: cover; border: 2px solid var(--bg-card); flex-shrink: 0; 
        background: #ffffff; /* FORCE WHITE BACKGROUND */
    }
    .user-profile span {
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        display: block; max-width: 130px;
    }
    .avatar-3d { background: #ffffff !important; }

    /* Banners */
    .banners-grid { display: grid; grid-template-columns: 2fr 1.2fr; gap: 24px; margin-bottom: 40px; }
    
    .welcome-banner {
        background: #1a1a1a; color: white; border-radius: 24px; padding: 25px 35px;
        position: relative; overflow: hidden; display: flex; justify-content: space-between; align-items: center;
        border: 1px solid var(--border-color);
        min-height: 180px;
    }
    .welcome-banner::before {
        content: ''; position: absolute; inset: 0;
        background: radial-gradient(circle at top right, rgba(255, 159, 67, 0.1), transparent 60%);
    }

    .banner-content { z-index: 2; max-width: 55%; }
    .tag { 
        background: rgba(255, 159, 67, 0.2); color: #ff9f43; 
        padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; 
        font-weight: 700; display: inline-block; margin-bottom: 10px; 
        border: 1px solid rgba(255, 159, 67, 0.3); 
    }
    .banner-content h2 { font-size: 1.6rem; margin: 0 0 8px 0; line-height: 1.2; text-overflow: ellipsis; overflow: hidden; max-height: 3.6rem; }
    .banner-content p { color: var(--text-muted); margin-bottom: 20px; font-size: 0.9rem; }
    .btn-check-menu { 
        background: var(--primary-orange); color: white; border: none; 
        padding: 10px 24px; border-radius: 30px; font-weight: 600; cursor: pointer; 
        box-shadow: 0 8px 20px rgba(255, 159, 67, 0.3); transition: 0.2s;
        min-width: 120px; font-size: 0.9rem;
    }
    .btn-check-menu:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(255, 159, 67, 0.4); }
    .banner-img img { 
        position: absolute; right: -20px; top: 50%; transform: translateY(-50%) rotate(0deg); 
        width: 200px; border-radius: 50%; object-fit: cover; animation: spin-slow 60s infinite linear; 
    }

    .discount-banner {
        background: linear-gradient(145deg, #ff9f43, #e67e22); color: white; 
        border-radius: 24px; padding: 25px; position: relative; overflow: hidden;
        border: 1px solid rgba(255,255,255,0.1);
        min-height: 180px;
    }
    .disc-content { position: relative; z-index: 2; }
    .disc-content h2 { font-size: 2rem; margin: 0; font-weight: 800; }
    .disc-content p { margin: 5px 0 20px; font-size: 0.85rem; opacity: 0.9; }
    .burger-img { 
        position: absolute; right: -40px; bottom: -40px; width: 170px; 
        transform: rotate(-15deg); filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); 
    }

    /* Categories */
    .section-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .section-title h3 { font-size: 1.4rem; font-weight: 700; margin: 0; }
    .view-all { display: flex; align-items: center; color: var(--primary-orange); text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: 0.2s; }
    .view-all:hover { opacity: 0.8; gap: 5px; }
    
    .categories-row { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 50px; }
    .cat-item { 
        background: var(--bg-card); padding: 20px; border-radius: 24px; 
        display: flex; flex-direction: column; align-items: center; gap: 15px;
        flex: 1; border: 1px solid var(--border-color); transition: 0.3s; cursor: pointer;
    }
    .cat-item:hover, .cat-item.active-cat { 
        border-color: var(--primary-orange); background: #1f1f1f;
        transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    .cat-item.active-cat .cat-btn { background: var(--primary-orange); color: white; }
    
    .cat-img { width: 80px; height: 80px; border-radius: 50%; overflow: hidden; margin-bottom: 5px; border: 2px solid rgba(255,255,255,0.1); }
    .cat-img img { width: 100%; height: 100%; object-fit: cover; }
    .cat-item span { font-weight: 600; font-size: 0.95rem; color: var(--text-main); }
    .cat-btn { 
        width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.05); 
        border: none; display: flex; align-items: center; justify-content: center; color: var(--text-muted); 
        transition: 0.2s;
    }
    .cat-item:hover .cat-btn { background: var(--primary-orange); color: white; }

    /* Services Grid */
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 50px; }
    .service-card {
        background: var(--bg-card); padding: 24px; border-radius: 24px;
        border: 1px solid var(--border-color); display: flex; align-items: center; gap: 20px;
        transition: 0.3s; cursor: pointer; position: relative; overflow: hidden;
    }
    .service-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.1); background: #1a1a1a; }
    .serv-icon {
        width: 60px; height: 60px; border-radius: 20px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
    }
    .serv-icon mat-icon { font-size: 2rem; width: 2rem; height: 2rem; }
    .serv-info h4 { margin: 0 0 5px 0; font-size: 1.1rem; font-weight: 700; color: white; }
    .serv-info p { margin: 0 0 15px 0; font-size: 0.85rem; color: var(--text-muted); }
    .serv-btn {
        background: transparent; border: none; padding: 0; 
        font-weight: 700; font-size: 0.9rem; cursor: pointer;
        display: flex; align-items: center; gap: 5px;
    }
    .serv-btn:hover { text-decoration: underline; gap: 8px; }

    /* TRENDING CARD - REFACTORED */
    .trending-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .trend-card { 
        background: var(--bg-card); padding: 20px; border-radius: 24px; 
        display: flex; align-items: center; justify-content: space-between; 
        gap: 15px; border: 1px solid var(--border-color);
        transition: 0.3s; position: relative; overflow: hidden;
    }
    .trend-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.2); background: #1f1f1f; }
    
    .trend-info { flex: 1; display: flex; flex-direction: column; gap: 6px; }
    
    .meta-row { display: flex; align-items: center; gap: 8px; }
    .veg-icon, .non-veg-icon {
        width: 14px; height: 14px; border-radius: 4px; display: flex; align-items: center; justify-content: center;
        background: white; border: 1px solid; flex-shrink: 0;
    }
    .veg-icon { border-color: #2ecc71; }
    .non-veg-icon { border-color: #e74c3c; }
    .veg-icon::after { content: ''; width: 6px; height: 6px; background: #2ecc71; border-radius: 50%; }
    .non-veg-icon::after { content: ''; width: 6px; height: 6px; background: #e74c3c; border-radius: 50%; }
    
    .week-tag { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

    .name-row { display: flex; align-items: center; gap: 8px; }
    .name-row h4 { font-size: 1.05rem; font-weight: 700; margin: 0; color: white; line-height: 1.3; }
    
    .special-badge-inline {
        color: #ffd700; display: flex; align-items: center; 
        filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
    }
    .special-badge-inline mat-icon { font-size: 1rem; width: 1rem; height: 1rem; }

    .price-add { display: flex; align-items: center; gap: 15px; margin-top: 8px; }
    .price { font-weight: 700; color: var(--primary-orange); font-size: 1.1rem; }
    
    .add-btn { 
        width: 32px; height: 32px; border-radius: 50%; background: white; 
        color: black; border: none; cursor: pointer; font-weight: bold; 
        transition: 0.2s; display: flex; align-items: center; justify-content: center;
        font-size: 1.2rem;
    }
    .add-btn:hover { background: var(--primary-orange); color: white; transform: rotate(90deg); }
    .add-btn mat-icon { font-size: 1.2rem; width: 1.2rem; height: 1.2rem; }

    .img-wrapper { 
        width: 100px; height: 100px; border-radius: 50%; overflow: hidden; 
        border: 3px solid rgba(255,255,255,0.05); flex-shrink: 0; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .trend-img { width: 100%; height: 100%; object-fit: cover; transition: 0.3s; }
    .trend-card:hover .trend-img { transform: scale(1.1); }

    /* ORDERS STYLES */
    .orders-view { padding: 0 20px; animation: fadeIn 0.3s ease; }
    .orders-container { max-width: 800px; margin: 0 auto; background: var(--bg-card); padding: 30px; border-radius: 24px; border: 1px solid var(--border-color); }
    .orders-header { margin-bottom: 30px; border-bottom: 1px solid var(--border-color); padding-bottom: 20px; }
    .orders-header h2 { margin: 0; font-size: 1.8rem; }
    .table-context { display: flex; align-items: center; gap: 10px; color: var(--primary-orange); background: rgba(255, 159, 67, 0.1); padding: 10px 15px; border-radius: 10px; margin-top: 10px; width: fit-content; }
    
    .cart-empty { text-align: center; padding: 40px; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 15px; }
    .cart-empty img { opacity: 0.5; filter: grayscale(100%); }

    .cart-list { display: flex; flex-direction: column; gap: 20px; margin-bottom: 30px; }
    .cart-item { display: flex; align-items: center; gap: 20px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .cart-img { width: 70px; height: 70px; border-radius: 12px; object-fit: cover; }
    .cart-details { flex: 1; }
    .cart-details h4 { margin: 0 0 5px 0; font-size: 1.1rem; }
    .qty-control { display: flex; align-items: center; gap: 10px; background: #222; padding: 5px 10px; border-radius: 30px; }
    .qty-control button { width: 24px; height: 24px; border-radius: 50%; border: none; background: #444; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    .qty-control button:hover { background: var(--primary-orange); }
    .item-total { font-weight: 700; font-size: 1.1rem; min-width: 80px; text-align: right; }

    .cart-summary { background: rgba(0,0,0,0.2); padding: 20px; border-radius: 16px; }
    .sum-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.95rem; }
    .sum-row.total { font-size: 1.3rem; font-weight: 800; color: var(--primary-orange); margin-top: 10px; }
    
    .btn-place-order { width: 100%; background: var(--primary-orange); color: white; padding: 16px; border: none; border-radius: 12px; font-weight: 700; font-size: 1.1rem; cursor: pointer; margin-top: 20px; transition: 0.2s; }
    .btn-place-order:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(255, 159, 67, 0.3); }

    /* RESERVATION STYLES */
    .res-container { display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px; height: 100%; }
    .table-map-panel, .booking-panel {
        background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border-color);
        padding: 24px; display: flex; flex-direction: column;
    }
    
    .table-legend { display: flex; gap: 20px; margin-bottom: 20px; font-size: 0.9rem; color: var(--text-muted); }
    .legend-item { display: flex; align-items: center; gap: 8px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
    .dot.available { background: #2ecc71; border: 1px solid #27ae60; box-shadow: 0 0 6px rgba(46, 204, 113, 0.4); }
    .dot.booked { background: #e74c3c; opacity: 0.5; }
    .dot.selected { background: var(--primary-orange); box-shadow: 0 0 10px var(--primary-orange); }

    .restaurant-floor { 
        flex: 1; background: #1a1a1a; border-radius: 16px; position: relative; 
        overflow: hidden; border: 2px dashed #333; min-height: 500px;
    }
    
    .table-seat {
        position: absolute; width: 80px; height: 80px; 
        background: #2a2a2a; border: 2px solid #444; border-radius: 12px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        cursor: pointer; transition: 0.2s; color: var(--text-muted);
    }
    .table-seat mat-icon { font-size: 2rem; width: 2rem; height: 2rem; margin-bottom: 5px; }
    .table-seat span { font-weight: 700; font-size: 0.9rem; }
    .table-seat small { font-size: 0.7rem; opacity: 0.7; }
    
    .table-seat:hover { background: #333; border-color: #666; transform: scale(1.05); }
    .table-seat.available { 
        background: rgba(46, 204, 113, 0.1); border-color: #27ae60; 
        color: #2ecc71; box-shadow: inset 0 0 10px rgba(46, 204, 113, 0.05); 
    }
    .table-seat.booked { background: rgba(231, 76, 60, 0.1); border-color: #e74c3c; color: #e74c3c; cursor: not-allowed; opacity: 0.6; }
    .table-seat.selected { 
        background: rgba(255, 159, 67, 0.2); border-color: var(--primary-orange); 
        color: var(--primary-orange); transform: scale(1.1); box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10;
    }

    .wall-deco { position: absolute; background: #333; height: 4px; border-radius: 2px; text-align: center; font-size: 0.6rem; color: #777; line-height: 4px; }
    
    .empty-state { 
        flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; 
        color: var(--text-muted); opacity: 0.5; text-align: center;
    }
    .empty-state mat-icon { font-size: 4rem; width: 4rem; height: 4rem; margin-bottom: 10px; }

    .booking-form { display: flex; flex-direction: column; gap: 15px; animation: fadeIn 0.3s ease; }
    
    .selected-summary { 
        background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; 
        margin-bottom: 10px; display: flex; justify-content: space-between; font-size: 0.95rem;
    }
    .selected-summary strong { color: var(--primary-orange); }

    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-group label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
    .form-group input { 
        background: #111; border: 1px solid #333; padding: 12px; 
        border-radius: 8px; color: white; font-family: inherit; font-size: 0.95rem;
    }
    .form-group input:focus { border-color: var(--primary-orange); outline: none; }

    .divider { height: 1px; background: var(--border-color); margin: 10px 0; }
    
    .btn-confirm-book {
        background: var(--primary-orange); color: white; border: none; padding: 15px;
        border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer;
        margin-top: 10px; transition: 0.2s;
    }
    .btn-confirm-book:hover { background: #e67e22; transform: translateY(-2px); }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #444; }

    @keyframes spin-slow { from { transform: translateY(-50%) rotate(0deg); } to { transform: translateY(-50%) rotate(360deg); } }

    /* PRE ORDER CARD */
    .pre-order-card {
        background: #1a1a1a;
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 15px;
        margin-top: 10px;
        transition: 0.3s;
    }
    .pre-order-card.active-po {
        border-color: var(--primary-orange);
        background: rgba(255, 159, 67, 0.05);
    }
    .po-icon {
        width: 40px; height: 40px; border-radius: 50%;
        background: rgba(255,255,255,0.05);
        display: flex; align-items: center; justify-content: center;
        color: var(--text-muted);
        transition: 0.3s;
    }
    .pre-order-card.active-po .po-icon {
        background: var(--primary-orange);
        color: white;
    }
    .po-info { flex: 1; }
    .po-info h5 { margin: 0 0 2px 0; font-size: 0.95rem; font-weight: 700; }
    .po-info p { margin: 0; font-size: 0.75rem; color: var(--text-muted); }

    /* TOGGLE SWITCH */
    .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #333; transition: .4s; border-radius: 34px; }
    .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .slider { background-color: var(--primary-orange); }
    input:checked + .slider:before { transform: translateX(20px); }

    /* Feature Styles */
    /* Timeline */
    .order-timeline { margin-bottom: 40px; padding: 20px; background: rgba(255,159,67,0.05); border-radius: 16px; border: 1px solid var(--border-color); }
    .timeline-track { height: 4px; background: #333; margin: 20px 40px 0; position: relative; border-radius: 2px; }
    .track-fill { height: 100%; background: var(--primary-orange); transition: width 0.5s ease; border-radius: 2px; }
    .timeline-steps { display: flex; justify-content: space-between; margin-top: -14px; position: relative; z-index: 2; }
    .t-step { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--text-muted); width: 80px; text-align: center; font-size: 0.8rem; }
    .step-dot { 
        width: 24px; height: 24px; background: #222; border: 2px solid #444; border-radius: 50%; 
        display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem;
        transition: 0.3s;
    }
    .active-step .step-dot { background: var(--primary-orange); border-color: var(--primary-orange); color: white; transform: scale(1.1); box-shadow: 0 0 10px rgba(255,159,67,0.4); }
    .active-step span { color: white; font-weight: 600; }
    .live-status { display: flex; align-items: center; gap: 10px; margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); justify-content: center; color: var(--primary-orange); }
    .pulse-dot { width: 8px; height: 8px; background: var(--primary-orange); border-radius: 50%; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255,159,67, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(255,159,67, 0); } 100% { box-shadow: 0 0 0 0 rgba(255,159,67, 0); } }

    /* Waitlist Card */
    .waitlist-card { margin-top: 30px; background: #1a1a1a; padding: 20px; border-radius: 16px; width: 100%; max-width: 300px; border: 1px solid var(--border-color); }
    .waitlist-card h4 { margin: 0 0 5px 0; color: white; }
    .btn-join-queue { width: 100%; margin-top: 15px; padding: 10px; background: #3498db; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
    .queue-status { display: flex; align-items: center; gap: 15px; }
    .q-pos { font-size: 2.5rem; font-weight: 800; color: #3498db; line-height: 1; }
    .q-info { display: flex; flex-direction: column; text-align: left; }
    .spin-icon { margin-left: auto; animation: spin-slow 3s infinite linear; color: #3498db; }

    /* Smart Service FAB */
    .smart-service-fab { position: fixed; bottom: 40px; right: 40px; display: flex; flex-direction: column; align-items: flex-end; gap: 15px; z-index: 100; }
    .fab-main { 
        height: 60px; padding: 0 25px; border-radius: 30px; background: var(--primary-orange); color: white; 
        border: none; font-size: 1rem; font-weight: 700; display: flex; align-items: center; gap: 10px;
        box-shadow: 0 10px 30px rgba(255,159,67,0.4); cursor: pointer; transition: 0.3s;
    }
    .fab-main:hover { transform: scale(1.05); }
    .active-fab { background: #e74c3c; width: 60px; padding: 0; justify-content: center; }
    .active-fab span { display: none; }
    
    .service-options { display: flex; flex-direction: column; gap: 10px; animation: slideUp 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); }
    .service-options button {
        background: white; color: #333; height: 50px; padding: 0 20px; border-radius: 25px;
        border: none; display: flex; align-items: center; gap: 10px; font-weight: 600; cursor: pointer;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2); transition: 0.2s; min-width: 140px;
    }
    .service-options button:hover { transform: translateX(-5px); color: var(--primary-orange); }
    .service-options button mat-icon { font-size: 1.3rem; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* OFFERS STYLES */
    .offers-view { padding: 0 20px; animation: fadeIn 0.3s ease; }
    .offers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; margin-bottom: 40px; }
    .offer-card { background: var(--bg-card); border-radius: 12px; display: flex; overflow: hidden; border: 1px solid var(--border-color); height: 160px; position: relative; }
    
    .offer-left { 
        width: 120px; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; 
        color: white; font-weight: 800; position: relative; border-right: 2px dashed rgba(0,0,0,0.3);
    }
    .ticket-holes { position: absolute; right: -8px; top: 0; bottom: 0; width: 16px; background-image: radial-gradient(circle, var(--bg-dark) 6px, transparent 0); background-size: 100% 20px; }
    .pct { font-size: 1.3rem; text-align: center; line-height: 1.1; word-break: break-word; }
    .offer-left small { font-size: 0.6rem; letter-spacing: 1px; margin-top: 5px; opacity: 0.8; }
    
    .offer-right { flex: 1; padding: 20px; display: flex; flex-direction: column; justify-content: center; gap: 8px; }
    .offer-right h3 { margin: 0; font-size: 1.4rem; color: var(--primary-orange); letter-spacing: 1px; }
    .offer-right p { margin: 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; }
    .btn-copy { 
        margin-top: 5px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); 
        color: white; padding: 6px 15px; border-radius: 6px; cursor: pointer; width: fit-content; font-size: 0.8rem; 
        transition: 0.2s;
    }
    .btn-copy:hover { background: white; color: black; }

    .bank-offers { margin-top: 30px; }
    .bank-offers h3 { margin-bottom: 20px; font-size: 1.2rem; }
    .bank-card { display: flex; align-items: center; gap: 15px; background: #1a1a1a; padding: 20px; border-radius: 12px; margin-bottom: 15px; border: 1px solid var(--border-color); }
    .bank-card mat-icon { font-size: 2rem; width: 2rem; height: 2rem; color: var(--primary-orange); }
    .bank-card h4 { margin: 0 0 5px 0; }
    .bank-card p { margin: 0; font-size: 0.85rem; color: var(--text-muted); }

    /* EVENTS STYLES */
    .events-view { animation: fadeIn 0.3s ease; }
    .events-hero { 
        background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1519225421980-715cb0202128?w=1200');
        background-size: cover; background-position: center; border-radius: 24px; padding: 60px 40px; margin-bottom: 40px;
        text-align: center; color: white; border: 1px solid var(--border-color);
    }
    .hero-text h2 { font-size: 2.5rem; margin-bottom: 15px; font-weight: 800; }
    .hero-text p { font-size: 1.1rem; max-width: 600px; margin: 0 auto 30px; opacity: 0.9; }
    .btn-inquire { background: var(--primary-orange); color: white; padding: 12px 30px; border: none; border-radius: 30px; font-weight: 700; font-size: 1rem; cursor: pointer; }

    .event-services { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 50px; }
    .event-card { background: var(--bg-card); padding: 25px; border-radius: 20px; text-align: center; border: 1px solid var(--border-color); transition: 0.3s; }
    .event-card:hover { transform: translateY(-5px); background: #222; }
    .event-card mat-icon { font-size: 2.5rem; width: 2.5rem; height: 2.5rem; color: var(--primary-orange); margin-bottom: 15px; }

    .inquiry-form-section { background: var(--bg-card); padding: 30px; border-radius: 24px; border: 1px solid var(--border-color); max-width: 800px; margin: 0 auto; }
    .inquiry-form-section h3 { margin-bottom: 25px; font-size: 1.5rem; text-align: center; }
    .inquiry-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
    .btn-submit-event { width: 100%; background: var(--primary-orange); color: white; padding: 15px; border: none; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; }
    .btn-submit-event:hover { background: #e67e22; }
    .form-group select { background: #111; border: 1px solid #333; padding: 12px; border-radius: 8px; color: white; font-family: inherit; font-size: 0.95rem; width: 100%; }

  `]
})
export class CustomerDashboardComponent {
    auth = inject(AuthService);
    http = inject(HttpClient);
    queueService = inject(QueueService);
    selectedCategory = 'All';

    showProfileMenu = false;

    logout() {
        this.auth.logout();
    }

    activeTab: 'dashboard' | 'reservation' | 'orders' | 'offers' | 'events' = 'dashboard';

    // Reservation Logic
    selectedTable: any = null;
    bookingStep = 1; // 1: Select Table, 2: Details

    guests = 2;
    bookingDate = new Date().toISOString().split('T')[0];
    bookingTime = '19:00';
    customerName = '';
    customerPhone = '';
    preOrderFood = false;

    // Cart / Orders
    cart: any[] = [];

    // Feature 1: Live Order Tracking
    orderPlaced = false;
    orderStep = 0; // 0: Received, 1: Preparing, 2: Ready, 3: Served
    orderSteps = ['Order Received', 'Preparing', 'Ready to Serve', 'Served'];

    // Feature 2: Smart Service
    showServiceMenu = false;

    // Feature 3: Waitlist
    inQueue = false;
    queuePosition = 0;
    queueWaitTime = 0;

    joinWaitlist() {
        this.queueService.joinQueue().subscribe({
            next: (res: any) => {
                this.inQueue = true;
                this.queuePosition = res.position || Math.floor(Math.random() * 5) + 3;
                this.queueWaitTime = res.waitTime || this.queuePosition * 15;
                alert('Joined the waitlist successfully!');
            },
            error: (err) => {
                console.error(err);
                alert('Failed to join waitlist. Please try again.');
            }
        });
    }

    requestService(type: string) {
        const payload = {
            tableId: this.selectedTable ? this.selectedTable.id : 0, // 0 or null if no table selected yet, but usually service is for a table
            requestType: type
        };

        this.http.post('http://localhost:3000/api/service', payload).subscribe({
            next: () => {
                alert(`${type} request sent to the staff! They will be with you shortly.`);
                this.showServiceMenu = false;
            },
            error: (err) => {
                console.error(err);
                alert('Failed to send request.');
            }
        });
    }

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

    // Events Data
    eventInquiry = {
        type: 'Birthday',
        guests: 50,
        date: '',
        contact: ''
    };

    submitEventInquiry() {
        alert('Thanks! Our event manager will contact you specifically for your ' + this.eventInquiry.type + ' event.');
        this.activeTab = 'dashboard';
    }

    tables = [
        // Window Seats (Left)
        { id: 1, name: 'T1', seats: 2, status: 'available', x: 30, y: 30 },
        { id: 2, name: 'T2', seats: 2, status: 'booked', x: 30, y: 140 },
        { id: 3, name: 'T3', seats: 2, status: 'available', x: 30, y: 250 },
        { id: 4, name: 'T4', seats: 2, status: 'available', x: 30, y: 360 },

        // Center Left
        { id: 5, name: 'T5', seats: 4, status: 'available', x: 150, y: 30 },
        { id: 6, name: 'T6', seats: 4, status: 'available', x: 150, y: 140 },
        { id: 7, name: 'T7', seats: 4, status: 'booked', x: 150, y: 250 },
        { id: 8, name: 'T8', seats: 4, status: 'available', x: 150, y: 360 },

        // Center Right
        { id: 9, name: 'T9', seats: 4, status: 'available', x: 270, y: 80 },
        { id: 10, name: 'T10', seats: 6, status: 'booked', x: 270, y: 200 },
        { id: 11, name: 'T11', seats: 6, status: 'available', x: 270, y: 320 },

        // Private/Large (Right)
        { id: 12, name: 'T12', seats: 6, status: 'available', x: 390, y: 30 },
        { id: 13, name: 'T13', seats: 8, status: 'available', x: 390, y: 150 },
        { id: 14, name: 'VIP', seats: 10, status: 'available', x: 390, y: 300 },
    ];

    selectTable(table: any) {
        if (table.status === 'booked') return;
        this.selectedTable = table;
        this.guests = table.seats; // Default guests to table capacity
    }

    addToCart(item: any) {
        const existing = this.cart.find(c => c.item.name === item.name);
        if (existing) {
            existing.quantity++;
        } else {
            this.cart.push({ item: item, quantity: 1 });
        }
    }

    increaseQty(cartItem: any) {
        cartItem.quantity++;
    }

    decreaseQty(cartItem: any) {
        if (cartItem.quantity > 1) {
            cartItem.quantity--;
        } else {
            this.cart = this.cart.filter(c => c !== cartItem);
        }
    }

    get cartTotal() {
        return this.cart.reduce((total, c) => total + (c.item.price * c.quantity), 0);
    }

    placeOrder() {
        // if (this.cart.length === 0) return; // Allow empty orders or not? User might just want to sit. But usually needs items.

        const payload = {
            tableId: this.selectedTable ? this.selectedTable.id : null,
            items: this.cart,
            totalPrice: this.cartTotal,
            customerId: this.auth.getUser()?.id
        };

        this.http.post('http://localhost:3000/api/orders', payload).subscribe({
            next: (res: any) => {
                // Start Simulation
                this.orderPlaced = true;
                this.orderStep = 0;
                this.cart = [];

                // Simulate progress
                let step = 0;
                const interval = setInterval(() => {
                    step++;
                    this.orderStep = step;
                    if (step >= 3) clearInterval(interval);
                }, 3000);
            },
            error: (err) => {
                console.error(err);
                alert('Failed to place order. Please try again.');
            }
        });
    }

    proceedToBook() {
        if (this.selectedTable) {
            if (this.preOrderFood) {
                // Just switch to dashboard to order food, do not clear selectedTable
                this.activeTab = 'dashboard';
                this.selectedCategory = 'All';
                alert(`Table ${this.selectedTable.name} reserved! Please select items from the menu to add to your pre-order.`);
            } else {
                alert(`Booking confirmed for Table ${this.selectedTable.name} on ${this.bookingDate} at ${this.bookingTime} for ${this.guests} guests.`);
                this.selectedTable = null;
                this.activeTab = 'dashboard';
            }
        }
    }

    categories = [
        { name: 'Starters', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=500&fit=crop' },
        { name: 'Soups & Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop' },
        { name: 'Main Course', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=500&fit=crop' },
        { name: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&h=500&fit=crop' },
        { name: 'Breads & Rotis', image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=500&h=500&fit=crop' },
        { name: 'Desserts', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&h=500&fit=crop' },
        { name: 'Beverages', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&h=500&fit=crop' }
    ];

    allItems = [
        // STARTERS
        { name: 'Sushi Platter', category: 'Starters', price: 450, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500', type: 'non-veg', isSpecial: true },
        { name: 'Chicken Wings', category: 'Starters', price: 280, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500', type: 'non-veg' },
        { name: 'Crispy Calamari', category: 'Starters', price: 320, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500', type: 'non-veg' },
        { name: 'Spring Rolls', category: 'Starters', price: 180, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', type: 'veg' },
        { name: 'Bruschetta', category: 'Starters', price: 220, image: 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=500', type: 'veg' },
        { name: 'Stuffed Mushrooms', category: 'Starters', price: 250, image: 'https://images.unsplash.com/photo-1536184071535-78906f7172c2?w=500', type: 'veg' },
        { name: 'Chicken Satay', category: 'Starters', price: 290, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500', type: 'non-veg' },
        { name: 'Nachos Supreme', category: 'Starters', price: 260, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500', type: 'veg' },

        // SOUPS & SALADS
        { name: 'Caesar Salad', category: 'Soups & Salads', price: 240, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500', type: 'veg' },
        { name: 'Tomato Soup', category: 'Soups & Salads', price: 150, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500', type: 'veg' },
        { name: 'Greek Salad', category: 'Soups & Salads', price: 220, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500', type: 'veg' },

        // MAIN COURSE
        { name: 'Grilled Salmon', category: 'Main Course', price: 550, image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=500', type: 'non-veg', isSpecial: true },
        { name: 'Butter Chicken', category: 'Main Course', price: 380, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500', type: 'non-veg' },
        { name: 'Steak & Fries', category: 'Main Course', price: 650, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500', type: 'non-veg' },
        { name: 'Pasta Alfredo', category: 'Main Course', price: 320, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500', type: 'veg', isSpecial: true },
        { name: 'Veggie Pizza', category: 'Main Course', price: 299, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', type: 'veg' },
        { name: 'Lamb Chops', category: 'Main Course', price: 750, image: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=500', type: 'non-veg' },
        { name: 'Cheese Burger', category: 'Main Course', price: 250, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', type: 'non-veg' },

        // RICE & BIRYANI
        { name: 'Chicken Biryani', category: 'Rice & Biryani', price: 350, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', type: 'non-veg', isSpecial: true },
        { name: 'Veg Pulao', category: 'Rice & Biryani', price: 220, image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=500', type: 'veg' },
        { name: 'Mutton Biryani', category: 'Rice & Biryani', price: 450, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500', type: 'non-veg' },

        // BREADS & ROTIS
        { name: 'Butter Naan', category: 'Breads & Rotis', price: 50, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500', type: 'veg' },
        { name: 'Garlic Naan', category: 'Breads & Rotis', price: 65, image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=500', type: 'veg' },

        // DESSERTS
        { name: 'Chocolate Lava', category: 'Desserts', price: 180, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500', type: 'veg', isSpecial: true },
        { name: 'Cheesecake', category: 'Desserts', price: 210, image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500', type: 'veg' },
        { name: 'Tiramisu', category: 'Desserts', price: 230, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500', type: 'veg' },
        { name: 'Ice Cream Sundae', category: 'Desserts', price: 160, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500', type: 'veg' },
        { name: 'Brownie', category: 'Desserts', price: 140, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500', type: 'veg' },

        // BEVERAGES
        { name: 'Mojito (Non-Alc)', category: 'Beverages', price: 120, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500', type: 'veg' },
        { name: 'Iced Latte', category: 'Beverages', price: 110, image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500', type: 'veg' },
        { name: 'Fresh Orange Juice', category: 'Beverages', price: 130, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500', type: 'veg' },
        { name: 'Berry Smoothie', category: 'Beverages', price: 160, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500', type: 'veg', isSpecial: true },
        { name: 'Cola', category: 'Beverages', price: 60, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500', type: 'veg' }
    ];

    get filteredItems() {
        if (this.selectedCategory === 'All') {
            return this.allItems;
        }
        return this.allItems.filter(item => item.category === this.selectedCategory);
    }

    filterCategory(category: string) {
        this.selectedCategory = category;
    }
}
