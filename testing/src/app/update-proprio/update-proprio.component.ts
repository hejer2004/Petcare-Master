import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-proprio',
  imports: [FormsModule, CommonModule],
  templateUrl: './update-proprio.component.html',
  styleUrl: './update-proprio.component.css',
})
export class UpdateProprioComponent implements OnInit {
  userId: number = 0;
  proprietaire = {
    id_prop: 0,
    nom: '',
    prenom: '',
    num_tel: '',
    sexe: '',
    adresse: '',
    email: '',
    mdp: '',
  };
  message = '';

  constructor(private http: HttpClient,private router : Router) {}

  ngOnInit(): void {
    const userS = localStorage.getItem('user');
    if (userS) {
      const user = JSON.parse(userS);
      this.userId = user.id_prop;
    }
    this.http
      .get(
        'http://localhost:8080/petcare-master/backend/api/getPropriobyId.php?id_prop=' +
          this.userId
      )
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.proprietaire = response.data;
            console.log(this.proprietaire);
          } else {
            this.message = response.message;
          }
        },
        error: () => {
          this.message = 'Erreur lors du chargement des données.';
        },
      });
  }

  updateProprietaire() {
    this.proprietaire.id_prop = this.userId;
    this.http
      .post(
        'http://localhost:8080/petcare-master/backend/api/update_proprio.php',
        this.proprietaire
      )
      .subscribe(
        (response: any) => {
          this.message = response.message;
          this.router.navigate(['/profil']);
        },
        (error) => {
          this.message = 'Erreur lors de la mise à jour.';
        }
      );
  }
}
