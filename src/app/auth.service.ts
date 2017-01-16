import { Injectable }     from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';

@Injectable()
export class AuthService {
    private redirectURL: string = null;
    private defaultAuthedURL = '/';
    private defaultUnauthedURL = '/login';
    constructor(
        public auth: AngularFireAuth,
        private router: Router,
    ) {}
    logout() {
        this.auth.logout().then(this.redirectToLogin);
    }
    googleLogin() {
        this.auth.login({
            provider: AuthProviders.Google,
            method: AuthMethods.Popup,
        }).then(this.navigateOnceAuthed);
    }
    facebookLogin() {
        this.auth.login({
            provider: AuthProviders.Facebook,
            method: AuthMethods.Popup,
        }).then(this.navigateOnceAuthed);
    }
    redirectToLogin = () => {
        this.router.navigateByUrl(this.defaultUnauthedURL);
    }
    navigateOnceAuthed = (authState: FirebaseAuthState) => {
        this.router.navigateByUrl(this.redirectURL || this.defaultAuthedURL);
        this.redirectURL = null;
    }
    makeMeAuthFirst = (url: string) => {
        this.redirectURL = url;
        this.redirectToLogin();
    }
    alreadyAuthed = (authState: FirebaseAuthState) => {
        this.router.navigateByUrl(this.defaultAuthedURL);
    }
}
