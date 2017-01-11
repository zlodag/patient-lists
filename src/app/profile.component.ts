import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  templateUrl: './profile.component.html',
})

export class ProfileComponent {
    constructor(public authService: AuthService) {}
}
