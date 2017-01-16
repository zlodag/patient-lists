import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';
import { TeamDataService } from './team-data.service';

@Component({
  templateUrl: './user-applicant-list.component.html',
})

export class UserApplicantListComponent implements OnInit {
    applicants: FirebaseListObservable<any[]>;

    constructor(
        private db: AngularFireDatabase,
        private teamData: TeamDataService,
    ) { }

    ngOnInit() {
        this.applicants = this.db.list('teams/' + this.teamData.team + '/applicants');
    }
    approveApplication(uid: string, name: string) {
        const team = this.teamData.team;
        const sanitisedName = name.trim();
        const updateObject = {};
        updateObject['teams/' + team + '/applicants/' + uid] = null;
        updateObject['users/' + uid + '/applications/' + team] = null;
        updateObject['teams/' + team + '/users/' + uid] = {
            name: sanitisedName,
            admin: false,
            joined: firebase.database.ServerValue.TIMESTAMP
        };
        updateObject['users/' + uid + '/teams/' + team] = true;
        this.db.object('/').update(updateObject);
    }

    declineApplication(uid: string) {
        const team = this.teamData.team;
        const updateObject = {};
        updateObject['teams/' + team + '/applicants/' + uid] = null;
        updateObject['users/' + uid + '/applications/' + team] = null;
        this.db.object('/').update(updateObject);
    }
}
