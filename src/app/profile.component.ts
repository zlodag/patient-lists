import { Component } from '@angular/core';
import { AngularFireAuth, AuthMethods, AuthProviders } from 'angularfire2';

@Component({
  templateUrl: './profile.component.html',
})

export class ProfileComponent {
    constructor(public auth: AngularFireAuth) {}
    loginAnon() {
        this.auth.login({
            provider: AuthProviders.Anonymous,
            method: AuthMethods.Anonymous
        });
    }
    getName(authProviderID: number): string {
        switch (authProviderID) {
            case AuthProviders.Google:
                return 'Google';
            case AuthProviders.Anonymous:
                return 'Anonymous';
            default:
                return 'Unknown';
        }
    }
}
