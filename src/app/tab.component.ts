import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2';

import { TeamDataService } from './team-data.service';
import { PatientDataService } from './patient-data.service';

@Component({
  styleUrls: ['./tab.component.css'],
  templateUrl: './tab-dashboard.component.html',
})
export class TabDashboardComponent {
    constructor(
        public auth: AngularFireAuth,
    ) { }
}

@Component({
    styleUrls: ['./tab.component.css'],
    templateUrl: './tab-team.component.html',
    providers: [TeamDataService],
})
export class TabTeamComponent {
    constructor(
        public teamData: TeamDataService,
    ) { }
}

@Component({
    styleUrls: ['./tab.component.css'],
    templateUrl: './tab-patient.component.html',
    providers: [PatientDataService],
})
export class TabPatientComponent {
    constructor(
        public patientData: PatientDataService,
    ) { }
}
