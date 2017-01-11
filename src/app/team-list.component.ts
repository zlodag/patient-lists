import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import { AuthService } from './auth.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/empty';

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
    ngOnInit(){
        this.teams = this.authService.auth.switchMap(
            authState => 
                authState ?
                this.db.list('users/' + authState.uid + '/teams') :
                Observable.empty()
        ) as FirebaseListObservable<any[]>;
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
