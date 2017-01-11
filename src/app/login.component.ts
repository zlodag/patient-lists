import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2';

@Component({
    templateUrl: './login.component.html',
})

export class LoginComponent {
    constructor(
        public auth: AngularFireAuth,
    ) {}
}
