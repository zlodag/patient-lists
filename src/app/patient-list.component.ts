import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TeamDataService } from './team-data.service';
import { Patient } from './patient';

@Component({
  styleUrls: ['./patient-list.component.css'],
  templateUrl: './patient-list.component.html',
})

export class PatientListComponent implements OnInit {
    orderByKey = new BehaviorSubject<string>('lastName');
    patients: FirebaseListObservable<any[]>;
    newPatient: Patient;
    constructor(
        private db: AngularFireDatabase,
        private teamData: TeamDataService,
    ) { }
    ngOnInit() {
        this.patients = this.db.list('teams/' + this.teamData.team + '/patients', {
            query: {
                orderByChild: this.orderByKey
            }
        });
    }
    initialize() {
        this.newPatient = new Patient();
    }
    addNewPatient(patient: Patient, newPatientForm: NgForm) {
        patient.sanitize();
        this.patients.update(patient.nhi, {
            firstName: patient.name.first,
            lastName: patient.name.last,
            ward: patient.ward
        }).then(() => {
            newPatientForm.resetForm(new Patient());
        });
    }
}
