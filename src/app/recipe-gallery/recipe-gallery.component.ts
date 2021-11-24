import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
    selector: 'app-recipe-gallery',
    templateUrl: './recipe-gallery.component.html',
    styleUrls: ['./recipe-gallery.component.scss'],
})
export class RecipeGalleryComponent implements OnInit {
    recipes: Recipe[] = [];

    constructor(private recipeService: RecipeService) {}

    ngOnInit(): void {
        this.getRecipes();
    }

    getRecipes(): void{
        this.recipeService.getRecipes()
            .subscribe(recipes => this.recipes = recipes);
    }
}
