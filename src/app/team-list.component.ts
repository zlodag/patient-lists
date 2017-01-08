import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';

@Component({
    styleUrls: ['./team-list.component.css'],
    templateUrl: './team-list.component.html',
})

export class TeamListComponent implements OnInit {
    uid: string = null;
    displayName: string = null;
    teams: FirebaseListObservable<any> = null;
    constructor(private af: AngularFire) { }
    ngOnInit() {
        this.af.auth.subscribe(authState => {
            if (authState) {
                this.uid = authState.uid;
                this.displayName = authState.google ? authState.google.displayName : 'Anonymous';
                this.teams = this.af.database.list('users/' + this.uid + '/teams');
            } else {
                this.uid = null;
                this.displayName = null;
                this.teams = null;
            }
        });
    }
    addTeam(teamName: string) {
        if (this.uid && this.displayName) {
            let sanitisedTeamName = teamName.trim();
            let updateObject = {};
            updateObject['teams/' + sanitisedTeamName + '/users/' + this.uid] = {
                name: this.displayName,
                admin: true,
                joined: firebase.database.ServerValue.TIMESTAMP
            };
            updateObject['users/' + this.uid + '/teams/' + sanitisedTeamName] = true;
            this.af.database.object('/').update(updateObject);
        }
    }
}
