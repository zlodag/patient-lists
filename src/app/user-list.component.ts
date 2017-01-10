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
    deleteUser(user: any) {
        if (confirm('Delete user "' + user.name + '"?')) {
            this.db.object('/').update({
                ['teams/' + this.teamData.team + '/users/' + user.$key]: null,
                ['users/' + user.$key + '/teams/' + this.teamData.team]: null
            });
        }
    }
    toggleAdmin(user: any) {
        this.users.update(user, {admin: !user.admin});
    }
}
