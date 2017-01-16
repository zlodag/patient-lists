import { Component } from '@angular/core';
import { PatientDataService } from './patient-data.service';

@Component({
    templateUrl: './task-list.component.html',
})
export class TaskListComponent {
    constructor(public patientData: PatientDataService) {}
}
