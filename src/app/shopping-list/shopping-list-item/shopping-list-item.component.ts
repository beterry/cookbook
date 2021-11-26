import { Component, Input, OnInit } from '@angular/core';
import { Ingredient } from 'src/app/recipe.model';

@Component({
    selector: 'app-shopping-list-item',
    templateUrl: './shopping-list-item.component.html',
    styleUrls: ['./shopping-list-item.component.scss'],
})
export class ShoppingListItemComponent implements OnInit {
    @Input() item: Ingredient;
    completed: boolean = false;

    constructor() {}

    ngOnInit(): void {}

    toggleCompleted(){
        this.completed = !this.completed;
    }
}
