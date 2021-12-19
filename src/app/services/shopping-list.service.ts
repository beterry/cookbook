import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../recipe.model';

@Injectable({
    providedIn: 'root',
})
export class ShoppingListService {
    shoppingList: Ingredient[] = [];
    shoppingListChanged = new Subject<Ingredient[]>();

    constructor() {}

    getIngredients(): Ingredient[]{
        return [...this.shoppingList];
    }

    addIngredients(newIngredients: Ingredient[]): void {
        this.shoppingList = this.shoppingList.concat(newIngredients);

        //-- emit new list to subscribed components
        this.shoppingListChanged.next(this.getIngredients());
    }
}
