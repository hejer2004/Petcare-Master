import { Routes } from '@angular/router';
import { UpdateAnimalComponent } from './update-animal/update-animal.component';
import { AddAnimalComponent } from './add-animal/add-animal.component';
import { PetPageComponent } from './pet-page/pet-page.component';
import { AddRdvComponent } from './add-rdv/add-rdv.component';
import { AddDossierComponent } from './add-dossier/add-dossier.component';
import { ProfilComponent } from './profil/profil.component';
import { UpdateProprioComponent } from './update-proprio/update-proprio.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  }, // Default route
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'updateAnimal',
    loadComponent: () =>
      import('./update-animal/update-animal.component').then(
        (m) => m.UpdateAnimalComponent
      ),
  },
  {
    path: 'lost-found',
    loadComponent: () =>
      import('./lostAndFound/lost-found-page/lost-found-page.component').then((m) => m.LostFoundPageComponent),
  },

  {
    path: 'lost-pet',
    loadComponent: () =>
      import('./lostAndFound/lost-pet-form/lost-pet-form.component').then((m) => m.LostPetFormComponent),
  },
  {
    path: 'found-pet',
    loadComponent: () =>
      import('./lostAndFound/found-pet-form/found-pet-form.component').then((m) => m.FoundPetFormComponent),
  },
  { path: 'add-animal', component: AddAnimalComponent },
  { path: 'update-animal/:id', component: UpdateAnimalComponent },
  { path: 'pet-page', component: PetPageComponent },
  { path: 'add-rdv', component: AddRdvComponent },
  { path: 'add-dossier', component: AddDossierComponent },
  { path: 'profil', component: ProfilComponent },
  { path: 'update-proprio', component: UpdateProprioComponent },
];
