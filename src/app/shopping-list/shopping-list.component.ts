import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../recipe.model';
import { ShoppingListService } from '../services/shopping-list.service';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit {
    ingredients: Ingredient[] = [];

    constructor(
        private shoppingListService: ShoppingListService,
    ) {}

    ngOnInit(): void {
        this.ingredients = this.shoppingListService.getIngredients();
    }
}
