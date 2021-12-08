import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RecipeFormService } from '../recipe-form.service';

@Component({
  selector: 'app-instruction-step',
  templateUrl: './instruction-step.component.html',
  styleUrls: ['./instruction-step.component.scss']
})
export class InstructionStepComponent implements OnInit {
    @Input() group: FormGroup;
    @Input() stepIndex: number;
    @Output() delete = new EventEmitter();
    @Output() moveUp = new EventEmitter();
    @Output() moveDown = new EventEmitter();

    editStep: boolean = false;
    editStepSubscription: Subscription;

    get ingredients(){
        return this.group.get('ingredients') as FormArray;
    }

    constructor(
        private builder: FormBuilder,
        private formService: RecipeFormService,
    ) {}

    ngOnInit(): void {
        //-- a new value is emitted when a new prep step is created (RecipeFormComponent)
        //-- check to see if this prep step is the new one
        //-- if it is, enable editing
        this.editStepSubscription = this.formService.editInstructionStep.subscribe(index => {
            if (index === this.stepIndex){
                this.editStep = true;
            }
        })
    }

    handleDeleteInstruction(){
        this.delete.emit();
    }

    handleInstructionUp(){
        this.moveUp.emit();
    }

    handleInstructionDown(){
        this.moveDown.emit();
    }

    handleDeleteIngredient(ingredientIndex: number){
        this.ingredients.removeAt(ingredientIndex);
    }

    handleAddIngredient(){
        this.ingredients.push(this.builder.control('', Validators.required));
    }

    toggleEditStep(){
        this.editStep = !this.editStep;
    }
}
