import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-editable',
  templateUrl: './editable.component.html',
  styles: [`
    form {
        display: inline-block;
    }
  `]
})

export class EditableComponent {
    edit: boolean = false;
    @Input() value: string;
    @Input() editable: boolean = true;
    @Input() deletable: boolean = false;
    @Output() editItemRequest = new EventEmitter<string>();
    @Output() deleteItemRequest = new EventEmitter<void>();
    editItem(newValue: string) {
        const trimmedValue = newValue.trim();
        if (trimmedValue.length) {
            this.editItemRequest.emit(trimmedValue);
            this.edit = false;
        } else {
            this.deleteItem();
        }
    }
    deleteItem() {
        this.deleteItemRequest.emit();
        this.edit = false;
    }
}
