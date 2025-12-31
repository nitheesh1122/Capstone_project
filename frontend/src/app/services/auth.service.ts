import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';
    private http = inject(HttpClient);
    private router = inject(Router);

    private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
    user$ = this.userSubject.asObservable();

    constructor() { }

    private getUserFromStorage() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    register(data: any) {
        return this.http.post(`${this.apiUrl}/register`, data).pipe(
            tap((res: any) => {
                if (res.token) {
                    localStorage.setItem('token', res.token);
                    // For register, we might not get the user object back depending on API, 
                    // but usually it returns token. The Component handles redirection.
                }
            })
        );
    }

    login(data: any) {
        return this.http.post(`${this.apiUrl}/login`, data).pipe(
            tap((res: any) => {
                localStorage.setItem('token', res.token);
                localStorage.setItem('user', JSON.stringify(res.user));
                this.userSubject.next(res.user);
            })
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isLoggedIn() {
        return !!localStorage.getItem('token');
    }

    getUser() {
        return this.getUserFromStorage();
    }
}
