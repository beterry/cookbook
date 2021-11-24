import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { RECIPES } from './mock-recipes';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RecipeService {
    constructor() {}

    getRecipes(): Observable<Recipe[]>{
        return of(RECIPES);
    }

    getRecipe(id: string): Observable<Recipe>{
        const recipe = RECIPES.find(r => r.id === id)!;
        return of(recipe);
    }
}
