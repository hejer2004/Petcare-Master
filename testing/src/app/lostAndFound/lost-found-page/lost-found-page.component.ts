import { Component, OnInit } from '@angular/core';
import { LostFoundService } from '../../lost-found.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';


@Component({
  selector: 'app-lost-found-page',
  templateUrl: './lost-found-page.component.html',
  styleUrls: ['./lost-found-page.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent]
})
export class LostFoundPageComponent implements OnInit {
  lostPets: any[] = [];
  foundPets: any[] = [];
  ownerId: number = 0;  // Utilisez cette propriété pour stocker ownerId
  userEmail="";


  constructor(private lostFoundService: LostFoundService) { }

  ngOnInit(): void {
    const userS = localStorage.getItem('user');
    if (userS) {
      const user = JSON.parse(userS);
      this.ownerId = user.id_prop;  // Affectez la valeur à la propriété ownerId
      this.userEmail=user.email;
    }

    this.loadPets();
  }

  loadPets(): void {
    this.lostFoundService.getAllLostFoundPets().subscribe({
      next: (data) => {
        this.lostPets = data.lost_pets;
        this.foundPets = data.found_pets;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des animaux', error);
      }
    });
  }

  isOwner(pet: any): boolean {
    return pet.id_prop === this.ownerId;
  }

  isEmail(pet: any): boolean {
    return pet.contact_trouveur === this.userEmail;
  }

  deletelostPost(id_animal: any): void {
    if (confirm('Es-tu sûr de vouloir supprimer ce post lost ?')) {
      const postData = {
        id: id_animal
      };
      this.lostFoundService.deletePetlostPost(postData).subscribe({
        next: (res) => {
          if(res.success){
            console.log(res);
            alert('lost Post supprimé avec succès.');
            this.loadPets();}
        },
        error: (error) => {
          console.log(postData);
          console.error('Erreur lors de la suppression', error);
          alert("Une erreur est survenue lors de la suppression.");
        }
      });
    }
  }

  deletefoundPost(contact_trouveur: any,date_trouve:any): void {
    if (confirm('Es-tu sûr de vouloir supprimer ce post found?')) {
      const email = {
        contact:contact_trouveur,
        date:date_trouve
      };
      this.lostFoundService.deletePetfoundPost(email).subscribe({
        next: (res) => {
          if(res.success){
            console.log(res);
            alert('found Post supprimé avec succès.');
            this.loadPets();}
        },
        error: (error) => {
          console.log(email);
          console.error('Erreur lors de la suppression', error);
          alert("Une erreur est survenue lors de la suppression.");
        }
      });
    }
  }  
}
