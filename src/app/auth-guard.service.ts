import { Injectable }     from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FirebaseAuthState } from 'angularfire2';

import { AuthService } from './auth.service';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthGuardService implements CanActivateChild, CanActivate {
    private redirectURL: string = null;
    private defaultAuthedURL = "/";
    private defaultUnauthedURL = "/login";
    private navigateOnceAuthed = (authState : FirebaseAuthState) => {
        console.log('logged in as', authState.uid, 'with provider', authState.auth.providerId);
        console.log('stored redirectUrl =', this.redirectURL)
        this.router.navigateByUrl(this.redirectURL || this.defaultAuthedURL);
    };
    private navigateOnceUnauthed = () => {
        this.router.navigateByUrl(this.defaultUnauthedURL);
    };
    constructor(
        public authService: AuthService,
        private router: Router,
    ) {}
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.auth
        .first()
        .map(authState => {
            const canNavigate = authState !== null;
            console.info('canActivateChild:', canNavigate);
            if (!canNavigate) {
                this.authService.makeMeAuthFirst(state.url);
            }
            return canNavigate;
        });
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.auth
        .first()
        .map(authState => {
            const canNavigate = authState === null;
            console.info('canActivate:', canNavigate);
            if (!canNavigate) {
                this.authService.alreadyAuthed(authState);
            }
            return canNavigate;
        });
    }
}
