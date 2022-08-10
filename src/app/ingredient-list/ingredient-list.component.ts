import { Component, Input, OnInit } from '@angular/core';
import { Ingredient } from '../recipe.model';

@Component({
    selector: 'app-ingredient-list',
    templateUrl: './ingredient-list.component.html',
    styleUrls: ['./ingredient-list.component.scss'],
})
export class IngredientListComponent implements OnInit {
    @Input() ingredients?: Ingredient[];

    constructor() { }

    ngOnInit(): void { }
}
