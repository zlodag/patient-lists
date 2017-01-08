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
        public teamData: TeamDataService,
        ) { }

    ngOnInit() {
        this.users = this.db.list('teams/' + this.teamData.team + '/users', {
            query: {
                orderByKey: true
            }
        });
    }
    toggleAdmin(user: any) {
        this.users.update(user, {admin: !user.admin});
    }
}
