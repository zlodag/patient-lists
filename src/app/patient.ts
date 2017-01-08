export class Patient {
    nhi: string = '';
    name: {
        first: string;
        last: string;
    } = {
        first: '',
        last: ''
    };
    ward: string;
    sanitize() {
        this.nhi = this.nhi.toUpperCase();
        this.name.first = this.name.first.trim() || null;
        this.name.last = this.name.last.trim() || null;
        this.ward = this.ward ? (this.ward.trim() || null) : null;
    }
}
