import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2';
import { TeamDataService } from './team-data.service';

@Injectable()
export class PatientDataService {
    nhi: string;
    patientData: FirebaseObjectObservable<any>;
    constructor(
        private route: ActivatedRoute,
        private db: AngularFireDatabase,
        private teamData: TeamDataService,
    ) {
        console.log("PatientDataService created");
        this.route.params.subscribe((params: Params) => {
            this.nhi = params['nhi'];
            this.patientData = this.db.object('teams/' + this.teamData.team + '/patients/' + this.nhi);
        });
    }
}
