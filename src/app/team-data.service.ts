import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';

@Injectable()
export class TeamDataService {
    team: string;
    userData: FirebaseObjectObservable<any>;
    patientData: FirebaseObjectObservable<any>;
    comments: FirebaseListObservable<any[]>;
    unreadCount: Observable<number>;
    profileData: FirebaseObjectObservable<any>;
    limits = [5, 10, 20, 50];
    limitToLast = new BehaviorSubject<number>(this.limits[1]);
    lastChecked = new BehaviorSubject<number>(Date.now());
    constructor(
        private route: ActivatedRoute,
        private db: AngularFireDatabase,
        private authService: AuthService,
    ) {
        this.route.params.subscribe(params => {
            this.team =  params['team'];
            this.userData = this.db.object('teams/' + this.team + '/users');
            this.patientData = this.db.object('teams/' + this.team + '/patients');
            this.comments = this.db.list('teams/' + this.team + '/comments', {
                query: {
                    orderByChild: 'at',
                    limitToLast: this.limitToLast,
                }
            });
            this.authService.auth.first().subscribe(authState => {
                this.unreadCount = this.db.list('teams/' + this.team + '/comments', {
                    query: {
                        orderByChild: 'at',
                        startAt: this.lastChecked,
                    }
                }).map((comments: any[]) => comments.filter(comment => comment.by !== authState.uid).length || null);
                this.profileData = this.db.object('teams/' + this.team + '/users/' + authState.uid);
            });
        });
    }
    addComment(text: string, nhi?: string) {
        this.authService.auth.first().subscribe(authState => {
            this.comments.push({
                comment: text.trim(),
                by: authState.uid,
                at: firebase.database.ServerValue.TIMESTAMP,
                nhi: nhi || null,
            });
        });
    }
}
