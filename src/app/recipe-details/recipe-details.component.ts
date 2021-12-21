import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../recipe.model';
import { ShoppingListService } from '../services/shopping-list.service';
import { tap } from 'rxjs/operators';

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
        private location: Location,
        private router: Router,
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.recipeService
            .getRecipe(id)
            .subscribe(
                (recipe) => {
                    if (recipe){
                        this.recipe = recipe;
                    }else {
                        this.handleRecipeNotFound();
                    }
                },
                (error) => {
                    this.handleRecipeNotFound();
                }
            );
    }

    handleTab(selected: string): void{
        if (selected === this.tab){
            return;
        }

        this.tab = selected;
    }

    toggleActionDropdown(){
        this.showActions = !this.showActions;
    }

    handleAddToList(){
        this.shoppingListService.addIngredients(this.recipe!.ingredients);
        this.showActions = false;
    }

    handleRecipeNotFound(){
        console.log('Recipe not found.')
        this.router.navigate(['/recipes']);
    }
}
