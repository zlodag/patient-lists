import * as firebase from 'firebase';

export class Problem {
    key: string;
    name: string;
    at: Date;
    by: string;
    active: boolean;
    qualifiers: Qualifier[] = [];
    constructor(snap: firebase.database.DataSnapshot) {
        this.key = snap.key;
        this.name = snap.child('name').val();
        this.at = new Date(snap.child('at').val());
        this.by = snap.child('by').val();
        this.active = snap.child('active').val();
        snap.child('qualifiers').forEach(qualifierSnap => {
            this.qualifiers.push(new Qualifier(qualifierSnap));
            return false;
        });
    }
}

export class Qualifier {
    key: string
    name: string;
    constructor(snap: firebase.database.DataSnapshot) {
        this.key = snap.key;
        this.name = snap.val();
    }
}
