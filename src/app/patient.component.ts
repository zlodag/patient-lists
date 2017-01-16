import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamDataService } from './team-data.service';
import { PatientDataService } from './patient-data.service';

@Component({
    templateUrl: './patient.component.html',
})

export class PatientComponent {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private patientData: PatientDataService,
    ) { }
    updateFirstName(firstName: string) {
        this.patientData.patient.update({firstName: firstName.trim()});
    }
    updateLastName(lastName: string) {
        this.patientData.patient.update({lastName: lastName.trim()});
    }
    updateWard(ward: string) {
        this.patientData.patient.update({ward: ward.trim()});
    }
    deleteWard() {
        this.patientData.patient.update({ward: null});
    }
    deletePatient() {
        if (confirm('Delete patient?')) {
            this.patientData.patient.remove();
            this.router.navigate(['../'], { relativeTo: this.route.parent });
        }
    }
}
