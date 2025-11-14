import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetService } from '../pet.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-animal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-animal.component.html',
  styleUrls: ['./update-animal.component.css'],
})
export class UpdateAnimalComponent implements OnInit {
  idAnimal: string | null = null;
  animal: any = {
    id_animal: null,
    espece: '',
    nom: '',
    date_nais: '',
    sexe: '',
    race: '',
    couleur: '',
    poids: 0,
    sterilisation: 0,
    id_prop: null,
    signe: '',
  };
  especes: any[] = [];
  message: string = '';
  constructor(
    private petService: PetService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.idAnimal = this.route.snapshot.paramMap.get('id');
    console.log('ID récupéré depuis URL:', this.idAnimal);

    if (this.idAnimal) {
      this.animal.id_animal = this.idAnimal;
      console.log('ID assigné à animal:', this.animal.id_animal);
    }
    this.http
      .get<any>(
        `http://localhost:8080/petcare-master/backend/api/getAnimalById.php?id_animal=${this.idAnimal}`
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.animal = response.data;
            console.log(this.animal);
          } else {
            console.log(
              'Erreur lors de recuperation de données à modifier',
              response.message
            );
          }
        },
      });

    this.http
      .get<any>('http://localhost:8080/petcare-master/backend/api/get_especes.php')
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.especes = response.data;
          } else {
            console.error(
              'Erreur lors de la récupération des espèces:',
              response.message
            );
          }
        },
        error: (err) => {
          console.error('Erreur HTTP :', err);
        },
      });
  }

  updateAnimal() {
    const animalData = this.animal ;

    console.log('Données envoyées:', animalData); // Vérifiez ce qui est envoyé

    this.petService.updateAnimal(animalData).subscribe({
      next: (res) => {
        console.log('Réponse complète:', res); // Ajoutez ce log
        if (res.success) {
          this.message = res.message;
          this.router.navigate(['/pet-page']);
        } else {
          this.message = res.message || 'Erreur du serveur';
        }
      },
      error: (err) => {
        console.error('Erreur complète:', err); // Log complet de l'erreur
        this.message = err.error?.message || 'Erreur lors de la mise à jour';
      },
    });
  }
}
