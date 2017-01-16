import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import { TeamDataService } from './team-data.service';

@Component({
    templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
    users: FirebaseListObservable<any[]>;
    constructor(
        private db: AngularFireDatabase,
        private teamData: TeamDataService,
    ) { }
    ngOnInit() {
        this.users = this.db.list('teams/' + this.teamData.team + '/users', {
            query: {
                orderByChild: 'joined'
            }
        });
    }
    deleteUser(user: any) {
        const team = this.teamData.team;
        if (confirm(`Really delete user ${user.name} from ${team}?`)) {
            this.db.object('/').update({
                ['teams/' + team + '/users/' + user.$key]: null,
                ['users/' + user.$key + '/teams/' + team]: null
            });
        }
    }
}
