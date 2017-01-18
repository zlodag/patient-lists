import { Component, Optional, Input, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TeamDataService } from './team-data.service';
import { PatientDataService } from './patient-data.service';

@Component({
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.css'],
    selector: 'app-comment-list',
})
export class CommentListComponent implements OnInit {
    @Input() editable: boolean = true;
    comments: FirebaseListObservable<any[]>;
    limitToLast: BehaviorSubject<number>;
    addComment: (text: string) => void;
    constructor(
        public teamData: TeamDataService,
        @Optional() private patientData: PatientDataService,
    ) { }
    ngOnInit() {
        if (this.patientData) {
            this.comments = this.patientData.comments;
            this.addComment = this.patientData.addComment;
        } else {
            this.comments = this.teamData.comments;
            this.addComment = this.teamData.addComment;
        }
    }
}
