import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2';
import { TeamDataService } from './team-data.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class PatientDataService {
    nhi: Observable<string>;
    patientData: FirebaseObjectObservable<any>;
    constructor(
        private route: ActivatedRoute,
        private db: AngularFireDatabase,
        private teamData: TeamDataService,
    ) {
        console.log("PatientDataService created");
        this.nhi = this.route.params.map(params => params['nhi']);
        this.patientData = Observable.combineLatest(this.nhi, this.teamData.team)
            .switchMap(([nhi, team]) => this.db.object('teams/' + team + '/patients/' + nhi)) as
            FirebaseObjectObservable<any>;
    }
}
