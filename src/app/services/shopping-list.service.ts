import { Injectable } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ingredient } from '../recipe.model';
import { RecipeService } from './recipe.service';

@Injectable({
    providedIn: 'root',
})
export class ShoppingListService {
    shoppingList: Ingredient[] = [];
    shoppingListChanged = new Subject<Ingredient[]>();

    constructor(
        private recipeService: RecipeService,
    ) {}

    getIngredients(): Ingredient[]{
        return [...this.shoppingList];
    }

    addIngredients(newIngredients: Ingredient[]): void {
        const newShoppingList: Ingredient[] = this.mergeIngredients([...this.shoppingList, ...newIngredients]);
        this.shoppingList = newShoppingList;

        //-- emit new list to subscribed components
        this.shoppingListChanged.next(this.getIngredients());
    }

    addRecipesToList(recipesIds: string[]){
        //-- 1. get all ingredients associated with the ids
        const allRecipeIngredients: Ingredient[] = this.recipeService.getIngredients(recipesIds);
        //-- 2. merge all the ingredients so there are no repeats 
        const uniqueRecipeIngredients: Ingredient[] = this.mergeIngredients(allRecipeIngredients);
        //-- 3. merge the new ingredients with the existing to to rid of repeats
        const newShoppingList = this.mergeIngredients([...this.shoppingList, ...uniqueRecipeIngredients]);
        //-- 4. set the new list
        this.shoppingList = newShoppingList;
        //-- 5. emit change to all components
        this.shoppingListChanged.next(this.getIngredients());
    }

    mergeIngredients(allIngredients: Ingredient[]){
        const mergedIngredients: Ingredient[] = [];

        //-- loop through existing ingredients and handle duplicate ingredients
        allIngredients.forEach(pIngredient => {
            const indexOfRepeat = mergedIngredients.findIndex(mIngredient => mIngredient.name === pIngredient.name);

            //-- handle repeats
            if (indexOfRepeat != -1){
                //-- check to see if unit is undefined
                if (!pIngredient.unit){
                    //-- do nothing
                //-- check to see if units are the same
                }else if (pIngredient.unit === mergedIngredients[indexOfRepeat].unit){
                    //-- add quantity to existing quantity
                    mergedIngredients[indexOfRepeat].quantity += pIngredient.quantity;
                //-- can't handle unit conversion, add new ingredient to list
                }else{
                    mergedIngredients.push(pIngredient);
                }
            //-- not a repeat, add to list    
            }else {
                mergedIngredients.push(pIngredient);
            }
        })

        return mergedIngredients;
    }
}
