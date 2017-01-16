import { Component } from '@angular/core';

import { TeamDataService } from './team-data.service';
import { PatientDataService } from './patient-data.service';

@Component({
    templateUrl: './patient-comment-list.component.html',
    styleUrls: ['./comment-list.component.css'],
})
export class PatientCommentListComponent {
    constructor(
        public teamData: TeamDataService,
        public patientData: PatientDataService,
    ) { }
}
