import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule, MatIconModule],
  template: `
    <div class="landing-wrapper">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="logo">
          <span class="logo-text">WorldPlate</span>
          <span class="dot">.</span>
        </div>
        <div class="nav-links">
          <a (click)="scrollTo('hero')" [class.active]="activeSection === 'hero'">Home</a>
          <a (click)="scrollTo('menu')" [class.active]="activeSection === 'menu'">Menu</a>
          <a (click)="scrollTo('chefs')" [class.active]="activeSection === 'chefs'">Chefs</a>
          <a (click)="scrollTo('testimonials')" [class.active]="activeSection === 'testimonials'">Reviews</a>
          <a (click)="scrollTo('footer')" [class.active]="activeSection === 'footer'">Contact</a>
        </div>
        <div class="auth-buttons">
            <button class="btn-book" (click)="openReservation()">Book a Table</button>
            <button class="text-btn" (click)="navigateTo('customer')">Sign In</button>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero" id="hero">
        <div class="hero-content">
          <h1 class="hero-title">
            Experience the <br>
            <span class="highlight">Taste</span> of the <br>
            World
          </h1>
          <p class="hero-subtitle">
            From classic favorites to exotic delights, explore a diverse menu 
            inspired by cuisines from across the globe.
          </p>
          
          <div class="cta-group">
            <div class="portal-cta customer" (click)="navigateTo('customer')">
              <div class="icon-circle">
                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop" class="cta-img" alt="Customer">
              </div>
              <div class="text">
                <span class="label">I am a</span>
                <span class="value">Customer</span>
              </div>
            </div>

            <div class="portal-cta manager" (click)="navigateTo('manager')">
              <div class="icon-circle">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" class="cta-img" alt="Manager">
              </div>
              <div class="text">
                <span class="label">I am a</span>
                <span class="value">Manager</span>
              </div>
            </div>
          </div>

          <!-- Floating Info Card -->
          <div class="floating-card">
            <div class="card-left">
              <h3>Great food and lots <br>of discounted prices</h3>
              <div class="avatars">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop" alt="User">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop" alt="User">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop" alt="User">
                <span class="more">+2k</span>
              </div>
              <p class="tiny-text">People grabbed the offer</p>
            </div>
            <div class="card-divider"></div>
            <div class="card-right">
              <span class="percent">50%</span>
              <span class="offer-text">offer on Now</span>
              <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop" class="dish-thumb" alt="Dish">
            </div>
          </div>
        </div>

        <div class="hero-image-wrapper">
          <div class="circle-bg"></div>
          <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop" class="hero-img" alt="Delicious Food">
          
          <div class="floating-leaf leaf-1"></div>
          <div class="floating-leaf leaf-2"></div>
        </div>
      </section>

      <!-- Best Delivered Section -->
      <section class="section best-delivered reveal" id="menu">
        <div class="section-header">
          <h2>Our Best <span class="highlight">Delivered</span></h2>
          <svg class="header-curve" width="100" height="10" viewBox="0 0 100 10">
            <path d="M0 5 Q 50 10 100 5" stroke="#ff5722" stroke-width="2" fill="none"/>
          </svg>
        </div>

        <!-- Menu Filters -->
        <div class="menu-filters">
           <button *ngFor="let cat of categories" 
                   [class.active]="selectedCategory === cat"
                   (click)="selectedCategory = cat">
             {{cat}}
           </button>
        </div>

        <div class="menu-container">
          <!-- Featured Card -->
          <div class="featured-menu-card">
            <div class="plate-image">
               <img src="https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1000&auto=format&fit=crop" alt="Pizza">
               <div class="leaf-deco"></div>
            </div>
            <div class="featured-details">
              <h3>Breakfast Specials</h3>
              <p>Explore our top-rated food categories, crafted to satisfy every craving! From delicious breakfasts</p>
              
              <div class="price-action">
                <span class="price">₹199/-</span>
                <button class="btn-orange">Order Now</button>
              </div>
            </div>
          </div>

          <!-- Menu Grid -->
          <div class="menu-grid">
            <div class="food-item-card" *ngFor="let item of filteredItems">
              <div class="food-img-wrapper">
                 <div class="rotating-plate">
                    <img [src]="item.image" [alt]="item.name">
                 </div>
              </div>
              <div class="food-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.description }}</p>
                <div class="card-footer">
                  <span class="mini-price">{{ item.price }}</span>
                   <button class="btn-small">Order Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="section testimonials reveal" id="testimonials">
        <div class="section-header">
           <h2>What They <span class="highlight">Say?</span></h2>
           <svg class="header-curve" width="100" height="10" viewBox="0 0 100 10">
            <path d="M0 5 Q 50 10 100 5" stroke="#ff5722" stroke-width="2" fill="none"/>
           </svg>
        </div>

        <div class="testimonial-grid">
          <div class="testi-card" *ngFor="let user of [1,2,3]">
            <div class="user-header">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" alt="User">
              <div>
                <h5>John Smith</h5>
                <div class="stars">
                  <mat-icon>star</mat-icon><mat-icon>star</mat-icon><mat-icon>star</mat-icon><mat-icon>star</mat-icon><mat-icon>star</mat-icon>
                </div>
              </div>
            </div>
            <p>"Absolutely loved the flavors! The food was fresh, and the delivery was super fast. Highly recommend!"</p>
          </div>
        </div>
      </section>

      <!-- Chef Section -->
      <section class="section chef-section reveal" id="chefs">
        <div class="section-header">
          <h2>Meet Our <span class="highlight">Chefs</span></h2>
          <svg class="header-curve" width="100" height="10" viewBox="0 0 100 10">
            <path d="M0 5 Q 50 10 100 5" stroke="#ff5722" stroke-width="2" fill="none"/>
          </svg>
        </div>

        <div class="chef-showcase">
          <div class="chef-image">
            <img src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?q=80&w=800&auto=format&fit=crop" alt="Chef">
          </div>
          <div class="chef-bio">
            <p>Our expert chefs bring passion, skill, and creativity to every dish, ensuring an unforgettable dining experience. With years of experience and a love for flavors, they craft each meal to perfection, using only the finest ingredients.</p>
            <button class="btn-outline">View All</button>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer reveal" id="footer">
         <div class="footer-top">
            <div class="brand-col">
              <h3>WorldPlate</h3>
              <p>At WorldPlate, we're always excited to hear from you. Whether you have a project in mind or just want to chat.</p>
              <div class="social-icons">
                 <a href="#"><div class="sc-icon">fb</div></a>
                 <a href="#"><div class="sc-icon">ig</div></a>
                 <a href="#"><div class="sc-icon">in</div></a>
              </div>
            </div>
            <div class="links-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Portfolio</a></li>
              </ul>
            </div>
            <div class="links-col">
              <h4>Quick Links</h4>
              <ul>
                 <li><a href="#">Policy Updates</a></li>
                 <li><a href="#">Party Sharing</a></li>
                 <li><a href="#">Our Rights</a></li>
              </ul>
            </div>
            <div class="newsletter-col">
              <h4>Sign Up Our Newsletter</h4>
              <p>Let's Stay Connected and Collaborate</p>
              <div class="input-wrap">
                <input type="email" placeholder="Enter your email">
                <button>Subscribe Now</button>
              </div>
            </div>
         </div>
         <div class="footer-bottom">
           <p>© 2025 WorldPlate. All Rights Reserved.</p>
         </div>
      </footer>

      <!-- Reservation Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeReservation()">
        <div class="modal-content" (click)="$event.stopPropagation()">
           <div class="modal-header">
             <h2>Book A Table</h2>
             <button class="close-btn" (click)="closeReservation()">&times;</button>
           </div>
           <div class="modal-body">
             <div class="form-group">
               <label>Party Size</label>
               <input type="number" [(ngModel)]="reservationData.partySize" min="1" max="20" placeholder="e.g 4">
             </div>
             <div class="form-group">
               <label>Date & Time</label>
               <input type="datetime-local" [(ngModel)]="reservationData.time">
             </div>
             <button class="btn-orange full-width" (click)="confirmReservation()">Confirm Booking</button>
           </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap');

    :host {
      display: block;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #0b0b0b;
      color: white;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .landing-wrapper {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 8%;
      position: relative;
    }

    /* Navbar */
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px 0;
    }

    .logo-text { font-size: 24px; font-weight: 800; color: #ff9f43; }
    .dot { color: #ff5722; font-size: 30px; line-height: 0; }

    .nav-links { display: flex; gap: 40px; }
    .nav-links a { color: #a0a0a0; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.3s; cursor: pointer; }
    .nav-links a:hover, .nav-links a.active { color: white; }

    .auth-buttons { display: flex; gap: 20px; align-items: center; }
    .auth-buttons .text-btn { background: none; border: none; color: #a0a0a0; cursor: pointer; font-family: inherit; }
    .btn-book { background: #ff5722; color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; font-weight: 600; transition: 0.3s; }
    .btn-book:hover { background: #f44336; }

    /* Hero Section */
    .hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 60px; /* Increased top padding slightly */
      min-height: calc(100vh - 140px);
      position: relative;
      margin-bottom: 120px; /* Added spacing to prevent overlap with floating card */
    }

    .hero-content {
      width: 50%; /* Increased for better text wrapping */
      position: relative;
      z-index: 10;
      padding-bottom: 50px;
    }

    .hero-title {
      font-size: 4rem;
      line-height: 1.1;
      font-weight: 700;
      margin-bottom: 24px;
    }

    .highlight { color: #ff5722; position: relative; display: inline-block; }
    .highlight::after {
      content: ''; position: absolute; bottom: 5px; left: 0; width: 100%; height: 10px;
      background: url('https://upload.wikimedia.org/wikipedia/commons/e/e4/Underline_01.svg') no-repeat center/contain;
      opacity: 0.6;
      filter: invert(53%) sepia(99%) saturate(1637%) hue-rotate(345deg) brightness(98%) contrast(106%);
    }

    .hero-subtitle {
      color: #a0a0a0; font-size: 1.1rem; max-width: 450px; line-height: 1.6; margin-bottom: 40px;
    }

    /* CTA Buttons */
    .cta-group { display: flex; gap: 20px; margin-bottom: 120px; } /* Increased from 100px to 120px */

    .portal-cta {
      display: flex; align-items: center; gap: 15px; padding: 12px 24px 12px 12px;
      border-radius: 50px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
    }
    .portal-cta:hover { transform: translateY(-5px); }
    .portal-cta.customer { background: linear-gradient(135deg, #ff5722, #f44336); box-shadow: 0 10px 30px rgba(244, 67, 54, 0.3); }
    .portal-cta.manager { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); }

    .icon-circle { width: 40px; height: 40px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #333; overflow: hidden; }
    .cta-img { width: 100%; height: 100%; object-fit: cover; }
    .portal-cta.manager .icon-circle { background: rgba(255,255,255,0.2); color: white; }

    .text { display: flex; flex-direction: column; }
    .label { font-size: 0.7rem; opacity: 0.8; text-transform: uppercase; }
    .value { font-weight: 700; font-size: 1rem; }

    /* Floating Card */
    .floating-card {
      position: absolute; bottom: -50px; left: 0; /* Pushed down further */
      background: rgba(26, 26, 26, 0.95); padding: 15px 25px; border-radius: 40px;
      display: flex; align-items: center; gap: 30px; width: fit-content;
      border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      animation: float 6s ease-in-out infinite; backdrop-filter: blur(10px); z-index: 20;
    }

    .card-left h3 { margin: 0 0 10px 0; font-size: 0.9rem; color: white; }
    .avatars { display: flex; align-items: center; }
    .avatars img { width: 30px; height: 30px; border-radius: 50%; border: 2px solid #1a1a1a; margin-right: -10px; }
    .more { width: 30px; height: 30px; border-radius: 50%; background: #ff5722; color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; border: 2px solid #1a1a1a; position: relative; z-index: 2; }
    .tiny-text { font-size: 0.7rem; color: #888; margin-top: 5px; }

    .card-divider { width: 1px; height: 50px; background: #333; }
    .card-right { display: flex; align-items: center; gap: 15px; }
    .percent { font-size: 1.8rem; font-weight: 800; color: white; }
    .offer-text { width: 60px; font-size: 0.7rem; line-height: 1.2; color: #aaa; }
    .dish-thumb { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #ff5722; }

    /* Hero Image */
    .hero-image-wrapper {
      width: 55%; height: 100%; position: relative;
      display: flex; justify-content: flex-end; align-items: center;
    }

    .circle-bg {
      position: absolute; width: 450px; height: 450px; border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.05); top: 50%; right: 0; transform: translate(0, -50%); z-index: 1;
    }

    .hero-img {
      width: 400px; height: 400px; object-fit: cover; border-radius: 50%; position: relative;
      z-index: 2; box-shadow: 0 0 80px rgba(0,0,0,0.5); animation: spin-slow 60s linear infinite;
      margin-right: 25px;
      margin-top: -100px; /* Moved up to align with text */
    }

    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    /* General Section Styles */
    .section { margin-bottom: 100px; opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
    .section.visible { opacity: 1; transform: translateY(0); }
    
    .section-header { text-align: center; margin-bottom: 60px; position: relative; }
    .section-header h2 { font-size: 2.5rem; margin-bottom: 10px; }
    .header-curve { margin-top: -10px; display: inline-block; }

    /* Buttons */
    .btn-orange {
      background: #ff5722; color: white; border: none; padding: 10px 25px; border-radius: 30px;
      font-weight: 600; cursor: pointer; transition: 0.3s;
    }
    .btn-orange:hover { background: #f44336; transform: scale(1.05); }

    .btn-icon {
      background: rgba(255,255,255,0.1); color: white; border: none; width: 40px; height: 40px;
      border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;
      border: 1px solid rgba(255,255,255,0.1); transition: 0.3s;
    }
    .btn-icon:hover { background: #ff5722; border-color: #ff5722; }

    /* Best Delivered */
    .menu-container { display: flex; gap: 40px; align-items: center; justify-content: center; flex-wrap: wrap; }
    
    .featured-menu-card {
      background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
      border-radius: 40px; padding: 30px; width: 400px;
      border: 1px solid rgba(255,255,255,0.05); position: relative;
    }
    .plate-image {
      width: 100%; height: 200px; margin-bottom: 20px; border-radius: 20px; overflow: hidden;
      position: relative;
    }
    .plate-image img { width: 100%; height: 100%; object-fit: cover; }
    .featured-details h3 { font-size: 1.5rem; margin-bottom: 15px; }
    .featured-details p { color: #888; font-size: 0.9rem; line-height: 1.6; margin-bottom: 25px; }
    .price-action { display: flex; align-items: center; justify-content: space-between; }
    .price { font-size: 1.5rem; font-weight: 700; color: #ff5722; }

    /* Filters */
    .menu-filters { display: flex; justify-content: center; gap: 15px; margin-bottom: 40px; }
    .menu-filters button {
      background: transparent; border: 1px solid #333; color: #888; padding: 8px 25px;
      border-radius: 30px; cursor: pointer; transition: 0.3s; font-family: inherit;
    }
    .menu-filters button.active, .menu-filters button:hover {
      background: #ff5722; color: white; border-color: #ff5722;
    }

    /* Menu Grid */
    .menu-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .food-item-card {
      background: #121212; border-radius: 20px; padding: 15px; width: 220px;
      border: 1px solid rgba(255,255,255,0.05); text-align: center;
      transition: 0.3s;
    }
    .food-item-card:hover { transform: translateY(-5px); background: #161616; }
    .food-img-wrapper { margin-bottom: 15px; display: flex; justify-content: center; }
    .rotating-plate img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; animation: spin-slow 20s linear infinite; }
    .food-info h4 { font-size: 1rem; margin-bottom: 8px; }
    .food-info p { font-size: 0.7rem; color: #666; margin-bottom: 15px; height: 30px; overflow: hidden; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; }
    .mini-price { color: #fff; font-weight: 700; }
    .btn-small {
       background: transparent; border: 1px solid #ff5722; color: #ff5722;
       padding: 5px 15px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; cursor: pointer; transition: 0.3s;
    }
    .btn-small:hover { background: #ff5722; color: white; }

    /* Testimonials */
    .testimonial-grid { display: flex; gap: 30px; justify-content: center; flex-wrap: wrap; }
    .testi-card {
      background: #111; padding: 25px; border-radius: 20px; width: 300px;
      border: 1px solid #222; position: relative;
    }
    .user-header { display: flex; gap: 15px; align-items: center; margin-bottom: 20px; }
    .user-header img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; }
    .user-header h5 { margin: 0 0 5px 0; font-size: 1rem; }
    .stars mat-icon { font-size: 14px; width: 14px; height: 14px; color: #ff5722; }
    .testi-card p { color: #888; font-size: 0.85rem; line-height: 1.6; font-style: italic; }

    /* Chefs */
    .chef-showcase {
      display: flex; align-items: center; justify-content: center; gap: 50px;
      background: linear-gradient(90deg, #111 0%, #0b0b0b 100%);
      padding: 40px; border-radius: 40px; max-width: 900px; margin: 0 auto;
      border: 1px solid rgba(255,255,255,0.05);
    }
    .chef-image img { width: 300px; height: 400px; object-fit: cover; border-radius: 20px; }
    .chef-bio { max-width: 400px; }
    .chef-bio p { color: #aaa; line-height: 1.8; margin-bottom: 30px; }
    .btn-outline {
      background: transparent; border: 1px solid #ff5722; color: #ff5722;
      padding: 10px 30px; border-radius: 30px; cursor: pointer; font-weight: 600;
    }
    .btn-outline:hover { background: #ff5722; color: white; }

    /* Footer */
    .footer { background: #050505; border-top: 1px solid #1a1a1a; padding: 80px 0 20px; margin-top: 100px; }
    .footer-top { display: flex; justify-content: space-between; max-width: 1200px; margin: 0 auto 50px; padding: 0 20px; flex-wrap: wrap; gap: 40px; }
    .brand-col { max-width: 300px; }
    .brand-col h3 { color: #ff9f43; font-size: 1.5rem; margin-bottom: 20px; }
    .brand-col p { color: #666; font-size: 0.85rem; line-height: 1.6; margin-bottom: 20px; }
    .social-icons { display: flex; gap: 10px; }
    .sc-icon { width: 35px; height: 35px; background: #222; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.8rem; }
    
    .links-col h4 { margin-bottom: 25px; font-size: 1.1rem; }
    .links-col ul { list-style: none; padding: 0; }
    .links-col li { margin-bottom: 12px; }
    .links-col a { color: #888; text-decoration: none; font-size: 0.9rem; transition: 0.3s; }
    .links-col a:hover { color: #ff5722; }

    .newsletter-col { max-width: 300px; }
    .newsletter-col h4 { margin-bottom: 20px; }
    .newsletter-col p { color: #666; font-size: 0.85rem; margin-bottom: 20px; }
    .input-wrap { display: flex; background: #1a1a1a; border-radius: 30px; padding: 5px; border: 1px solid #333; }
    .input-wrap input { background: none; border: none; padding: 10px 15px; color: white; outline: none; flex: 1; font-size: 0.9rem; }
    .input-wrap button { background: #ff5722; color: white; border: none; padding: 8px 20px; border-radius: 25px; cursor: pointer; font-size: 0.8rem; font-weight: 600; }

    .footer-bottom { text-align: center; border-top: 1px solid #1a1a1a; padding-top: 30px; color: #444; font-size: 0.8rem; }

    /* Modal */
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); z-index: 1000;
      display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(5px);
    }
    .modal-content {
      background: #1a1a1a; padding: 30px; border-radius: 20px; width: 400px;
      border: 1px solid #333; position: relative;
    }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .modal-header h2 { margin: 0; color: #fff; }
    .close-btn { background: none; border: none; color: #666; font-size: 2rem; cursor: pointer; }
    .close-btn:hover { color: white; }
    
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; color: #bbb; margin-bottom: 8px; font-size: 0.9rem; }
    .form-group input { 
       width: 100%; background: #0b0b0b; border: 1px solid #333; padding: 12px;
       border-radius: 10px; color: white; outline: none; box-sizing: border-box;
    }
    .full-width { width: 100%; margin-top: 10px; }
  `]
})
export class LandingPageComponent implements AfterViewInit {
  @ViewChildren('reveal') revealElements!: QueryList<ElementRef>;

  constructor(private router: Router) { }

  categories = ['All', 'Pizza', 'Sides', 'Drinks'];
  selectedCategory = 'All';
  activeSection = 'hero';
  showModal = false;
  reservationData = { partySize: 2, time: '' };

  foodItems = [
    { name: 'Margherita Pizza', category: 'Pizza', description: 'Classic cheese and tomato base', price: '₹149/-', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=400&fit=crop' },
    { name: 'Spicy Pepperoni', category: 'Pizza', description: 'Pepperoni with extra cheese & spice', price: '₹199/-', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=400&fit=crop' },
    { name: 'Veggie Supreme', category: 'Pizza', description: 'Loaded with bell peppers & olives', price: '₹179/-', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&fit=crop' },
    { name: 'BBQ Chicken', category: 'Pizza', description: 'Grilled chicken with smoky BBQ', price: '₹249/-', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&fit=crop' },
    { name: 'Garlic Bread', category: 'Sides', description: 'Crispy buttery garlic bread sticks', price: '₹99/-', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400&fit=crop' },
    { name: 'Coca Cola', category: 'Drinks', description: 'Chilled refreshing classic coke', price: '₹49/-', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&fit=crop' }
  ];

  get filteredItems() {
    return this.selectedCategory === 'All'
      ? this.foodItems
      : this.foodItems.filter(item => item.category === this.selectedCategory);
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  scrollTo(id: string) {
    this.activeSection = id;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openReservation() { this.showModal = true; }
  closeReservation() { this.showModal = false; }

  confirmReservation() {
    alert(`Reservation requested for ${this.reservationData.partySize} people at ${this.reservationData.time}`);
    this.closeReservation();
  }

  navigateTo(portal: 'customer' | 'manager') {
    if (portal === 'customer') {
      this.router.navigate(['/login'], { queryParams: { role: 'Customer' } });
    } else {
      this.router.navigate(['/login'], { queryParams: { role: 'Manager' } });
    }
  }
}
