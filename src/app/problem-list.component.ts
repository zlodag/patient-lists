import { Component } from '@angular/core';
import { PatientDataService } from './patient-data.service';

@Component({
    templateUrl: './problem-list.component.html',
})
export class ProblemListComponent {
    constructor(public patientData: PatientDataService) {}
}
