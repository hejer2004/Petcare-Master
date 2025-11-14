import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { PetService } from '../pet.service';
import { FormsModule } from '@angular/forms';
import { AuthentService } from '../authent.service';

@Component({
  selector: 'app-pet-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './pet-page.component.html',
  styleUrls: ['./pet-page.component.css'],
})
export class PetPageComponent implements OnInit {
  isLoggedin: Boolean | undefined;
  pets: any[] = [];
  selectedPet: any = null;
  selectedPetId: number = 0;

  constructor(
    private router: Router,
    private http: HttpClient,
    private petService: PetService,
    private authenService: AuthentService
  ) {}

  ngOnInit(): void {
    this.isLoggedin = this.authenService.isLoggedIn();
    if (!this.isLoggedin) {
      this.router.navigate(['/login']);
      return;
    }
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
            if (this.pets.length > 0) {
              this.selectedPetId = this.pets[0].id_animal;
              this.selectPet(this.selectedPetId);
            } else {
              this.router.navigate(['/add-animal']);
            }
          }
        },
        error: (err) => {
          console.error('Error loading pets:', err);
        },
      });
  }

  selectPet(id: number): void {
    const pet = this.pets.find((p) => p.id_animal === id);
    if (pet) {
      this.selectedPet = pet;
      this.loadPetDetails(id);

       //hejer
      // Stocker l'id de l'animal sélectionné dans le localStorage
      localStorage.setItem('selected_animal_id', id.toString());

      console.log(this.selectedPet);
    }
  }

  loadPetDetails(id: number): void {
    this.http
      .get<any>(
        `http://localhost:8080/petcare-master/backend/api/get_pet_info.php?id_animal=${id}`
      )
      .subscribe({
        next: (res) => {
          if (res.message === 'success' && res.data) {
            this.selectedPet = res.data;
            console.log(this.selectedPet);
          }
        },
        error: (err) => {
          console.error('Error loading pet details:', err);
        },
      });
  }

  deletePet(): void {
    if (this.selectedPet) {
      const petId = this.selectedPet.id_animal;

      if (confirm('Êtes-vous sûr de vouloir supprimer cet animal ?')) {
        // Use the service method instead of direct HTTP call
        this.petService.deleteAnimal(petId).subscribe({
          next: (res) => {
            if (res.success) {
              // Remove pet from array after successful deletion
              this.pets = this.pets.filter((p) => p.id_animal !== petId);

              // Select another pet if available
              if (this.pets.length > 0) {
                this.selectPet(this.pets[0].id_animal);
              } else {
                this.selectedPet = null;
              }

              alert('Animal supprimé avec succès');
            } else {
              alert('Erreur lors de la suppression: ' + res.message);
            }
          },
          error: (err) => {
            console.error('Error deleting pet:', err);
            alert('Erreur lors de la suppression');
          },
        });
      }
    } else {
      alert('Veuillez sélectionner un animal à supprimer');
    }
  }
}
