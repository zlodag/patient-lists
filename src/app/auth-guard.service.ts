import { Injectable }     from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { FirebaseAuthState } from 'angularfire2';

import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivateChild, CanActivate {
    constructor(
        public authService: AuthService,
        private router: Router,
    ) {}
    canActivateChild(route, state) {
        return this.authService.auth.first().map(authState => {
            const canNavigate = authState !== null;
            if (!canNavigate) {
                this.authService.makeMeAuthFirst(state.url);
            }
            return canNavigate;
        });
    }
    canActivate(route, state) {
        return this.authService.auth.first().map(authState => {
            const canNavigate = authState === null;
            if (!canNavigate) {
                this.authService.alreadyAuthed(authState);
            }
            return canNavigate;
        });
    }
}
