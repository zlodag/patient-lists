import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import { TeamDataService } from './team-data.service';
import { PatientDataService } from './patient-data.service';

export abstract class ItemListComponent implements OnInit {
    abstract itemType: string;
    abstract placeholder: string;
    items: FirebaseListObservable<any[]> = null;
    constructor(
        private db: AngularFireDatabase,
        private teamData: TeamDataService,
        private patientData: PatientDataService,
        ) {}
    ngOnInit() {
        this.items = this.db.list('teams/' + this.teamData.team + '/' + this.itemType + '/' + this.patientData.nhi);
    }
    addItem(item: string) {
        this.items.push(item.trim());
    }
    deleteItem(key: string) {
        this.items.remove(key);
    }
    editItem(key: string, value: string) {
        this.items.$ref.ref.child(key).set(value);
    }
}

@Component({
    templateUrl: './item-list.component.html',
})
export class ProblemListComponent extends ItemListComponent {
    itemType = 'problems';
    placeholder = 'Add problem';
    constructor(
        db: AngularFireDatabase,
        teamData: TeamDataService,
        patientData: PatientDataService,
        ) {
        super(db, teamData, patientData);
    }
}

@Component({
    templateUrl: './item-list.component.html',
})
export class TaskListComponent extends ItemListComponent {
    itemType = 'tasks';
    placeholder = 'Add task';
    constructor(
        db: AngularFireDatabase,
        teamData: TeamDataService,
        patientData: PatientDataService,
        ) {
        super(db, teamData, patientData);
    }
}
