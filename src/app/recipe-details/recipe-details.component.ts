import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
    selector: 'app-recipe-details',
    templateUrl: './recipe-details.component.html',
    styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent implements OnInit {
    recipe?: Recipe;
    tab = 'ingredients';
    showActions = false;

    constructor(
        private route: ActivatedRoute,
        private recipeService: RecipeService,
        private shoppingListService: ShoppingListService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.getRecipe();
    }

    getRecipe(): void{
        const id = this.route.snapshot.paramMap.get('id') || "000";
        this.recipeService
            .getRecipe(id)
            .subscribe((recipe) => (this.recipe = recipe));
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
}
