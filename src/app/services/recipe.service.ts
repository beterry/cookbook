import { Injectable } from '@angular/core';
import { Ingredient, Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class RecipeService {
    public recipes: Recipe[] = [];
    private url: string =
        'https://cookbook-e918c-default-rtdb.firebaseio.com/';

    // use this to determine whether recipe data have been fetched
    public loadedFromFirebase: boolean = false;

    constructor(
        private http: HttpClient,
        private userService: UserService,
    ) {}

    // =================================================================================
    // FIREBASE FETCHING
    // =================================================================================

    // get recipes from Firebase
    fetchRecipes(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(this.url + 'recipes.json')
            .pipe(
                map((recipes) => this.composeRecipeArray(recipes)),
                tap(recipes => {
                    this.recipes = recipes;
                    this.loadedFromFirebase = true;
                })
            );
    }

    // get single recipe data from Firebase
    fetchRecipe(id: string): Observable<Recipe> {
        return this.http.get<Recipe>(this.url + 'recipes/' + id + '.json')
            .pipe(
                map((dbRecipe) => {
                    return this.composeRecipe(id, dbRecipe);
                }),
                // because the recipes are not yet loaded from Firebase,
                // fetch the recipes so updating and deleting works correctly
                tap(() => {
                    this.fetchRecipes().subscribe(() => console.log('All recipes loaded in the background.'))
                }),
                catchError(() => {
                    return throwError('Recipe not found!')
                })
            )
    }

    // =================================================================================
    // GET FUNCTIONS
    // =================================================================================

    // check if the recipes have already been fetched from the db
    // if loaded, return already fetched data
    // else, fetch data from Firebase
    getRecipes(): Observable<Recipe[]> {
        if (this.loadedFromFirebase){
            return of(this.recipes);
        } else {
            return this.fetchRecipes();
        }
    }

    // return one recipe's data
    getRecipe(id: string): Observable<Recipe>{
        // check to see if we already have data from Firebase
        if (this.loadedFromFirebase){
            // find index of needed recipe
            const foundRecipeIndex = this.recipes.findIndex((r) => r.id === id);

            // return recipe data if found,
            if (foundRecipeIndex >= 0){
                return of(this.recipes[foundRecipeIndex]);

            // or throw an error if not
            } else {
                return throwError('Recipe not found!');
            }
        } else {
            // user has gone right to a recipe details page
            // we need to fetch the recipe data from Firebase
            return this.fetchRecipe(id)
        }
    }

    // gets all ingredients form multiple recipes
    getIngredients(recipeIds: string[]): Ingredient[]{
        let ingredients = [];
        const recipes = this.recipes;

        recipeIds.forEach((id) => {
            const recipeIndex = recipes.findIndex((recipe) => recipe.id === id);

            if (recipeIndex > -1){
                 ingredients = [...ingredients, ...recipes[recipeIndex].ingredients];
            }
        })

        return ingredients;
    }

    // =================================================================================
    // ADDING RECIPES
    // =================================================================================

    addRecipe(newRecipe: Recipe) {
        const tempId = new Date().getTime().toString();

        // add recipe to local service
        // give it a temp id which is used only until the page is refreshed
        this.recipes.push({
            ...newRecipe,
            id: tempId,
        });

        // add recipe to Firebase
        this.dbAddRecipe(newRecipe, tempId);  
    }

    // add recipe to Firebase
    dbAddRecipe(newRecipe: Recipe, tempId: string) {
        this.http.post(this.url + 'recipes.json', newRecipe)
            .subscribe((res) => {
                console.log('Recipe added to Firebase.');
            });
    }

    // =================================================================================
    // UPADTING RECIPES
    // =================================================================================

    updateRecipe(id: string, newRecipe: Recipe) {
        const index = this.recipes.findIndex((recipe) => recipe.id === id);

        // recipe does not exist
        if (index < 0) {
            return;
        }

        this.recipes.splice(index, 1, { ...newRecipe, id: id });

        // update recipe in Firebase
        this.dbUpdateRecipe(id, newRecipe);
    }

    // save changes in Firebase
    dbUpdateRecipe(id: string, newRecipe: Recipe) {
        this.http.patch(
            this.url + 'recipes/' + id + '.json',
            newRecipe,            
        )
        .subscribe((res) => {
            console.log('Successfully updated.')
        })
    }

    // =================================================================================
    // DELETING RECIPES
    // =================================================================================

    deleteRecipe(id: string) {
        const index = this.recipes.findIndex((recipe) => recipe.id === id);

        // recipe does not exist
        if (index < 0) {
            return;
        }

        this.recipes.splice(index, 1);

        // remove recipe from Firebase
        this.dbDeleteRecipe(id);
    }

    // remove recipe from Firebase
    dbDeleteRecipe(id: string) {
        this.http.delete(this.url + 'recipes/' + id + '.json')
            .subscribe(() => {
                console.log('Successfully deleted.')
            })
    }

    // =================================================================================
    // UTILITY
    // =================================================================================

    // transform data object from Firebase into app-readable object
    composeRecipe(id: string, recipeFromFb: any): Recipe {
        return {
            ...recipeFromFb,

            // add ID to object
            id,

            // make sure that if there is no data for source, ingredients, prep, or instructions
            // we add an empty array or string
            source: recipeFromFb.source ? recipeFromFb.source : '',
            ingredients: recipeFromFb.ingredients
                ? recipeFromFb.ingredients
                : [],
            prep: recipeFromFb.prep ? recipeFromFb.prep : [],
            instructions: recipeFromFb.instructions
                ? recipeFromFb.instructions
                : [],
        }
    }

    // transform data object from Firebase into an array of app-readable recipes
    composeRecipeArray(recipesFromFb: any): Recipe[]{
        let recipeList: Recipe[] = [];

        for (const recipeID in recipesFromFb) {
            const currentRecipe = recipesFromFb[recipeID];
            recipeList.push({
                ...currentRecipe,

                // insert ID from Firebase
                id: recipeID,

                // make sure that if there is no data for source, ingredients, prep, or instructions
                // we add an empty array or string
                source: currentRecipe.source ? currentRecipe.source : '',
                ingredients: currentRecipe.ingredients
                    ? currentRecipe.ingredients
                    : [],
                prep: currentRecipe.prep ? currentRecipe.prep : [],
                instructions: currentRecipe.instructions
                    ? currentRecipe.instructions
                    : [],
            });
        }

        return recipeList;
    }
}
