import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2';
import { TeamDataService } from './team-data.service';
import { PatientDataService } from './patient-data.service';

@Component({
    templateUrl: './patient.component.html',
})

export class PatientComponent implements OnInit {
    patient: FirebaseObjectObservable<any> = null;
    constructor(
        private teamData: TeamDataService,
        private patientData: PatientDataService,
        private db: AngularFireDatabase
    ) { }
    ngOnInit() {
        this.patient = this.db.object('teams/' + this.teamData.team + '/patients/' + this.patientData.nhi);
    }
    updateFirstName(firstName: string) {
        this.patient.update({firstName: firstName.trim()});
    }
    updateLastName(lastName: string) {
        this.patient.update({lastName: lastName.trim()});
    }
    updateWard(ward: string) {
        this.patient.update({ward: ward.trim()});
    }
    deleteWard() {
        this.patient.update({ward: null});
    }
}
