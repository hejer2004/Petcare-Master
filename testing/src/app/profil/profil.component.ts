import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css',
})
export class ProfilComponent implements OnInit {
  user: any;
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    let userId: number = 0;
    const userS = localStorage.getItem('user');
    if (userS) {
      const user = JSON.parse(userS);
      userId = user.id_prop;
    }
    this.fetchUser(userId);
  }

  fetchUser(userId: number): void {
    this.http
      .get<any>(
        `http://localhost:8080/petcare-master/backend/api/get_proprio.php?id_prop=${userId}`
      )
      .subscribe((response) => {
        if (response.message === 'success') {
          this.user = response.data;
          console.log(this.user);
        }
      });
  }
}
