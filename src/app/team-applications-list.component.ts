import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';

@Component({
  templateUrl: './team-applications-list.component.html',
})

export class TeamApplicationsListComponent implements OnInit {
    uid: string = null;
    displayName: string = null;
    applications: FirebaseListObservable<any> = null;
    constructor(private af: AngularFire) { }
    ngOnInit() {
        this.af.auth.subscribe(authState => {
            if (authState) {
                this.uid = authState.uid;
                this.displayName = authState.google ? authState.google.displayName : 'Anonymous';
                this.applications = this.af.database.list('users/' + this.uid + '/applications');
            } else {
                this.uid = null;
                this.displayName = null;
                this.applications = null;
            }
        });
    }
    applyToTeam(teamName: string) {
        if (this.uid && this.displayName) {
            let sanitisedTeamName = teamName.trim();
            let updateObject = {};
            updateObject['teams/' + sanitisedTeamName + '/applicants/' + this.uid] = this.displayName;
            updateObject['users/' + this.uid + '/applications/' + sanitisedTeamName] = true;
            this.af.database.object('/').update(updateObject);
        }
    }
    deleteApplication(sanitisedTeamName: string) {
        if (this.uid) {
            let updateObject = {};
            updateObject['teams/' + sanitisedTeamName + '/applicants/' + this.uid] = null;
            updateObject['users/' + this.uid + '/applications/' + sanitisedTeamName] = null;
            this.af.database.object('/').update(updateObject);
        }
    }
}
