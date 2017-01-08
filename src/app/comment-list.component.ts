import { Component, OnInit, Optional } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as firebase from 'firebase';

import { TeamDataService } from './team-data.service';
import { PatientDataService } from './patient-data.service';

@Component({
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.css'],
})

export class CommentListComponent implements OnInit {
    comments: FirebaseListObservable<any[]>;
    limits: number[] = [10, 20, 50, 100];
    limitModel = this.limits[0];
    limitToLast = new ReplaySubject<number>();
    constructor(
        private af: AngularFire,
        private teamData: TeamDataService,
        @Optional() private patientData: PatientDataService,
        ) {}
    ngOnInit() {
        this.limitToLast.next(this.limitModel);
        this.comments = this.af.database.list('teams/' + this.teamData.team + '/comments', {
            query: this.patientData ? {
                orderByChild: 'nhi',
                equalTo: this.patientData.nhi,
                limitToLast: this.limitToLast
            } : {
                orderByChild: 'at',
                limitToLast: this.limitToLast,
            }
        });
    }
    addComment(text: string) {
        this.af.auth.subscribe(authObj => {
            if (authObj) {
                this.comments.push({
                    comment: text.trim(),
                    by: authObj.uid,
                    nhi: this.patientData ? this.patientData.nhi : null,
                    at: firebase.database.ServerValue.TIMESTAMP,
                });
            }
        });
    }
    limitTo(limit: string) {
        this.limitToLast.next(parseInt(limit, 10));
    }
}
