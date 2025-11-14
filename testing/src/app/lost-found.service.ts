import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LostFoundService {
  private apiUrl = 'http://localhost:8080/petcare-master/backend/API';
  

  constructor(private http: HttpClient) { }

  // Ajouter un animal perdu
  addLostPet(petData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_lost_pet.php`, petData);
  }

  // Ajouter un animal trouvé
  addFoundPet(petData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_found_pet.php`, petData);
  }
  

  // Récupérer tous les animaux perdus et trouvés
  getAllLostFoundPets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_lost_found_pets.php`);
  }

  
  deletePetlostPost(postData:any): Observable<any> {
    const url = `${this.apiUrl}/delete_lost_post.php`;
    console.log('Données envoyées pour suppression :', postData);

    return this.http.post<any>(url,postData);  // Utilisation de POST à la place de DELETE
    
  }

  deletePetfoundPost(found_data:any): Observable<any> {
    const url = `${this.apiUrl}/delete_found_post.php`;
    console.log('Données envoyées pour suppression :', found_data);

    return this.http.post<any>(url,found_data);  // Utilisation de POST à la place de DELETE
    
  }

} 