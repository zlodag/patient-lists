import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { PatientDataService } from './patient-data.service';
import { Problem } from './problem';

@Component({
    templateUrl: './problem-list.component.html',
    styles: [`
        .editable {
            float: right;
        }
        h2 {
            margin: 0;
        }
    `],
})
export class ProblemListComponent implements OnInit, OnDestroy {
    private _sub : Subscription;
    activeProblems: Problem[];
    inactiveProblems: Problem[];
    editable: boolean = false;
    constructor(public patientData: PatientDataService) { }
    ngOnInit() {
        this._sub = this.patientData.problems.subscribe(problems => {
            this.activeProblems = [];
            this.inactiveProblems = [];
            problems.forEach(problemSnap => {
                const problem = new Problem(problemSnap);
                if (problem.active) {
                    this.activeProblems.push(problem);
                } else {
                    this.inactiveProblems.push(problem);
                }
            });
        });
    }
    ngOnDestroy() {
        this._sub.unsubscribe();
    }
}
