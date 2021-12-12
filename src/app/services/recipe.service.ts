import { Injectable } from '@angular/core';
import { Recipe } from '../recipe.model';
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
            const recipe = this.recipes.find((r) => r.id === id)!;
            return of(recipe);
        } else {
            return this.http.get<Recipe>(this.url + 'recipes/' + id + '.json')
                .pipe(
                    map((dbRecipe) => {
                        return {
                            ...dbRecipe,
                            id: id,
                        };
                    }),
                    //-- because the recipes are not yet loaded from Firebase,
                    //-- fetch the recipes so updating and deleting works correctly
                    tap(() => {
                        this.fetchRecipes().subscribe(() => console.log('All recipes loaded in the background.'))
                    })
                )
        }
    }

    addRecipe(newRecipe: Recipe) {
        //-- add recipe to local service
        //-- give it a temp id which is used only until the page is refreshed
        this.recipes.push({
            ...newRecipe,
            id: new Date().getTime().toString(),
        });

        //-- add recipe to db
        this.dbAddRecipe(newRecipe);  
    }

    dbAddRecipe(newRecipe: Recipe) {
        this.http.post(this.url + 'recipes.json', newRecipe)
            .subscribe((res) => {
                console.log('Added to Firebase:');
                console.log(res);
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

    composeRecipeArray(recipesFromFb: any): Recipe[]{
        let recipeList: Recipe[] = [];
        //-- transform data object from db into an array of recipes
        for (const recipeID in recipesFromFb) {
            const currentRecipe = recipesFromFb[recipeID];
            recipeList.push({
                ...currentRecipe,
                id: recipeID,
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
