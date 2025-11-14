import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private baseUrl = 'http://localhost:8080/petcare-master/backend/api'; // Adjust URL if necessary

  constructor(private http: HttpClient) {}

  addAnimal(data: any): Observable<any> {
    return this.http.post(
      'http://localhost:8080/petcare-master/backend/api/add_animal.php',
      data
    );
  }
  deleteAnimal(idAnimal: number) {
    return this.http.post<any>(`${this.baseUrl}/delete_animal.php`, {
      id_animal: idAnimal,
    });
  }
  updateAnimal(animalData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update_animal.php`, animalData);
  }
  addRendezVous(data: any): Observable<any> {
    console.log(data);
    return this.http.post<any>(`${this.baseUrl}/add_rdv.php`, data);
  }
  addDossier(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add_dossier.php`, data).pipe(
      catchError((error) => {
        console.error('error occured', error);
        throw error;
      })
    );
  }
}
