import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Ingredient, Recipe, Prep, Instruction } from '../recipe.model';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RecipeFormService } from './recipe-form.service';
import { DialogService } from '../services/dialog.service';

@Component({
    selector: 'app-recipe-form',
    templateUrl: './recipe-form.component.html',
    styleUrls: ['./recipe-form.component.scss'],
})
export class RecipeFormComponent implements OnInit, OnDestroy {
    formType: string;
    id: string;
    recipe: Recipe;
    recipeForm: FormGroup;
    dialogDeleteSubscription: Subscription;

    // get functions that return recipe info as form arrays
    get ingredients(){
        return this.recipeForm.get('ingredients') as FormArray;  
    }
    get prep(){
        return this.recipeForm.get('prep') as FormArray;  
    }
    get instructions(){
        return this.recipeForm.get('instructions') as FormArray;  
    }

    getPrepStep(index: number): FormGroup{
        return this.prep.at(index) as FormGroup;
    }

    getInstructionStep(index: number): FormGroup{
        return this.instructions.at(index) as FormGroup;
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private recipeService: RecipeService,
        private formService: RecipeFormService,
        private builder: FormBuilder,
        private dialogService: DialogService,
    ) {}

    ngOnInit(): void {
        // determine whether user is creating or editing a recipe
        this.formType = this.route.snapshot.paramMap.get('form') || 'new';

        if (this.formType === 'new'){
            this.initForm();
        }else {
            // get recipe data from service
            this.getRecipe()
                .pipe(
                    tap(recipe => {
                        this.recipe = recipe
                    })
                )
                .subscribe(recipe => {
                    if (recipe){
                        this.initForm(recipe)
                    } else {
                        this.handleRecipeNotFound();
                    }
                })
        }

        // listen for a dialog to confirm recipe deletion
        this.dialogDeleteSubscription = this.dialogService.dispatch.subscribe(dialog => {
            if (dialog.action === 'DELETE_RECIPE'){
                this.recipeService.deleteRecipe(this.id);
                this.router.navigate(['/recipes']);
            }
        })
    }

    ngOnDestroy(): void {
        // reset the form service

        // makes sure if you navigate back to the same recipe, no steps are open
        this.formService.editPrepStep.next(-1);
        this.formService.editInstructionStep.next(-1);

        // unsubscribe so this form is no longer listening for the dialog
        this.dialogDeleteSubscription.unsubscribe();
    }

    getRecipe(): Observable<Recipe>{
        this.id = this.route.snapshot.paramMap.get('id') || "000";
        return this.recipeService.getRecipe(this.id);
    }

    initForm(recipe?: Recipe): void {
        // insert recipe details into the form
        if (recipe){
            this.recipeForm = this.builder.group({
                name: [recipe.name, Validators.required],
                imageURL: [recipe.imageURL, Validators.required],
                source: recipe.source,
                ingredients: this.composeIngredientFormArray(recipe.ingredients),
                prep: this.composePrepFormArray(recipe.prep),
                instructions: this.composeInstructionsFormArray(recipe.instructions),
            })
        // start form as blank
        } else {
            this.recipeForm = this.builder.group({
                name: ['', Validators.required],
                imageURL: ['', Validators.required],
                source: '',
                ingredients: this.builder.array([]),
                prep: this.builder.array([]),
                instructions: this.builder.array([]),
            })
        }
    }

    // save button
    handleSubmit(){
        if (this.formType === 'new'){
            this.recipeService.addRecipe(this.recipeForm.value);
            this.router.navigate(['/recipes']);
        }else{
            this.recipeService.updateRecipe(this.id, this.recipeForm.value)
            this.router.navigate(['/recipe', 'details', this.id]);
        }
    }

    //============================================
    // USER INTERACTION
    //============================================

    handleDeleteRecipe(){
        if (this.formType === 'new'){
            this.router.navigate(['/recipes']);
        }else {
            // open dialog to confirm the deletion action
            this.dialogService.dialog.next({
                open: true, 
                action: 'DELETE_RECIPE',
                title: 'Are you sure you want to delete ' + this.recipe.name + '?'
            });
        }
    }

    handleAddIngredient(){
        this.ingredients.push(this.builder.group({
            name: ['', Validators.required],
            quantity: 1,
            unit: '',
        }))
    }

    handleDeleteIngredient(index: number){
        this.ingredients.removeAt(index);
    }

    handleAddPrepStep(){
        this.prep.push(this.getBlankPrepStep());

        // emits the index of the new step
        // this is caught in the component and enables edit mode
        this.formService.editPrepStep.next(this.prep.length - 1);
    }

    handleDeletePrepStep(index: number){
        this.prep.removeAt(index);
    }

    handlePrepStepUp(index: number){
        // step is already at the top
        if (index <= 0){
            return;
        }

        // grab control that's moving
        const movingStep = this.prep.controls[index];

        // remove and then re-add
        this.prep.removeAt(index);
        this.prep.insert(index - 1, movingStep);
    }

    handlePrepStepDown(index: number){
        // step is already at the bottom
        if (index >= this.prep.length){
            return;
        }

        // grab control that's moving
        const movingStep = this.prep.controls[index];

        // remove and then re-add
        this.prep.removeAt(index);
        this.prep.insert(index + 1, movingStep);
    }

    handleAddInstruction(){
        this.instructions.push(this.getBlankInstruction());

        // emits the index of the new step
        // this is caught in the component and enables edit mode
        this.formService.editInstructionStep.next(this.instructions.length - 1);
    }

    handleDeleteInstruction(index: number){
        this.instructions.removeAt(index);
    }

    handleInstructionUp(index: number){
        // step is already at the top
        if (index <= 0){
            return;
        }

        // grab control that's moving
        const movingStep = this.instructions.controls[index];

        // remove and then re-add
        this.instructions.removeAt(index);
        this.instructions.insert(index - 1, movingStep);
    }

    handleInstructionDown(index: number){
        // step is already at the bottom
        if (index >= this.instructions.length){
            return;
        }

        // grab control that's moving
        const movingStep = this.instructions.controls[index];

        // remove and then re-add
        this.instructions.removeAt(index);
        this.instructions.insert(index + 1, movingStep);
    }

    //============================================
    // FORM UTILITIES
    // take data from the API and construct Angular form components
    //============================================

    composeIngredientFormArray(ingredients: Ingredient[]):FormArray {
        let ingredientFormArray = this.builder.array([]);

        if (ingredients.length){
            ingredients.forEach(ingredient => {
                ingredientFormArray.push(
                    this.builder.group({
                        name: [ingredient.name, Validators.required],
                        quantity: [ingredient.quantity],
                        unit: [ingredient.unit || ''],
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
                // 1. create a child FormArray for the step's ingredients
                let ingredientFormArray = this.builder.array([]);
                if (step.ingredients){
                    step.ingredients.forEach(ingredient => {
                        ingredientFormArray.push(this.builder.control(ingredient, Validators.required));
                    })
                }

                // 2. assign remaining value to parent FormArray
                prepFormArray.push(this.builder.group({
                    name: [step.name, Validators.required],
                    description: step.description ? step.description : '',
                    ingredients: ingredientFormArray,
                }))
            })
        }

        return prepFormArray;
    }

    getBlankPrepStep(): FormGroup {
        return this.builder.group({
            name: ['', Validators.required],
            description: '',
            ingredients: this.builder.array([])
        })
    }

    composeInstructionsFormArray(instructions: Instruction[]): FormArray {
        let instructionsFormArray = this.builder.array([]);

        if (instructions.length){
            instructions.forEach(step => {
                // 1. create a child FormArray for the step's ingredients
                let ingredientFormArray = this.builder.array([]);
                if (step.ingredients){
                    step.ingredients.forEach(ingredient => {
                        ingredientFormArray.push(this.builder.control(ingredient, Validators.required));
                    })
                }

                // 2. assign remaining value to parent FormArray
                instructionsFormArray.push(this.builder.group({
                    text: [step.text, Validators.required],
                    time: step.time ? step.time : '',
                    ingredients: ingredientFormArray,
                }))
            })
        }

        return instructionsFormArray;
    }

    getBlankInstruction(): FormGroup { 
        return this.builder.group({
            text: ['', Validators.required],
            time: '',
            ingredients: this.builder.array([])
        })
    }

    handleRecipeNotFound(){
        console.log('Recipe not found!');
        this.router.navigate(['recipes']);
    }
}
