import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-customer-dashboard',
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
          <a class="nav-item active"><mat-icon>dashboard</mat-icon> Dashboard</a>
          <a class="nav-item"><mat-icon>search</mat-icon> Search Food</a>
          <a class="nav-item"><mat-icon>store</mat-icon> Restaurants</a>
          <a class="nav-item"><mat-icon>receipt_long</mat-icon> My Orders</a>
          <a class="nav-item"><mat-icon>favorite</mat-icon> Favorites</a>
          <a class="nav-item"><mat-icon>account_balance_wallet</mat-icon> Payments</a>
          <a class="nav-item"><mat-icon>local_offer</mat-icon> Offers & Coupons</a>
          <a class="nav-item"><mat-icon>card_giftcard</mat-icon> Refer & Earn</a>
        </nav>

        <div class="upgrade-card">
          <mat-icon>lock</mat-icon>
          <div class="upgrade-text">
            <h4>Unlock New Features</h4>
            <p>& Maximize Your Food Delivery Experience</p>
            <button class="btn-upgrade">Upgrade</button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Header -->
        <header class="top-header">
          <h1>Dashboard</h1>
          <div class="header-actions">
            <div class="search-bar">
              <mat-icon>search</mat-icon>
              <input type="text" placeholder="Search here...">
            </div>
            <button class="icon-btn"><mat-icon>notifications</mat-icon></button>
            <div class="user-profile">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User">
              <span>Hazel Newberg</span>
            </div>
          </div>
        </header>

        <!-- Banners Section -->
        <div class="banners-grid">
            <!-- Welcome Banner -->
            <div class="welcome-banner">
                <div class="banner-content">
                    <span class="tag">Deal of the weekend</span>
                    <h2>Hello, Hazel Newberg</h2>
                    <p>Get FREE delivery on every weekend.</p>
                    <button class="btn-check-menu">Check Menu</button>
                </div>
                <div class="banner-img">
                   <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400" alt="Dish">
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
                <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300" class="burger-img" alt="Burger">
            </div>
        </div>

        <!-- Food Menu Categories -->
        <div class="section-title">
          <h3>Menu Category</h3>
          <a href="#" class="view-all">View All <mat-icon>chevron_right</mat-icon></a>
        </div>
        
        <div class="categories-row">
            <div class="cat-item" *ngFor="let cat of categories">
              <div class="cat-img">
                 <img [src]="cat.image">
              </div>
              <span>{{ cat.name }}</span>
              <button class="cat-btn"><mat-icon>chevron_right</mat-icon></button>
            </div>
        </div>

        <!-- Trending Items -->
        <div class="section-title">
           <h3>Trending Orders</h3>
           <a href="#" class="view-all">View All <mat-icon>chevron_right</mat-icon></a>
        </div>
        
        <div class="trending-grid">
           <div class="trend-card" *ngFor="let item of trendingItems">
              <div class="trend-info">
                 <span class="week-tag">Top of the week</span>
                 <h4>{{ item.name }}</h4>
                 <div class="price-add">
                    <span class="price">\${{ item.price }}</span>
                    <button class="add-btn">+</button>
                 </div>
              </div>
              <img [src]="item.image" class="trend-img">
           </div>
        </div>
      </main>

      <!-- Right Panel: Cart -->
      <aside class="right-panel">
         <div class="panel-header">
            <h3>My Cart</h3>
         </div>

         <div class="cart-items-list">
            <div class="cart-item" *ngFor="let item of cartItems">
               <img [src]="item.image" class="item-thumb">
               <div class="item-details">
                  <h4>{{ item.name }}</h4>
                  <span class="item-price">\${{ item.price }} x {{ item.qty }}</span>
               </div>
               <div class="qty-controls">
                  <button class="qty-btn">-</button>
                  <span>{{ item.qty }}</span>
                  <button class="qty-btn add">+</button>
               </div>
            </div>
         </div>

         <div class="checkout-section">
             <div class="total-row">
                <span>Total:</span>
                <span class="total-price">$45.88</span>
             </div>
             <button class="btn-checkout">Checkout</button>
         </div>

         <div class="quick-categories">
            <h4>Categories <a href="#" class="tiny-link">View All ></a></h4>
            <div class="tags">
                <span class="tag">Pasta</span>
                <span class="tag">Pizza</span>
                <span class="tag">Burgers</span>
                <span class="tag">Sandwiches</span>
                <span class="tag">Indian Cuisine</span>
                <span class="tag">Desserts</span>
            </div>
         </div>
      </aside>

    </div>
  `,
    styles: [`
    :host {
      --primary-orange: #ff9f43; /* Lighter orange from Image 1 */
      --primary-dark: #2d3436;
      --bg-light: #f5f6fa;
      --sidebar-width: 260px;
      --right-panel-width: 320px;
      display: block;
      height: 100vh;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg-light);
      color: #333;
    }

    .dashboard-container { display: flex; height: 100%; }

    /* Sidebar reuse standard styles */
    .sidebar {
      width: var(--sidebar-width);
      background: white;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #eee;
    }
    .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 40px; color: #ff5722; }
    .logo h2 { font-size: 1.2rem; margin: 0; font-weight: 800; color: #333; }
    .logo-icon { font-size: 2rem; width: 2rem; height: 2rem; }

    .side-nav { display: flex; flex-direction: column; gap: 10px; flex: 1; }
    .nav-item {
       display: flex; align-items: center; gap: 15px; padding: 12px 15px;
       color: #888; text-decoration: none; border-radius: 12px; cursor: pointer;
       font-weight: 500; transition: 0.2s; font-size: 0.9rem;
    }
    .nav-item:hover, .nav-item.active { background: #fff0e9; color: #ff5722; }
    .nav-item mat-icon { font-size: 1.2rem; }

    .upgrade-card {
       background: linear-gradient(135deg, #ff9f43, #ff5722);
       color: white; padding: 20px; border-radius: 20px; text-align: center;
       position: relative; margin-top: 20px;
    }
    .upgrade-card mat-icon { font-size: 3rem; width: 3rem; height: 3rem; opacity: 0.2; position: absolute; top: 10px; right: 10px; }
    .upgrade-text h4 { margin: 0 0 5px 0; font-size: 0.9rem; }
    .upgrade-text p { font-size: 0.7rem; opacity: 0.9; margin-bottom: 15px; }
    .btn-upgrade { background: white; color: #ff5722; border: none; padding: 6px 15px; border-radius: 20px; font-weight: 600; cursor: pointer; }

    /* Main Content */
    .main-content { flex: 1; padding: 30px; overflow-y: auto; }
    .top-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .header-actions { display: flex; gap: 20px; align-items: center; }
    .search-bar { background: white; border-radius: 25px; padding: 8px 15px; display: flex; align-items: center; border: 1px solid #eee; width: 300px; }
    .search-bar input { border: none; outline: none; margin-left: 10px; width: 100%; }
    .icon-btn { background: white; border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #666; cursor: pointer; }
    .user-profile { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 0.9rem; }
    .user-profile img { width: 35px; height: 35px; border-radius: 50%; object-fit: cover; }

    /* Banners */
    .banners-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 30px; }
    
    .welcome-banner {
        background: #1e1e1e; color: white; border-radius: 20px; padding: 30px;
        position: relative; overflow: hidden; display: flex; justify-content: space-between; align-items: center;
    }
    .banner-content { z-index: 2; max-width: 60%; }
    .tag { background: #ff9f43; color: white; padding: 4px 10px; border-radius: 10px; font-size: 0.7rem; font-weight: 600; display: inline-block; margin-bottom: 10px; }
    .banner-content h2 { font-size: 1.8rem; margin: 0 0 10px 0; }
    .banner-content p { color: #aaa; margin-bottom: 20px; font-size: 0.9rem; }
    .btn-check-menu { background: #ff9f43; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 600; cursor: pointer; }
    .banner-img img { position: absolute; right: -20px; top: 50%; transform: translateY(-50%); width: 250px; border-radius: 50%; object-fit: cover; }

    .discount-banner {
        background: #ff9f43; color: white; border-radius: 20px; padding: 25px;
        position: relative; overflow: hidden;
    }
    .disc-content { position: relative; z-index: 2; }
    .disc-content h2 { font-size: 2rem; margin: 0; }
    .disc-content p { margin: 5px 0 20px; font-size: 0.8rem; opacity: 0.9; }
    .progress-dots { display: flex; gap: 5px; }
    .dot { width: 20px; height: 3px; background: rgba(255,255,255,0.4); border-radius: 2px; }
    .dot.active { background: white; }
    .burger-img { position: absolute; right: -40px; bottom: -40px; width: 200px; transform: rotate(-15deg); }

    /* Categories */
    .section-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .view-all { display: flex; align-items: center; color: #ff9f43; text-decoration: none; font-size: 0.85rem; font-weight: 600; }
    
    .categories-row { display: flex; justify-content: space-between; gap: 15px; margin-bottom: 30px; }
    .cat-item { 
        background: white; padding: 15px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; gap: 10px;
        flex: 1; border: 1px solid white; transition: 0.2s; cursor: pointer;
    }
    .cat-item:hover { border-color: #ff9f43; box-shadow: 0 5px 15px rgba(255,159,67,0.15); }
    .cat-img { width: 70px; height: 70px; border-radius: 50%; overflow: hidden; margin-bottom: 5px; }
    .cat-img img { width: 100%; height: 100%; object-fit: cover; }
    .cat-item span { font-weight: 600; font-size: 0.9rem; }
    .cat-btn { width: 24px; height: 24px; border-radius: 50%; background: #f5f5f5; border: none; display: flex; align-items: center; justify-content: center; color: #ccc; }
    .cat-item:hover .cat-btn { background: #ff9f43; color: white; }

    /* Trending */
    .trending-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
    .trend-card { background: white; padding: 15px; border-radius: 20px; display: flex; align-items: center; gap: 15px; border: 1px solid #eee; }
    .week-tag { font-size: 0.65rem; color: #999; display: block; margin-bottom: 5px; }
    .trend-info { flex: 1; }
    .card-title { font-size: 0.9rem; font-weight: 700; margin: 0 0 10px 0; }
    .price-add { display: flex; align-items: center; justify-content: space-between; }
    .price { font-weight: 700; color: #333; }
    .add-btn { width: 24px; height: 24px; border-radius: 50%; background: #fff0e9; color: #ff5722; border: none; cursor: pointer; font-weight: bold; }
    .trend-img { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; }

    /* Right Panel */
    .right-panel { width: var(--right-panel-width); background: white; border-left: 1px solid #eee; padding: 30px 25px; display: flex; flex-direction: column; }
    .panel-header h3 { margin: 0 0 30px 0; }
    
    .cart-items-list { flex: 1; overflow-y: auto; margin-bottom: 20px; }
    .cart-item { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
    .item-thumb { width: 50px; height: 50px; border-radius: 12px; object-fit: cover; }
    .item-details { flex: 1; }
    .item-details h4 { margin: 0 0 5px 0; font-size: 0.9rem; }
    .item-price { font-size: 0.8rem; color: #888; font-weight: 600; }
    .qty-controls { display: flex; align-items: center; gap: 8px; background: #f5f5f5; padding: 4px 8px; border-radius: 15px; }
    .qty-btn { width: 20px; height: 20px; background: white; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; font-weight: bold; }
    .qty-btn.add { background: #ff9f43; color: white; }
    
    .checkout-section { border-top: 1px dashed #eee; padding-top: 20px; margin-bottom: 40px; }
    .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-weight: 700; font-size: 1.1rem; }
    .btn-checkout { width: 100%; background: #ff9f43; color: white; border: none; padding: 15px; border-radius: 15px; font-weight: 600; cursor: pointer; transition: 0.2s; }
    .btn-checkout:hover { background: #e58e3c; }

    .quick-categories h4 { font-size: 0.9rem; margin-bottom: 15px; display: flex; justify-content: space-between; }
    .tiny-link { font-size: 0.7rem; color: #aaa; text-decoration: none; }
    .tags { display: flex; flex-wrap: wrap; gap: 10px; }
    .tag { border: 1px solid #eee; padding: 6px 12px; border-radius: 20px; font-size: 0.7rem; color: #666; cursor: pointer; }
    .tag:hover { border-color: #ff9f43; color: #ff9f43; }

  `]
})
export class CustomerDashboardComponent {
    categories = [
        { name: 'Starters', image: 'https://images.unsplash.com/photo-1541529086526-db283bf936d3?w=100' },
        { name: 'Soups & Salads', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100' },
        { name: 'Main Course', image: 'https://images.unsplash.com/photo-1574484284004-4732dc71c573?w=100' },
        { name: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100' },
        { name: 'Breads & Rotis', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=100' }
    ];

    trendingItems = [
        { name: 'Sushi Platter', price: 18.75, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100' },
        { name: 'Caesar Salad', price: 15.20, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100' },
        { name: 'Pancake Combo', price: 12.40, image: 'https://images.unsplash.com/photo-1554520158-95f9686a3861?w=100' },
        { name: 'Cheese Burger', price: 22.04, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100' },
    ];

    cartItems = [
        { name: 'Veggie Burger', price: 15.20, qty: 1, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100' },
        { name: 'Grilled Chicken', price: 12.40, qty: 3, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100' },
        { name: 'Pepperoni Pizza', price: 18.75, qty: 2, image: 'https://images.unsplash.com/photo-1574484284004-4732dc71c573?w=100' }
    ];
}
