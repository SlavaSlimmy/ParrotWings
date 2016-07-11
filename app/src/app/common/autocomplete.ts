"use strict";
import {Directive, DynamicComponentLoader, Input, ComponentRef, Output, EventEmitter, OnInit, ViewContainerRef} from "@angular/core";
import {Promise} from "es6-promise";
import {AutocompleteList} from "./autocomplete-list";

@Directive({
    selector: "[ng2-autocomplete]", // The attribute for the template that uses this directive
    host: {
        "(keyup)": "onKey($event)" // Liten to keyup events on the host component
    }
})
export class AutocompleteDirective implements OnInit {
    // The search function should be passed as an input
    @Input("ng2-autocomplete") public search: (term: string) => Promise<Array<{ text: string, data: any }>>;
    // The directive emits ng2AutocompleteOnSelect event when an item from the list is selected
    @Output("ng2AutocompleteOnSelect") public selected = new EventEmitter();

    private term = "";
    private listCmp: ComponentRef<AutocompleteList> = undefined;
    private refreshTimer: any = undefined;
    private searchInProgress = false;
    private searchRequired = false;

    constructor( private viewRef: ViewContainerRef, private dcl: DynamicComponentLoader) { }
    /**
     * On key event is triggered when a key is released on the host component
     * the event starts a timer to prevent concurrent requests
     */
    public onKey(event: any) {
        if (!this.refreshTimer) {
            this.refreshTimer = setTimeout(
                () => {
                    if (!this.searchInProgress) {
                        this.doSearch();
                    } else {
                        // If a request is in progress mark that a new search is required
                        this.searchRequired = true;
                    }
                },
                200);
        }
        this.term = event.target.value;
        if (this.term === "" && this.listCmp) {
            // clean the list if the search term is empty
            this.removeList();
        }
    }

    public ngOnInit() {
        // When an item is selected remove the list
        this.selected.subscribe(() => {
            this.removeList();
        });
    }

    /**
     * Call the search function and handle the results
     */
    private doSearch() {
        this.refreshTimer = undefined;
        // if we have a search function and a valid search term call the search
        if (this.search && this.term !== "") {
            this.searchInProgress = true;
            this.search(this.term)
                .then((res) => {
                    this.searchInProgress = false;
                    // if the term has changed during our search do another search
                    if (this.searchRequired) {
                        this.searchRequired = false;
                        this.doSearch();
                    } else {
                        // display the list of results
                        this.diplayList(res);
                    }
                })
                .catch(err => {
                    console.log("search error:", err);
                    this.removeList();
                });
        }
    }

    /**
     * Display the list of results
     * Dynamically load the list component if it doesn't exist yet and update the suggestions list
     */
    private diplayList(list: Array<{ text: string, data: any }>) {
        if (!this.listCmp) {
            this.dcl.loadNextToLocation(AutocompleteList, this.viewRef)
                .then(cmp => {
                    // The component is loaded
                    this.listCmp = cmp;
                    this.updateList(list);
                    // Emit the selectd event when the component fires its selected event
                    (<AutocompleteList>(this.listCmp.instance)).selected
                        .subscribe(selectedItem => {

                            this.selected.emit(selectedItem);
                        });
                });
        } else {
            this.updateList(list);
        }
    }

    /**
     * Update the suggestions list in the list component
     */
    private updateList(list: Array<{ text: string, data: any }>) {
        if (this.listCmp) {
            (<AutocompleteList>(this.listCmp.instance)).list = list;
        }
    }

    /**
     * remove the list component
     */
    private removeList() {
        this.searchInProgress = false;
        this.searchRequired = false;
        if (this.listCmp) {
            this.listCmp.destroy();
            this.listCmp = undefined;
        }
    }
}