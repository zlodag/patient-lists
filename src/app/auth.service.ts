import { Injectable }     from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {
    AngularFireAuth,
    AuthProviders,
    AuthMethods,
    FirebaseAuthState,
    AngularFireDatabase,
    FirebaseListObservable,
} from 'angularfire2';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/never';
// import * as Rx from 'rxjs/Rx';

interface FirebaseIndex {
    $key: string;
    $value: any;
}

@Injectable()
export class AuthService implements CanActivateChild, CanActivate {

    private redirectURL: string = null;
    private defaultAuthedURL = "/";
    private defaultUnauthedURL = "/login";
    // public teamIndex : Observable<any[]>;
    public applicationIndex : Observable<FirebaseIndex[]>;
    public teams: FirebaseIndex[];
    // public applications: FirebaseIndex[];
    // public teamIndex : FirebaseListObservable<any[]>;
    // public applicationIndex : FirebaseListObservable<any[]>;

    constructor(
        public auth: AngularFireAuth,
        private db: AngularFireDatabase,
        private router: Router,
    ) {
        console.log('creating AuthService');
        // const map = this.auth.switchMap((authState: FirebaseAuthState) => {
        //     if (authState) {
        //         console.log('teamIndex: auth state found,', authState);
        //         return this.db.list('users/' + authState.uid + '/teams');
        //     } else {
        //         console.error('teamIndex: no auth state...');
        //         return Observable.empty<any[]>();
        //     }
        // });
        // map.subscribe(
        //     (teams) => {
        //         console.log('Teams updated', teams);
        //         this.teams = teams;
        //     },
        //     (error) => {
        //         console.error('An error occurred:', error);
        //         this.teams = null;
        //     },
        //     () => {
        //         console.info('Completed');
        //         this.teams = null;
        //     },
        // );
        // this.teamIndex = this.auth.finally(() => {
        //     console.log('auth has finished');
        // }).switchMap((authState: FirebaseAuthState) => {
        //     if (authState) {
        //         console.log('teamIndex: auth state found,', authState);
        //         return this.db.list('users/' + authState.uid + '/teams');
        //     } else {
        //         console.error('teamIndex: no auth state...');
        //         return Observable.empty();
        //     }
        // }).finally(() => {
        //     console.log('switchMap has finished');
        // });
        // this.teamIndex.subscribe(
        //   (val) => { console.log("teamIndex: onNext", val) },
        //   (err) => { console.log("teamIndex: onError", err) },
        //   ()    => { console.log("teamIndex: onCompleted") },
        // );


        // this.applicationIndex = this.auth
        //     .switchMap((authState: FirebaseAuthState) : Observable<FirebaseIndex[]> => {
        //         if (authState) {
        //             console.log('applicationIndex: auth state found,', authState);
        //             return this.db.list('users/' + authState.uid + '/applications');
        //         } else {
        //             console.error('applicationIndex: no auth state...');
        //             return Observable.of([]);
        //         }
        //     });
            // .do(
            //   (items) => { console.log("applicationIndex: onNext (items)", items) },
            //   (err) => { console.log("applicationIndex: onError", err) },
            //   ()    => { console.log("applicationIndex: onCompleted") },
            // );
            // .subscribe(items => {
            //     Rx.o
            // });
        // this.auth.subscribe(authState => {
        //     if (authState) {
        //         console.log('auth state found,', authState);
        //         this.teamIndex = this.db.list('users/' + authState.uid + '/teams');
        //         this.applicationIndex = this.db.list('users/' + authState.uid + '/applications');
        //     } else {
        //         console.error('no auth state...');
        //         this.teamIndex = null;
        //         this.applicationIndex = Observable.empty();
        //     }
        // });
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.auth
        .first()
        .map(authState => {
            const canNavigate = authState !== null;
            console.info('canActivateChild:', canNavigate);
            if (!canNavigate) {
                console.info('Not authed, redirecting to login and saving link');
                this.redirectURL = state.url;
                this.navigateOnceUnauthed();
            }
            return canNavigate;
        });
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.auth
        .first()
        .map(authState => {
            const canNavigate = authState === null;
            console.info('canActivate:', canNavigate);
            if (!canNavigate) {
                console.log('Already authed...');
                this.navigateOnceAuthed(authState);
            }
            return canNavigate;
        });
    }
    logout() {
        this.auth.logout()
        // .then(this.navigateOnceUnauthed)
        ;
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
    private navigateOnceAuthed = (authState : FirebaseAuthState) => {
        console.log('logged in as', authState.uid, 'with provider', authState.provider);
        console.log('stored redirectUrl =', this.redirectURL)
        this.router.navigateByUrl(this.redirectURL || this.defaultAuthedURL);
    };
    private navigateOnceUnauthed = () => {
        this.router.navigateByUrl(this.defaultUnauthedURL);
    };
}
