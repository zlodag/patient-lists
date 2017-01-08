import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class TeamDataService {
    team: string;
    userData: FirebaseObjectObservable<any>;
    patientData: FirebaseObjectObservable<any>;
    profileData: Observable<any>;
    constructor(
        private route: ActivatedRoute,
        private af: AngularFire,
    ) {
        // console.log("TeamDataService created");
        this.route.params.subscribe((params: Params) => {
            this.team = params['team'];
            this.userData = this.af.database.object('teams/' + this.team + '/users');
            this.patientData = this.af.database.object('teams/' + this.team + '/patients');
            this.profileData = this.af.auth.switchMap(authObj => this.af.database.object('teams/' + this.team + '/users/' + authObj.uid));
        });
    }
}
