import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import { AuthService } from './auth.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/empty';

@Component({
  templateUrl: './team-applications-list.component.html',
})

export class TeamApplicationsListComponent implements OnInit {
    applications: FirebaseListObservable<any[]>;
    constructor(
        private db: AngularFireDatabase,
        private authService: AuthService,
    ) { }
    ngOnInit(){
        this.applications = this.authService.auth.switchMap(
            authState => 
                authState ?
                this.db.list('users/' + authState.uid + '/applications') :
                Observable.empty()
        ) as FirebaseListObservable<any[]>;
    }
    applyToTeam(teamName: string) {
        this.authService.auth.first().subscribe(authState => {
            if (authState && authState.uid && authState.auth.displayName) {
                let sanitisedTeamName = teamName.trim();
                let updateObject = {};
                updateObject['teams/' + sanitisedTeamName + '/applicants/' + authState.uid] = authState.auth.displayName;
                updateObject['users/' + authState.uid + '/applications/' + sanitisedTeamName] = true;
                this.db.object('/').update(updateObject);
            }
        });
    }
    deleteApplication(sanitisedTeamName: string) {
        this.authService.auth.first().subscribe(authState => {
            if (authState && authState.uid) {
                let updateObject = {};
                updateObject['teams/' + sanitisedTeamName + '/applicants/' + authState.uid] = null;
                updateObject['users/' + authState.uid + '/applications/' + sanitisedTeamName] = null;
                this.db.object('/').update(updateObject);
            }
        });
    }
}
