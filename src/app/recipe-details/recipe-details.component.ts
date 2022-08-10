import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../recipe.model';
import { ShoppingListService } from '../services/shopping-list.service';

@Component({
    selector: 'app-recipe-details',
    templateUrl: './recipe-details.component.html',
    styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent implements OnInit {
    recipe: Recipe;
    tab = 'ingredients';
    showActions = false;

    constructor(
        private route: ActivatedRoute,
        private recipeService: RecipeService,
        private shoppingListService: ShoppingListService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        // get the recipe id from url parameters
        const id = this.route.snapshot.paramMap.get('id');

        // get the recipe from the recipe service
        this.recipeService
            .getRecipe(id)
            .subscribe(
                (recipe) => {
                    if (recipe){
                        this.recipe = {...recipe, id: id};
                    }else {
                        this.handleRecipeNotFound();
                    }
                },
                (error) => {
                    this.handleRecipeNotFound();
                }
            );
    }

    // tab buttons
    handleTab(selected: string): void{
        if (selected === this.tab){
            return;
        }

        this.tab = selected;
    }

    // mobile actions button
    toggleActionDropdown(){
        this.showActions = !this.showActions;
    }

    // add to list button
    handleAddToList(){
        this.shoppingListService.addIngredients(this.recipe!.ingredients);
        this.showActions = false;
    }

    // naviagate to the recipes gallery if the recipe can't be found
    handleRecipeNotFound(){
        console.log('Recipe not found.')
        this.router.navigate(['/recipes']);
    }
}
