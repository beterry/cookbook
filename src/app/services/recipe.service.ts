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
    public loadedFromFirebase: boolean = false;

    constructor(
        private http: HttpClient,
        private userService: UserService,
    ) {}

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

    getRecipes(): Observable<Recipe[]> {
        //-- check if the recipes have already been fetched from the db
        if (this.loadedFromFirebase){
            return of(this.recipes);
        } else {
            return this.fetchRecipes();
        }
    }

    getRecipe(id: string): Observable<Recipe>{
        if (this.loadedFromFirebase){
            const foundRecipeIndex = this.recipes.findIndex((r) => r.id === id);
            if (foundRecipeIndex >= 0){
                return of(this.recipes[foundRecipeIndex]);
            }else {
                return throwError('Recipe not found!');
            }
        } else {
            return this.http.get<Recipe>(this.url + 'recipes/' + id + '.json')
                .pipe(
                    map((dbRecipe) => {
                        return this.composeRecipe(dbRecipe);
                    }),
                    //-- because the recipes are not yet loaded from Firebase,
                    //-- fetch the recipes so updating and deleting works correctly
                    tap(() => {
                        this.fetchRecipes().subscribe(() => console.log('All recipes loaded in the background.'))
                    }),
                    catchError(() => {
                        return throwError('Recipe not found!')
                    })
                )
        }
    }

    addRecipe(newRecipe: Recipe) {
        const tempId = new Date().getTime().toString();

        //-- add recipe to local service
        //-- give it a temp id which is used only until the page is refreshed
        this.recipes.push({
            ...newRecipe,
            id: tempId,
        });

        //-- add recipe to db
        this.dbAddRecipe(newRecipe, tempId);  
    }

    dbAddRecipe(newRecipe: Recipe, tempId: string) {
        this.http.post(this.url + 'recipes.json', newRecipe)
            .subscribe((res) => {
                console.log('Recipe added to Firebase.');
            });
    }

    updateRecipe(id: string, newRecipe: Recipe) {
        const index = this.recipes.findIndex((recipe) => recipe.id === id);

        //-- recipe does not exist
        if (index < 0) {
            return;
        }

        this.recipes.splice(index, 1, { ...newRecipe, id: id });

        this.dbUpdateRecipe(id, newRecipe);
    }

    dbUpdateRecipe(id: string, newRecipe: Recipe) {
        this.http.patch(
            this.url + 'recipes/' + id + '.json',
            newRecipe,            
        ).subscribe((res) => {
            console.log('Successfully updated.')
        })
    }

    deleteRecipe(id: string) {
        const index = this.recipes.findIndex((recipe) => recipe.id === id);

        //-- recipe does not exist
        if (index < 0) {
            return;
        }

        this.recipes.splice(index, 1);

        this.dbDeleteRecipe(id);
    }

    dbDeleteRecipe(id: string) {
        this.http.delete(this.url + 'recipes/' + id + '.json')
            .subscribe(() => {
                console.log('Successfully deleted.')
            })
    }

    composeRecipe(recipeFromFb: any): Recipe | null{
        if (recipeFromFb){
            return {
                ...recipeFromFb,
                source: recipeFromFb.source ? recipeFromFb.source : '',
                ingredients: recipeFromFb.ingredients
                    ? recipeFromFb.ingredients
                    : [],
                prep: recipeFromFb.prep ? recipeFromFb.prep : [],
                instructions: recipeFromFb.instructions
                    ? recipeFromFb.instructions
                    : [],
            }
        }else {
            return null;
        }
    }

    composeRecipeArray(recipesFromFb: any): Recipe[]{
        let recipeList: Recipe[] = [];
        //-- transform data object from db into an array of recipes
        for (const recipeID in recipesFromFb) {
            const currentRecipe = recipesFromFb[recipeID];
            recipeList.push({
                ...currentRecipe,
                id: recipeID,
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

    getIngredients(recipeIds: string[]): Ingredient[]{
        let ingredients = [];
        const recipes = JSON.parse(JSON.stringify(this.recipes));

        recipeIds.forEach((id) => {
            const recipeIndex = recipes.findIndex((recipe) => recipe.id === id);

            if (recipeIndex > -1){
                 ingredients = [...ingredients, ...recipes[recipeIndex].ingredients];
            }
        })

        return ingredients;
    }
}
