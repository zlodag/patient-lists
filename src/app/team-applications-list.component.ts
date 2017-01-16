import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';

import 'rxjs/add/operator/first';

import { AuthService } from './auth.service';

@Component({
  templateUrl: './team-applications-list.component.html',
})

export class TeamApplicationsListComponent implements OnInit {
    applications: FirebaseListObservable<any[]>;
    constructor(
        private db: AngularFireDatabase,
        private authService: AuthService,
    ) { }
    ngOnInit() {
        this.authService.auth.first().subscribe(authState => {
            this.applications = this.db.list('users/' + authState.uid + '/applications');
        });
    }
    applyToTeam(teamName: string) {
        this.authService.auth.first().subscribe(authState => {
            let sanitisedTeamName = teamName.trim();
            let updateObject = {};
            updateObject['teams/' + sanitisedTeamName + '/applicants/' + authState.uid] = authState.auth.displayName;
            updateObject['users/' + authState.uid + '/applications/' + sanitisedTeamName] = true;
            this.db.object('/').update(updateObject).catch(error => {
                if (error.message.startsWith('PERMISSION_DENIED')) {
                    alert('Application failed. Either the team does not exist, or you are already a member');
                } else {
                    throw error;
                }
            });
        });
    }
    deleteApplication(sanitisedTeamName: string) {
        this.authService.auth.first().subscribe(authState => {
            let updateObject = {};
            updateObject['teams/' + sanitisedTeamName + '/applicants/' + authState.uid] = null;
            updateObject['users/' + authState.uid + '/applications/' + sanitisedTeamName] = null;
            this.db.object('/').update(updateObject);
        });
    }
}
