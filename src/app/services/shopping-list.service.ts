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
        const newUniqueIngredients: Ingredient[] = [];

        //-- loop through existing ingredients and handle duplicate ingredients
        newIngredients.forEach(newIngredient => {
            const indexOfRepeat = this.shoppingList.findIndex(existingIngredient => existingIngredient.name === newIngredient.name);

            //-- handle repeats
            if (indexOfRepeat != -1){

                //-- check to see if unit is the same
                if (newIngredient.unit === this.shoppingList[indexOfRepeat].unit){
                    //-- add quantity to existing quantity
                    this.shoppingList[indexOfRepeat].quantity += newIngredient.quantity;
                }else{
                    //-- can't handle unit conversion, add new ingredient to list
                    newUniqueIngredients.push(newIngredient);
                }
            //-- not a repeat, add to list    
            }else {
                newUniqueIngredients.push(newIngredient);
            }
        })

        this.shoppingList = this.shoppingList.concat(newUniqueIngredients);

        //-- emit new list to subscribed components
        this.shoppingListChanged.next(this.getIngredients());
    }
}
