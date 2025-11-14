import { Component, OnInit } from '@angular/core';
import { PetService } from '../pet.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-animal',
  templateUrl: './add-animal.component.html',
  styleUrls: ['./add-animal.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AddAnimalComponent implements OnInit {
  especes: any[] = [];
  animal: any = {
    id_prop: 1,
    espece: '',
    nom: '',
    date_nais: '',
    sexe: 'M',
    race: '',
    couleur: '',
    poids: '',
    signe_particulier: '',
    sterilisation: false,
  };

  constructor(private petService: PetService, private http: HttpClient,private router:Router) {}

  ngOnInit() {
    const userS = localStorage.getItem('user');
    if (userS) {
      const user = JSON.parse(userS);
      this.animal.id_prop = user.id_prop;
    }
    this.http
      .get<any>('http://localhost:8080/petcare-master/backend/api/get_especes.php')
      .subscribe((response) => {
        if (response.success) {
          this.especes = response.data;
        } else {
          console.error(
            'Erreur lors de la récupération des espèces:',
            response.message
          );
        }
      });
  }

  onSubmit() {
    this.petService.addAnimal(this.animal).subscribe(
      (response) => {
        if (response.success || response.message === 'success') {
          alert('Animal ajouté avec succès !');
          this.router.navigate(['/pet-page']);
        } else {
          alert("Erreur lors de l'ajout : " + response.message);
        }
      },
      (error) => {
        alert('Erreur de connexion au serveur.');
      }
    );
  }
}
