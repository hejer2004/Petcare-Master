import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PetService } from '../pet.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-rdv',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-rdv.component.html',
  styleUrl: './add-rdv.component.css',
})
export class AddRdvComponent implements OnInit {
  pets: any[] = [];
  selectedPetId: number = 0;
  rendezVous = {
    id_animal: 0,
    veterinaire: '',
    lieux: '',
    date: '',
  };
  constructor(
    private router: Router,
    private http: HttpClient,
    private petService: PetService
  ) {}

  ngOnInit() {
    this.loadPets();
  }
  loadPets(): void {
    let ownerId: number = 0;
    const userS = localStorage.getItem('user');
    if (userS) {
      const user = JSON.parse(userS);
      ownerId = user.id_prop;
    }
    this.http
      .get<any>(
        `http://localhost:8080/petcare-master/backend/api/get_animal.php?id_prop=${ownerId}`
      )
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.pets = res.data;
            console.log(this.pets);
            if (this.pets.length > 0) {
              this.selectedPetId = this.pets[0].id_animal;
            }
          }
        },
        error: (err) => {
          console.error('Error loading pets:', err);
          // Handle error (show message to user)
        },
      });
  }
  onSubmit() {
    this.rendezVous.id_animal = this.selectedPetId;
    console.log(this.rendezVous);
    this.petService.addRendezVous(this.rendezVous).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Rendez-vous ajouté avec succès !');
          this.router.navigate(['/pet-page']);
        } else {
          alert("Erreur lors de l'ajout du rendez-vous.");
        }
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout du rendez-vous:", err);
        alert('Erreur serveur.');
      },
    });
  }
}
