import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient, IngredientSection } from './recipe.model';

@Injectable({
    providedIn: 'root',
})
export class ShoppingListService {
    shoppingList: Ingredient[] = [
        {
            name: 'Test Ingredient 1',
            quantity: '1 cup',
            location: 'Meat'
        },
        {
            name: 'Test Ingredient 2',
            quantity: '2 tbsp',
            location: 'Fruit'
        }
    ];
    shoppingListChanged = new Subject<{list: Ingredient[], sections: IngredientSection[]}>();

    constructor() {}

    getIngredients(): Ingredient[]{
        return [...this.shoppingList];
    }

    getSections(): IngredientSection[]{
        let formattedIngredients: IngredientSection[] = [];

        this.shoppingList.forEach((ingredient) => {
            const i = formattedIngredients.findIndex(section => section.title === ingredient.location);
            if (i >= 0){
                formattedIngredients[i].ingredients.push({...ingredient});
            }else {
                formattedIngredients.push({
                    title: ingredient.location,
                    ingredients: [{...ingredient}]
                })
            }
        })

        return formattedIngredients;
    }

    addIngredients(newIngredients: Ingredient[]): void {
        this.shoppingList = this.shoppingList.concat(newIngredients);

        //-- emit new list to subscribed components
        this.shoppingListChanged.next({list: this.getIngredients(), sections: this.getSections()});
    }
}
