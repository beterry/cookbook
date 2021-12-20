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
        const newShoppingList: Ingredient[] = this.combineDuplicateIngredients([...this.shoppingList, ...newIngredients]);
        this.shoppingList = newShoppingList;

        //-- emit new list to subscribed components
        this.shoppingListChanged.next(this.getIngredients());
    }

    addRecipesToList(recipesIds: string[]){
        const notUniqueRecipeIngredients: Ingredient[] = this.recipeService.getIngredients(recipesIds);
        const uniqueRecipeIngredients: Ingredient[] = this.combineDuplicateIngredients(notUniqueRecipeIngredients);
        const newShoppingList = this.combineDuplicateIngredients([...this.shoppingList, ...uniqueRecipeIngredients]);

        this.shoppingList = newShoppingList;

        this.shoppingListChanged.next(this.getIngredients());
    }

    combineDuplicateIngredients(notUniqueIngredients: Ingredient[]){
        const uniqueIngredients: Ingredient[] = [];

        //-- loop through existing ingredients and handle duplicate ingredients
        notUniqueIngredients.forEach(notUnique => {
            const indexOfRepeat = uniqueIngredients.findIndex(unique => unique.name === notUnique.name);

            //-- handle repeats
            if (indexOfRepeat != -1){
                //-- check to see if unit is the same
                if (notUnique.unit === uniqueIngredients[indexOfRepeat].unit){
                    //-- add quantity to existing quantity
                    uniqueIngredients[indexOfRepeat].quantity += notUnique.quantity;
                }else{
                    //-- can't handle unit conversion, add new ingredient to list
                    uniqueIngredients.push(notUnique);
                }
            //-- not a repeat, add to list    
            }else {
                uniqueIngredients.push(notUnique);
            }
        })

        return uniqueIngredients;
    }
}
