import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LostFoundService } from '../../lost-found.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // import pour ngModel

interface Espece {
  id_espece: number;
  libelle: string;
}

@Component({
  selector: 'app-lost-pet-form',
  templateUrl: './lost-pet-form.component.html',
  styleUrls: ['./lost-pet-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LostPetFormComponent implements OnInit {
  date_perte: string = '';
  lieu_perte: string = '';
  id_animal!: number;
  especes: Espece[] = [];

  imageFile: File | null = null;

  formSubmitted: boolean = false;

  constructor(
    private lostFoundService: LostFoundService,
    private router: Router
  ) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
  }

  ngOnInit(): void {
    const selectedAnimalId = localStorage.getItem('selected_animal_id');
    if (selectedAnimalId) {
      this.id_animal = Number(selectedAnimalId);
    } else {
      alert("Aucun animal sélectionné !");
      this.router.navigate(['/pets']); // Rediriger ou gérer l'erreur
    }
    //this.id_animal = 3 ; id mtaa animal zidtha ena khater manarech mnin bch nekhiuha (local storage)
  }

  onSubmit(): void {
    this.formSubmitted = true;
  
    // Validation manuelle
    if (!this.date_perte || !this.isValidDate(this.date_perte)) {
      alert("Veuillez entrer une date valide (pas dans le futur).");
      return;
    }
  
    if (!this.lieu_perte || this.lieu_perte.trim().length < 3) {
      alert("Le lieu de perte doit contenir au moins 3 caractères.");
      return;
    }
  
    const formData = new FormData();
    formData.append('date_perte', this.date_perte);
    formData.append('lieu_perte', this.lieu_perte);
    formData.append('id_animal', this.id_animal.toString());
    
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    };
  
    this.lostFoundService.addLostPet(formData).subscribe({
      next: (response) => {
        console.log('Animal perdu ajouté avec succès', response);
        this.router.navigate(['/lost-found']);
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de l\'animal perdu', error);
      }
    });
  }
  
  // Vérifie que la date n'est pas dans le futur
  isValidDate(dateStr: string): boolean {
    const inputDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorer l'heure
    return inputDate <= today;
  }
  

  onReset(): void {
    this.date_perte = '';
    this.lieu_perte = '';
    this.formSubmitted = false;
  }
}
