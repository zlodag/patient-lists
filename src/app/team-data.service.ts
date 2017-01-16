import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';

import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthService } from './auth.service';

@Injectable()
export class TeamDataService implements OnDestroy {
    private sub: Subscription;
    team: string;
    userData: FirebaseObjectObservable<any>;
    patientData: FirebaseObjectObservable<any>;
    comments: FirebaseListObservable<any[]>;
    profileData: FirebaseObjectObservable<any>;
    limits = [5, 10, 20, 50];
    limitToLast = new BehaviorSubject<number>(this.limits[1]);
    constructor(
        private route: ActivatedRoute,
        private db: AngularFireDatabase,
        private authService: AuthService,
    ) {
        this.sub = this.route.params.subscribe(params => {
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
                this.profileData = this.db.object('teams/' + this.team + '/users/' + authState.uid);
            });
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
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
