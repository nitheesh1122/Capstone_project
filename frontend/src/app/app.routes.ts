import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { QueueManagementComponent } from './components/queue-management/queue-management.component';
import { LandingPageComponent } from './components/landing/landing.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'manager', component: ManagerDashboardComponent },
    { path: 'customer-dashboard', component: CustomerDashboardComponent },
    { path: 'tables', component: TableListComponent },
    { path: 'queue', component: QueueManagementComponent },
    { path: '**', redirectTo: '' }
];
