import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientDataService } from './patient-data.service';

@Component({
    templateUrl: './patient.component.html',
})

export class PatientComponent {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private patientData: PatientDataService
    ) { }
    updateFirstName(firstName: string) {
        this.patientData.patientData.update({firstName: firstName.trim()});
    }
    updateLastName(lastName: string) {
        this.patientData.patientData.update({lastName: lastName.trim()});
    }
    updateWard(ward: string) {
        this.patientData.patientData.update({ward: ward.trim()});
    }
    deleteWard() {
        this.patientData.patientData.update({ward: null});
    }
    deletePatient() {
        if (confirm('Delete patient?')) {
            this.patientData.patientData.remove();
            this.router.navigate(['../'], { relativeTo: this.route.parent });
        }
    }
}
