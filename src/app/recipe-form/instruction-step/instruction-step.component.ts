import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

    get ingredients(){
        return this.group.get('ingredients') as FormArray;
    }

    constructor(
        private builder: FormBuilder,
    ) {}

    ngOnInit(): void {}

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

}
