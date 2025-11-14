import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthentService {
  private baseUrl = 'http://localhost:8080/petcare-master/backend/api';

  constructor(private http: HttpClient) {}

  login(email: string, mdp: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login.php`, {
      email: email,
      mdp: mdp,
    });
  }

  signup(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signup.php`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  isLoggedIn() {
    let ls = localStorage.getItem('user');
    if (ls) {
      return true;
    } else {
      return false;
    }
  }
}
