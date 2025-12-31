import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class QueueService {
    private apiUrl = 'http://localhost:3000/api/queue';
    private http = inject(HttpClient);

    joinQueue() { return this.http.post(`${this.apiUrl}/join`, {}); }
    getQueueStatus() { return this.http.get<any>(`${this.apiUrl}/status`); }
    leaveQueue() { return this.http.post(`${this.apiUrl}/leave`, {}); }
}
