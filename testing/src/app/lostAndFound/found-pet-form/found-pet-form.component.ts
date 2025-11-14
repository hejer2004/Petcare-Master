import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LostFoundService } from '../../lost-found.service';
import { CommonModule } from '@angular/common';// ll if wl for w kol
import { FormsModule } from '@angular/forms'; // Import pour ngModel

@Component({
  selector: 'app-found-pet-form',
  templateUrl: './found-pet-form.component.html',
  styleUrls: ['./found-pet-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FoundPetFormComponent {
  description: string = '';
  date_trouve: string = '';
  lieu_trouve: string = '';
  contact_trouveur: string = '';
  selectedImage: File | null = null;
  formSubmitted: boolean = false;

  constructor(
    private lostFoundService: LostFoundService,
    private router: Router
  ) {}

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }else{
      alert("pas dimage ajouter")
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;

    // Validation manuelle
    if (!this.description || this.description.trim().length < 10) {
      alert("La description doit contenir au moins 10 caractères.");
      return;
    }

    if (!this.date_trouve || !this.isValidDate(this.date_trouve)) {
      alert("Veuillez entrer une date valide (pas dans le futur).");
      return;
    }

    if (!this.lieu_trouve || this.lieu_trouve.trim().length < 3) {
      alert("Le lieu où l'animal a été trouvé doit contenir au moins 3 caractères.");
      return;
    }

    if (!this.contact_trouveur || !this.isValidEmail(this.contact_trouveur)) {
      alert("Un email valide est requis.");
      return;
    }   

    const formData = new FormData();
    formData.append('description', this.description);
    formData.append('date_trouve', this.date_trouve);
    formData.append('lieu_trouve', this.lieu_trouve);
    formData.append('contact_trouveur', this.contact_trouveur);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    };

    this.lostFoundService.addFoundPet(formData).subscribe({
      next: (response) => {
        console.log('Animal trouvé ajouté avec succès', response);
        this.router.navigate(['/lost-found']);
      },
      error: (error) => {
        console.log(formData);
        console.error('Erreur lors de l\'ajout de l\'animal trouvé', error);
      }
    });
  }

  onReset(): void {
    this.description = '';
    this.date_trouve = '';
    this.lieu_trouve = '';
    this.contact_trouveur = '';
    this.formSubmitted = false;
  }

  // Vérifie que la date n'est pas dans le futur
  isValidDate(dateStr: string): boolean {
    const inputDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorer l'heure
    return inputDate <= today;
  }

  // Vérifie si l'email est valide
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
}
