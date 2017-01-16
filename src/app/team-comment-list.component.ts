import { Component } from '@angular/core';

import { TeamDataService } from './team-data.service';

@Component({
    templateUrl: './team-comment-list.component.html',
    styleUrls: ['./comment-list.component.css'],
})
export class TeamCommentListComponent {
    constructor(public teamData: TeamDataService) { }
}
