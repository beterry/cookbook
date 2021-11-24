import { Component, Input, OnInit } from '@angular/core';
import { Instruction } from '../recipe.model';

@Component({
    selector: 'app-instructions-list',
    templateUrl: './instructions-list.component.html',
    styleUrls: ['./instructions-list.component.css'],
})
export class InstructionsListComponent implements OnInit {
    @Input() instructions?: Instruction[];

    constructor() {}

    ngOnInit(): void {}
}
