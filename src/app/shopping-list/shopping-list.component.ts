import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../recipe.model';
import { ShoppingListService } from '../services/shopping-list.service';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    ingredients: Ingredient[] = [];
    private ingredientSubscription: Subscription;

    constructor(
        private shoppingListService: ShoppingListService,
    ) {}

    ngOnInit(): void {
        this.ingredients = this.shoppingListService.getIngredients();

        this.ingredientSubscription = this.shoppingListService.shoppingListChanged
            .subscribe((list) => {
                this.ingredients = list;
            })
    }

    ngOnDestroy(): void {
        this.ingredientSubscription.unsubscribe();
    }
}
