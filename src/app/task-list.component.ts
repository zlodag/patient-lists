import { Component, Input } from '@angular/core';
import { PatientDataService } from './patient-data.service';

@Component({
    templateUrl: './task-list.component.html',
    selector: 'app-task-list',
})
export class TaskListComponent {
    @Input() editable: boolean = true;
    constructor(public patientData: PatientDataService) {}
}
