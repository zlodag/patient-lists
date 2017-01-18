import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TeamDataService } from './team-data.service';
import 'rxjs/add/observable/combineLatest';

@Component({
    template: '{{ memberName | async }}',
    selector: 'app-team-member',
})
export class TeamMemberComponent implements OnChanges {
    @Input() uid: string;
    memberName: Observable<string>;
    private _uid: BehaviorSubject<string>;
    constructor(
        private teamData: TeamDataService,
    ) { }
    ngOnChanges(changes: SimpleChanges) {
        const change = changes['uid'];
        if (change) {
            if (change.isFirstChange()) {
                this._uid = new BehaviorSubject(change.currentValue);
                this.memberName = Observable
                    .combineLatest(this.teamData.userData, this._uid)
                    .map(([userData, uid]) => userData[uid].name);
            } else {
                this._uid.next(change.currentValue);
            }
        }
    }
}
