import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthentService } from '../authent.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isLoggedin: Boolean | undefined;

  constructor(private authenService: AuthentService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedin = this.authenService.isLoggedIn();
  }

  logOut() {
    localStorage.removeItem('user');
    this.router.navigate(['']);
  }
}
