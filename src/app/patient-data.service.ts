import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import { Subscription } from 'rxjs/Subscription';

import { TeamDataService } from './team-data.service';

@Injectable()
export class PatientDataService implements OnDestroy {
    private sub: Subscription;
    nhi: string;
    patient: FirebaseObjectObservable<any>;
    problems: FirebaseListObservable<any[]>;
    tasks: FirebaseListObservable<any[]>;
    comments: FirebaseListObservable<any[]>;
    constructor(
        private route: ActivatedRoute,
        private db: AngularFireDatabase,
        private teamData: TeamDataService,
    ) {
        this.sub = this.route.params.subscribe(params => {
            this.nhi =  params['nhi'];
            this.patient = this.db.object('teams/' + this.teamData.team + '/patients/' + this.nhi);
            this.problems = this.db.list('teams/' + this.teamData.team + '/problems/' + this.nhi);
            this.tasks = this.db.list('teams/' + this.teamData.team + '/tasks/' + this.nhi);
            this.comments = this.db.list('teams/' + this.teamData.team + '/comments', {
                query: {
                    orderByChild: 'nhi',
                    equalTo: this.nhi,
                    limitToLast: this.teamData.limitToLast,
                }
            });
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
