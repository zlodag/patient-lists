import { Injectable }     from '@angular/core';
import { Router } from '@angular/router';
import {
    AngularFireAuth,
    AuthProviders,
    AuthMethods,
    FirebaseAuthState,
} from 'angularfire2';

@Injectable()
export class AuthService {
    private redirectURL: string = null;
    private defaultAuthedURL = "/";
    private defaultUnauthedURL = "/login";
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
    googleLoginRedirect() {
        this.auth.login({
            provider: AuthProviders.Google,
            method: AuthMethods.Redirect,
        }).then(this.navigateOnceAuthed);
    }
    facebookLogin() {
        this.auth.login({
            provider: AuthProviders.Facebook,
            method: AuthMethods.Popup,
        }).then(this.navigateOnceAuthed);
    }
    navigateOnceAuthed(authState : FirebaseAuthState) {
        console.log('logged in as', authState.uid, 'with provider', authState.provider);
        console.log('stored redirectUrl =', this.redirectURL)
        this.router.navigateByUrl(this.redirectURL || this.defaultAuthedURL);
        this.redirectURL = null;
    }
    makeMeAuthFirst(url: string) {
        console.info('Not authed, redirecting to login and saving link');
        this.redirectURL = url;
        this.redirectToLogin();
    }
    redirectToLogin(){
        this.router.navigateByUrl(this.defaultUnauthedURL);
    }
    alreadyAuthed(authState: FirebaseAuthState) {
        console.info('Already authed, redirecting', authState.auth.displayName);
        this.router.navigateByUrl(this.defaultAuthedURL);
    }   
}
