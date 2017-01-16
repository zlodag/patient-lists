import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';

import * as firebase from 'firebase';
import 'rxjs/add/operator/first';

import { AuthService } from './auth.service';

@Component({
    styleUrls: ['./team-list.component.css'],
    templateUrl: './team-list.component.html',
})

export class TeamListComponent implements OnInit {
    teams: FirebaseListObservable<any[]>;
    constructor(
        private db: AngularFireDatabase,
        private authService: AuthService,
    ) { }
    ngOnInit() {
        this.authService.auth.first().subscribe(authState => {
            this.teams = this.db.list('users/' + authState.uid + '/teams');
        });
    }
    addTeam(teamName: string) {
        this.authService.auth.first().subscribe(authState => {
            let sanitisedTeamName = teamName.trim();
            let updateObject = {};
            updateObject['teams/' + sanitisedTeamName + '/users/' + authState.uid] = {
                name: authState.auth.displayName,
                admin: true,
                joined: firebase.database.ServerValue.TIMESTAMP
            };
            updateObject['users/' + authState.uid + '/teams/' + sanitisedTeamName] = true;
            this.db.object('/').update(updateObject).catch(error => {
                if (error.message.startsWith('PERMISSION_DENIED')) {
                    alert('This team name already exists');
                } else {
                    throw error;
                }
            });
        });
    }
}
