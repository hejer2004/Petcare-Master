import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthentService } from '../authent.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  imports: [RouterModule, NavbarComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent implements OnInit {
  isLoggedin: Boolean | undefined;

  constructor(private authenService: AuthentService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedin = this.authenService.isLoggedIn();
  }

  logOut() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

}
