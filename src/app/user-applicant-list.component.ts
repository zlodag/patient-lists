import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';
import { TeamDataService } from './team-data.service';

@Component({
  templateUrl: './user-applicant-list.component.html',
})

export class UserApplicantListComponent implements OnInit {

    applicants: FirebaseListObservable<any[]> = null;

    constructor(
        private db: AngularFireDatabase,
        private teamData: TeamDataService,
    ) { }

    ngOnInit() {
        this.applicants = this.db.list('teams/' + this.teamData.team + '/applicants');
    }

    approveApplication(uid: string, name: string) {
        let sanitisedName = name.trim();
        let updateObject = {};
        updateObject['teams/' + this.teamData.team + '/applicants/' + uid] = null;
        updateObject['users/' + uid + '/applications/' + this.teamData.team] = null;
        updateObject['teams/' + this.teamData.team + '/users/' + uid] = {
            name: sanitisedName,
            admin: false,
            joined: firebase.database.ServerValue.TIMESTAMP
        };
        updateObject['users/' + uid + '/teams/' + this.teamData.team] = true;
        this.db.object('/').update(updateObject);
    }

    declineApplication(uid: string) {
        if (this.teamData.team) {
            let updateObject = {};
            updateObject['teams/' + this.teamData.team + '/applicants/' + uid] = null;
            updateObject['users/' + uid + '/applications/' + this.teamData.team] = null;
            this.db.object('/').update(updateObject);
        }

    }
}
