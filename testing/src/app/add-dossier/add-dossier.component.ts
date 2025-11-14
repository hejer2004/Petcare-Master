import { Component, OnInit } from '@angular/core';
import { PetService } from '../pet.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-dossier',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-dossier.component.html',
  styleUrl: './add-dossier.component.css',
})
export class AddDossierComponent implements OnInit {
  pets: any[] = [];
  selectedPetId: number = 0;
  description = '';
  diagnostique = '';
  traitements = '';
  medicaments = '';
  date = '';
  type_vaccin = '';
  vaccin = false;

  successMessage = '';
  errorMessage = '';

  constructor(
    private petService: PetService,
    private router: Router,
    private http: HttpClient
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
    if (
      !this.description ||
      !this.diagnostique ||
      !this.traitements ||
      !this.medicaments ||
      !this.date ||
      !this.type_vaccin
    ) {
      this.errorMessage = 'Please fill all fields correctly.';
      return;
    }
    const data = {
      animal_id: this.selectedPetId,
      description: this.description,
      diagnostique: this.diagnostique,
      traitements: this.traitements,
      medicaments: this.medicaments,
      date: this.date,
      type_vaccin: this.type_vaccin,
      vaccin: this.vaccin,
    };
    this.petService.addDossier(data).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = response.success;
          this.router.navigate(['/pet-page']); // Adjust route as needed
          this.errorMessage = '';
          this.resetForm();
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.errorMessage = 'An error occured during submission';
      },
    });
  }
  resetForm() {
    this.description = '';
    this.diagnostique = '';
    this.traitements = '';
    this.medicaments = '';
    this.date = '';
    this.type_vaccin = '';
    this.vaccin = false;
  }
}
