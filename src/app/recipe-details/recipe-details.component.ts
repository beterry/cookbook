import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
    selector: 'app-recipe-details',
    templateUrl: './recipe-details.component.html',
    styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent implements OnInit {
    recipe: Recipe | undefined;
    tab = 'ingredients';
    showActions = false;

    constructor(
        private route: ActivatedRoute,
        private recipeService: RecipeService,
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
}
