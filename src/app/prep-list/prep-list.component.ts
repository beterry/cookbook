import { Component, Input, OnInit } from '@angular/core';
import { Prep } from '../recipe.model';

@Component({
    selector: 'app-prep-list',
    templateUrl: './prep-list.component.html',
    styleUrls: ['./prep-list.component.scss'],
})
export class PrepListComponent implements OnInit {
    @Input() prepList?: Prep[];

    constructor() {}

    ngOnInit(): void {}
}
