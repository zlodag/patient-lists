import { Component, OnDestroy } from '@angular/core';

import { TeamDataService } from './team-data.service';

@Component({
    templateUrl: './team-comment-list.component.html',
    styleUrls: ['./comment-list.component.css'],
})
export class TeamCommentListComponent implements OnDestroy {
    constructor(public teamData: TeamDataService) { }
    ngOnDestroy() {
        this.teamData.lastChecked.next(Date.now());
    }
}
