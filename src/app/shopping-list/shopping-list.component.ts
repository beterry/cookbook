import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient, IngredientSection } from '../recipe.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    ingredients: Ingredient[] = [];
    sections: IngredientSection[] = [];
    private ingredientSubscription: Subscription;

    constructor(
        private shoppingListService: ShoppingListService,
    ) {}

    ngOnInit(): void {
        this.ingredients = this.shoppingListService.getIngredients();
        this.sections = this.shoppingListService.getSections();

        this.ingredientSubscription = this.shoppingListService.shoppingListChanged
            .subscribe(({list, sections}) => {
                this.ingredients = list;
                this.sections = sections;
            })
    }

    ngOnDestroy(): void {
        this.ingredientSubscription.unsubscribe();
    }
}
