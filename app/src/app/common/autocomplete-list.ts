"use strict";
import {Component, Output, EventEmitter} from "@angular/core";

@Component({
    selector: "autocomplete-list",
    template: `<div class="dropdown-menu  search-results">
                    <a *ngFor="let item of list" class="dropdown-item" (click)="onClick(item)">{{item.text}}</a>
               </div>`
})
export class AutocompleteList  {
    // Emit a selected event when an item in the list is selected
    @Output() public selected = new EventEmitter();

    public list;

    /**
     * Listen for a click event on the list
     */
    public onClick(item: {text: string, data: any}) {
        this.selected.emit(item);
    }
}