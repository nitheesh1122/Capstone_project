import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TableService {
    private apiUrl = 'http://localhost:3000/api/tables';
    private http = inject(HttpClient);

    getTables() { return this.http.get<any[]>(this.apiUrl); }
    addTable(table: any) { return this.http.post(this.apiUrl, table); }
    updateTable(id: number, data: any) { return this.http.put(`${this.apiUrl}/${id}`, data); }
    deleteTable(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }
}
