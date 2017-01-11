import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/empty';

@Injectable()
export class TeamDataService {
    team: Observable<string>;
    userData: FirebaseObjectObservable<any>;
    patientData: FirebaseObjectObservable<any>;
    profileData: FirebaseObjectObservable<any>;
    constructor(
        private route: ActivatedRoute,
        private db: AngularFireDatabase,
        private authService: AuthService,
    ) {
        console.log("TeamDataService created");
        this.team = this.route.params.map(params => params['team']);
        this.userData = this.team.switchMap(team => this.db.object('teams/' + team + '/users')) as FirebaseObjectObservable<any>;
        this.patientData = this.team.switchMap(team => this.db.object('teams/' + team + '/patients')) as FirebaseObjectObservable<any>;
        this.profileData = Observable.combineLatest(this.team, this.authService.auth)
            .switchMap(
                ([team, authState]) =>
                authState ?
                this.db.object('teams/' + team + '/users/' + authState.uid) :
                Observable.empty()
            ) as FirebaseObjectObservable<any>;
    }
}
