import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';

import 'rxjs/add/operator/first';

import { AuthService } from './auth.service';
import { TeamDataService } from './team-data.service';
import { Problem, Qualifier } from './problem';

@Injectable()
export class PatientDataService {
    nhi: string;
    patient: FirebaseObjectObservable<any>;
    problems: FirebaseListObservable<firebase.database.DataSnapshot[]>;
    // problems: firebase.database.Query;
    tasks: FirebaseListObservable<any[]>;
    comments: FirebaseListObservable<any[]>;
    constructor(
        private route: ActivatedRoute,
        private db: AngularFireDatabase,
        private authService: AuthService,
        private teamData: TeamDataService,
    ) {
        this.route.params.subscribe(params => {
            this.nhi =  params['nhi'];
            this.patient = this.db.object('teams/' + this.teamData.team + '/patients/' + this.nhi);
            this.problems = this.db.list('teams/' + this.teamData.team + '/problems/' + this.nhi, {
                query: {
                    orderByChild: 'name',
                },
                preserveSnapshot: true,
            });
            // if (this.problems) {
            //     this.problems.off();
            // }
            // this.problems = firebase.database().ref('teams/' + this.teamData.team + '/problems/' + this.nhi).orderByKey();
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
    addComment = (text: string) => {
        this.authService.auth.first().subscribe(authState => {
            this.comments.push({
                comment: text.trim(),
                by: authState.uid,
                at: firebase.database.ServerValue.TIMESTAMP,
                nhi: this.nhi,
            });
        });
    }
    addProblem = (name: string) => {
        this.authService.auth.first().subscribe(authState => {
            this.problems.push({
                name: name.trim(),
                by: authState.uid,
                at: firebase.database.ServerValue.TIMESTAMP,
                active: true,
            });
        });
    }
    renameProblem = (problem: Problem, name: string) => {
        this.authService.auth.first().subscribe(authState => {
            this.problems.update(problem.key, {
                by: authState.uid,
                at: firebase.database.ServerValue.TIMESTAMP,
                name: name,
            });
        });
    }
    toggleProblem = (problem: Problem) => {
        this.authService.auth.first().subscribe(authState => {
            this.problems.update(problem.key, {
                by: authState.uid,
                at: firebase.database.ServerValue.TIMESTAMP,
                active: !problem.active,
            });
        });
    }
    removeProblem = (problem: Problem) => {
        this.problems.remove(problem.key);
    }
    addProblemQualifier = (problem: Problem, text: string) => {
        this.authService.auth.first().subscribe(authState => {
            this.problems.update(problem.key, {
                by: authState.uid,
                at: firebase.database.ServerValue.TIMESTAMP,
                ['qualifiers/' + this.problems.$ref.ref.child('qualifiers').push().key]: text,
            });
        });
    }
    renameProblemQualifier = (problem: Problem, qualifier: Qualifier, name: string) => {
        this.authService.auth.first().subscribe(authState => {
            this.problems.update(problem.key, {
                by: authState.uid,
                at: firebase.database.ServerValue.TIMESTAMP,
                ['qualifiers/' + qualifier.key]: name,
            });
        });
    }
    removeProblemQualifier = (problem: Problem, qualifier: Qualifier) => {
        this.authService.auth.first().subscribe(authState => {
            this.problems.update(problem.key, {
                by: authState.uid,
                at: firebase.database.ServerValue.TIMESTAMP,
                ['qualifiers/' + qualifier.key]: null,
            });
        });
    }
}
