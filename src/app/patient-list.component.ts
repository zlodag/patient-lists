import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';

import { TeamDataService } from './team-data.service';
import { Patient } from './patient';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

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
        this.patients = this.teamData.team.switchMap(team => this.db.list('teams/' + team + '/patients', {
            query: {
                orderByChild: this.orderByKey
            }
        })) as FirebaseListObservable<any[]>;

        // this.orderByKey.distinctUntilChanged().subscribe(key => {
        //     switch (key) {
        //         case 'nhi':
        //             this.patients = this.db.list('teams/' + this.teamData.team + '/patients', {
        //                 query: {
        //                     orderByKey: true
        //                 }
        //             });
        //             break;
        //         case 'lastName':
        //         case 'firstName':
        //         case 'ward':
        //             this.patients = this.db.list('teams/' + this.teamData.team + '/patients', {
        //                 query: {
        //                     orderByChild: key
        //                 }
        //             });
        //             break;
        //         default:
        //             console.error('unknown orderByChild');
        //             this.patients = null;
        //             break;
        //     }
        // });
    }
    initialize() {
        this.newPatient = new Patient();
    }
    addNewPatient(patient: Patient, newPatientForm: NgForm) {
        if (this.patients) {
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
}
