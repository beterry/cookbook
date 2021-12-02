import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { RECIPES } from './mock-recipes';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RecipeService {
    recipes: Recipe[] = RECIPES;

    constructor() {}

    getRecipes(): Observable<Recipe[]>{
        return of(this.recipes);
    }

    getRecipe(id: string): Observable<Recipe>{
        const recipe = this.recipes.find(r => r.id === id)!;
        return of(recipe);
    }

    addRecipe(newRecipe: Recipe){
        this.recipes.push({...newRecipe, id: this.recipes[this.recipes.length - 1].id + '1'});
    }

    updateRecipe(id: string, newRecipe: Recipe){
        const index = this.recipes.findIndex(recipe => recipe.id === id);

        //-- recipe does not exist
        if (index < 0){
            return;
        }

        this.recipes.splice(index, 1, {...newRecipe, id: id});
    }

    deleteRecipe(id: string){
        const index = this.recipes.findIndex(recipe => recipe.id === id);

        //-- recipe does not exist
        if (index < 0){
            return;
        }

        this.recipes.splice(index, 1);
    }
}
