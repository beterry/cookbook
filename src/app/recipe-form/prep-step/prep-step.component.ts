import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-prep-step',
    templateUrl: './prep-step.component.html',
    styleUrls: ['./prep-step.component.scss'],
})
export class PrepStepComponent implements OnInit {
    @Input() group: FormGroup;
    @Input() stepIndex: number;
    @Output() delete = new EventEmitter();
    @Output() moveUp = new EventEmitter();
    @Output() moveDown = new EventEmitter();

    get ingredients(){
        return this.group.get('ingredients') as FormArray;
    }

    constructor(
        private builder: FormBuilder,
    ) {}

    ngOnInit(): void {}

    handleDeletePrepStep(){
        this.delete.emit();
    }

    handlePrepStepUp(){
        this.moveUp.emit();
    }

    handlePrepStepDown(){
        this.moveDown.emit();
    }

    handleDeleteIngredient(ingredientIndex: number){
        this.ingredients.removeAt(ingredientIndex);
    }

    handleAddIngredient(){
        this.ingredients.push(this.builder.control('', Validators.required));
    }
}
