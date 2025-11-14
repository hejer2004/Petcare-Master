import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthentService } from '../authent.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SignupComponent {
  nom = '';
  prenom = '';
  sexe = '';
  adresse = '';
  email = '';
  mdp = '';
  confirmMdp = '';
  num_tel = '';

  successMessage = '';
  errorMessage = '';

  constructor(private authentService: AuthentService, private router: Router) {}

  onSubmit() {
    if (
      !this.nom ||
      !this.prenom ||
      !this.sexe ||
      !this.adresse ||
      !this.email ||
      !this.mdp ||
      !this.confirmMdp ||
      !this.num_tel
    ) {
      this.errorMessage = 'Please fill all fields correctly.';
      return;
    }

    if (this.mdp !== this.confirmMdp) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
      const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Email invalide.';
      return;
    }

    const phonePattern = /[0-9]{8}/;
    if (!phonePattern.test(this.num_tel)) {
      this.errorMessage = 'Numéro de téléphone invalide (8 chiffres requis).';
      return;
    }

    const data = {
      nom: this.nom,
      prenom: this.prenom,
      sexe: this.sexe,
      adresse: this.adresse,
      email: this.email,
      mdp: this.mdp,
      num_tel: this.num_tel,
    };
    console.log(data);
    this.authentService.signup(data).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = response.message;
          this.router.navigate(['/login']);
          this.errorMessage = '';
          this.resetForm();
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.errorMessage = 'An error occurred during registration.';
      },
    });
  }

  resetForm() {
    this.nom = '';
    this.prenom = '';
    this.sexe = '';
    this.adresse = '';
    this.email = '';
    this.mdp = '';
    this.confirmMdp = '';
    this.num_tel = '';
  }
}