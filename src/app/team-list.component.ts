import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import { AuthService } from './auth.service';

import * as firebase from 'firebase';
import 'rxjs/add/operator/first';

@Component({
    styleUrls: ['./team-list.component.css'],
    templateUrl: './team-list.component.html',
})

export class TeamListComponent {
    constructor(
        private db: AngularFireDatabase,
        private authService: AuthService,
    ) {
    }
    addTeam(teamName: string) {
        this.authService.auth.first().subscribe(authState => {
            if (authState && authState.uid && authState.auth.displayName) {
                let sanitisedTeamName = teamName.trim();
                let updateObject = {};
                updateObject['teams/' + sanitisedTeamName + '/users/' + authState.uid] = {
                    name: authState.auth.displayName,
                    admin: true,
                    joined: firebase.database.ServerValue.TIMESTAMP
                };
                updateObject['users/' + authState.uid + '/teams/' + sanitisedTeamName] = true;
                this.db.object('/').update(updateObject);
            }
        });
    }
}
