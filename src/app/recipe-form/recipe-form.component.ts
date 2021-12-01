import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Location } from '@angular/common';
import { Ingredient, Recipe, Prep, Instruction } from '../recipe.model';

@Component({
    selector: 'app-recipe-form',
    templateUrl: './recipe-form.component.html',
    styleUrls: ['./recipe-form.component.scss'],
})
export class RecipeFormComponent implements OnInit {
    id: string;
    recipe: Recipe;
    recipeForm: FormGroup;

    get ingredients(){
        return this.recipeForm.get('ingredients') as FormArray;  
    }

    get prep(){
        return this.recipeForm.get('prep') as FormArray;  
    }

    get instructions(){
        return this.recipeForm.get('instructions') as FormArray;  
    }

    getPrepIngredients(index: number): FormArray{
        return this.prep.at(index).get('ingredients') as FormArray;
    }

    getInstructionIngredients(index: number): FormArray{
        return this.instructions.at(index).get('ingredients') as FormArray;
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private recipeService: RecipeService,
        private location: Location,
        private builder: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.getRecipe();
    }

    initForm(recipe: Recipe): void {
        //-- insert recipe details into the form
        this.recipeForm = this.builder.group({
            name: [recipe.name, Validators.required],
            imageURL: [recipe.imageURL],
            ingredients: this.composeIngredientFormArray(recipe.ingredients),
            prep: this.composePrepFormArray(recipe.prep),
            instructions: this.composeInstructionsFormArray(recipe.instructions),
        })
    }

    getRecipe(): void{
        this.id = this.route.snapshot.paramMap.get('id') || "000";
        this.recipeService
            .getRecipe(this.id)
            .subscribe((recipe) => {
                this.recipe = recipe;
                this.initForm(recipe);
            });
    }

    handleSubmit(){
        console.warn(this.recipeForm.value);
        this.recipeService.updateRecipe(this.id, this.recipeForm.value);
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    handleDeleteRecipe(){
        this.recipeService.deleteRecipe(this.id);
        this.router.navigate(['/recipes']);
    }

    handleAddIngredient(){
        this.ingredients.push(this.builder.group({
            name: '',
            quantity: '',
        }))
    }

    handleDeleteIngredient(index: number){
        this.ingredients.removeAt(index);
    }

    handleAddPrepStep(){
        this.prep.push(this.getBlankPrepStep());
    }

    handleDeletePrepStep(index: number){
        this.prep.removeAt(index);
    }

    handlePrepStepUp(index: number){
        //-- step is already at the top
        if (index <= 0){
            return;
        }

        //-- grab control that's moving
        const movingStep = this.prep.controls[index];

        //-- remove and then re-add
        this.prep.removeAt(index);
        this.prep.insert(index - 1, movingStep);
    }

    handlePrepStepDown(index: number){
        //-- step is already at the bottom
        if (index >= this.prep.length){
            return;
        }

        //-- grab control that's moving
        const movingStep = this.prep.controls[index];

        //-- remove and then re-add
        this.prep.removeAt(index);
        this.prep.insert(index + 1, movingStep);
    }

    handleAddPrepIngredient(prepIndex: number){
        this.getPrepIngredients(prepIndex).push(this.builder.control(''));
    }

    handleDeletePrepIngredient(prepIndex: number, ingredientIndex: number){
        this.getPrepIngredients(prepIndex).removeAt(ingredientIndex);
    }

    handleAddInstruction(){
        this.instructions.push(this.getBlankInstruction());
    }

    handleDeleteInstruction(index: number){
        this.instructions.removeAt(index);
    }

    handleInstructionUp(index: number){
        //-- step is already at the top
        if (index <= 0){
            return;
        }

        //-- grab control that's moving
        const movingStep = this.instructions.controls[index];

        //-- remove and then re-add
        this.instructions.removeAt(index);
        this.instructions.insert(index - 1, movingStep);
    }

    handleInstructionDown(index: number){
        //-- step is already at the bottom
        if (index >= this.instructions.length){
            return;
        }

        //-- grab control that's moving
        const movingStep = this.instructions.controls[index];

        //-- remove and then re-add
        this.instructions.removeAt(index);
        this.instructions.insert(index + 1, movingStep);
    }

    handleAddInstructionIngredient(stepIndex: number){
        this.getInstructionIngredients(stepIndex).push(this.builder.control(''));
    }

    handleDeleteInstructionIngredient(stepIndex: number, ingredientIndex: number){
        this.getInstructionIngredients(stepIndex).removeAt(ingredientIndex);
    }

    composeIngredientFormArray(ingredients: Ingredient[]):FormArray {
        let ingredientFormArray = this.builder.array([]);

        if (ingredients.length){
            ingredients.forEach(ingredient => {
                ingredientFormArray.push(
                    this.builder.group({
                        name: [ingredient.name],
                        quantity: [ingredient.quantity],
                    })
                )
            })
        }

        return ingredientFormArray;
    }

    composePrepFormArray(prepSteps: Prep[]): FormArray{
        let prepFormArray = this.builder.array([]);

        if (prepSteps.length){
            prepSteps.forEach(step => {
                //-- 1. create a child FormArray for the step's ingredients
                let ingredientFormArray = this.builder.array([]);
                step.ingredients.forEach(ingredient => {
                    ingredientFormArray.push(this.builder.control(ingredient));
                })

                //-- 2. assign remaining value to parent FormArray
                prepFormArray.push(this.builder.group({
                    name: step.name,
                    description: step.description,
                    ingredients: ingredientFormArray,
                }))
            })
        }

        return prepFormArray;
    }

    getBlankPrepStep(): FormGroup{
        return this.builder.group({
            name: '',
            description: '',
            ingredients: this.builder.array([])
        })
    }

    composeInstructionsFormArray(instructions: Instruction[]): FormArray{
        let instructionsFormArray = this.builder.array([]);

        if (instructions.length){
            instructions.forEach(step => {
                //-- 1. create a child FormArray for the step's ingredients
                let ingredientFormArray = this.builder.array([]);
                step.ingredients.forEach(ingredient => {
                    ingredientFormArray.push(this.builder.control(ingredient));
                })

                //-- 2. assign remaining value to parent FormArray
                instructionsFormArray.push(this.builder.group({
                    text: step.text,
                    time: step.time,
                    ingredients: ingredientFormArray,
                }))
            })
        }

        return instructionsFormArray;
    }

    getBlankInstruction(): FormGroup{
        return this.builder.group({
            text: '',
            time: '',
            ingredients: this.builder.array([])
        })
    }
}
