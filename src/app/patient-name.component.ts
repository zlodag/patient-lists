import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { TeamDataService } from './team-data.service';

@Component({
    template: `
        <a *ngIf="patientData | async"
            [routerLink]="[prefixPath, nhi, suffixPath]"
            [title]="nhi"
        >{{ (patientData | async).firstName }}
        {{ (patientData | async).lastName }}</a>
        <span *ngIf="!(patientData | async)">{{ nhi }}</span>
    `,
    selector: 'app-patient-name',
})
export class PatientNameComponent implements OnInit {

    patientData: Observable<{firstName: string; lastName: string; }>;
    @Input() nhi: string;
    @Input() prefixPath: string = '';
    @Input() suffixPath: string = '';

    constructor(
        private teamData: TeamDataService,
    ) { }
    ngOnInit() {
        this.patientData = this.teamData.patientData.map(patients => patients[this.nhi] || null);
    }
}
