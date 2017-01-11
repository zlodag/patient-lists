import { Component, OnInit, Optional } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/switchMap';

import { AuthService } from './auth.service';
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
    limitToLast = new BehaviorSubject<number>(this.limitModel);
    constructor(
        private db: AngularFireDatabase,
        private authService: AuthService,
        private teamData: TeamDataService,
        @Optional() private patientData: PatientDataService,
    ) {}
    ngOnInit() {
        this.comments = this.teamData.team
            .switchMap(team => this.db.list('teams/' + team + '/comments', {
                query: this.patientData ? {
                    orderByChild: 'nhi',
                    equalTo: this.patientData.nhi,
                    limitToLast: this.limitToLast
                } : {
                    orderByChild: 'at',
                    limitToLast: this.limitToLast,
                }
            })) as FirebaseListObservable<any[]>;
    }
    addComment(text: string) {
        const comment = {
            comment: text.trim(),
            at: firebase.database.ServerValue.TIMESTAMP,
        };
        if (this.patientData){
            Observable.zip(this.authService.auth, this.patientData.nhi)
            .first()
            .subscribe(([authState, nhi]) => {
                if (authState) {
                    comment['by'] = authState.uid;
                    comment['nhi'] = nhi;
                    this.comments.push(comment);
                }
            });
        } else {
            this.authService.auth
            .first()
            .subscribe(authState => {
                if (authState) {
                    comment['by'] = authState.uid;
                    this.comments.push(comment);
                }
            });
        }
    }
    limitTo(limit: string) {
        this.limitToLast.next(parseInt(limit, 10));
    }
}
