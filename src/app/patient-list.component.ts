import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';

import { TeamDataService } from './team-data.service';
import { Patient } from './patient';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  styleUrls: ['./patient-list.component.css'],
  templateUrl: './patient-list.component.html',
})

export class PatientListComponent implements OnInit {
    orderByKey = new Subject<string>();
    patients: FirebaseListObservable<any[]> = null;
    newPatient: Patient;
    constructor(
        private db: AngularFireDatabase,
        private teamData: TeamDataService,
    ) { }
    ngOnInit() {
        this.orderByKey.distinctUntilChanged().subscribe(key => {
            switch (key) {
                case 'nhi':
                    this.patients = this.db.list('teams/' + this.teamData.team + '/patients', {
                        query: {
                            orderByKey: true
                        }
                    });
                    break;
                case 'lastName':
                case 'firstName':
                case 'ward':
                    this.patients = this.db.list('teams/' + this.teamData.team + '/patients', {
                        query: {
                            orderByChild: key
                        }
                    });
                    break;
                default:
                    console.error('unknown orderByChild');
                    this.patients = null;
                    break;
            }
        });
        this.orderByKey.next('nhi');
    }
    initialize() {
        this.newPatient = new Patient();
    }
    addNewPatient(patient: Patient) {
        if (this.patients) {
            patient.sanitize();
            this.patients.update(patient.nhi, {
                firstName: patient.name.first,
                lastName: patient.name.last,
                ward: patient.ward
            });
        }
    }
}
