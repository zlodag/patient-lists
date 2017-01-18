import * as firebase from 'firebase';

export class Problem {
    key: string;
    at: Date;
    by: string;
    active: boolean;
    qualifiers: Qualifier[] = [];
    constructor(snap: firebase.database.DataSnapshot) {
        this.key = snap.key;
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
    name: string;
    key: string
    constructor(snap: firebase.database.DataSnapshot) {
        this.key = snap.key;
        this.name = snap.val();
    }
}
