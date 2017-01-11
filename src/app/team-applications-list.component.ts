import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import { AuthService } from './auth.service';

import * as firebase from 'firebase';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/never';
import 'rxjs/add/operator/first';

@Component({
  templateUrl: './team-applications-list.component.html',
})

export class TeamApplicationsListComponent implements OnInit {
    applications: Observable<any[]>;
    constructor(
        private db: AngularFireDatabase,
        private authService: AuthService,
    ) { }
    ngOnInit(){
        this.applications = this.authService.auth
        .do(
          (items) => { console.log("applicationIndex: auth: onNext (items)", items) },
          (err) => { console.log("applicationIndex: auth: onError", err) },
          ()    => { console.log("applicationIndex: auth: onCompleted") },
        )
        .switchMap(authState => {
            return authState ? this.db.list('users/' + authState.uid + '/applications') : Observable.of([]);
        })
        .do(
          (items) => { console.log("applicationIndex: map: onNext (items)", items) },
          (err) => { console.log("applicationIndex: map: onError", err) },
          ()    => { console.log("applicationIndex: map: onCompleted") },
        )
        ;
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
