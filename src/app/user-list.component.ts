import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import { TeamDataService } from './team-data.service';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';

@Component({
    templateUrl: './user-list.component.html',
})

export class UserListComponent implements OnInit {
    users: FirebaseListObservable<any[]>;

    constructor(
        private db: AngularFireDatabase,
        public teamData: TeamDataService,
        ) { }

    ngOnInit() {
        this.users = this.teamData.team.switchMap(team => this.db.list('teams/' + team + '/users', {
            query: {
                orderByKey: true
            }
        })) as FirebaseListObservable<any[]>;
    }
    deleteUser(user: any) {
        this.teamData.team.first().subscribe(team => {
            if (confirm("Delete user ${user.name} from ${team}?")) {
                this.db.object('/').update({
                    ['teams/' + team + '/users/' + user.$key]: null,
                    ['users/' + user.$key + '/teams/' + team]: null
                });
            }
        });
    }
    toggleAdmin(user: any) {
        this.users.update(user, {admin: !user.admin});
    }
}
