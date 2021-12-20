import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../services/recipe.service';
import { ShoppingListService } from '../services/shopping-list.service';

@Component({
    selector: 'app-recipe-gallery',
    templateUrl: './recipe-gallery.component.html',
    styleUrls: ['./recipe-gallery.component.scss'],
})
export class RecipeGalleryComponent implements OnInit {
    recipes: Recipe[] = [];
    selectedRecipes: string[] = [];

    constructor(
        private recipeService: RecipeService,
        private shoppingListService: ShoppingListService,
    ) {}

    ngOnInit(): void {
        this.recipeService.getRecipes()
            .subscribe(recipes => this.recipes = recipes);
    }

    handleSelectRecipe(recipeId: string){
        const selectedRecipeIndex = this.selectedRecipes.indexOf(recipeId);

        if (selectedRecipeIndex > -1){
            this.selectedRecipes.splice(selectedRecipeIndex, 1);
        }else {
            this.selectedRecipes.push(recipeId);
        }
    }

    isSelected(recipeId: string){
        return this.selectedRecipes.includes(recipeId);
    }

    addRecipesToList() {
        this.shoppingListService.addRecipesToList(this.selectedRecipes);

        //-- reset selected recipes
        this.selectedRecipes = [];
    }
}
