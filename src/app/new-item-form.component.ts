import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-new-item-form',
    templateUrl: './new-item-form.component.html',
})

export class NewItemFormComponent {
    newItem: string = '';
    @Input() placeholder: string;
    @Output() addItemRequest = new EventEmitter<string>();
    addNewItem() {
        let newItemTrimmed = this.newItem.trim();
        if (newItemTrimmed.length) {
            this.addItemRequest.emit(newItemTrimmed);
            this.newItem = '';
        }
    }
}
