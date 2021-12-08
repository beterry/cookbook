import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RecipeFormService {
    public editPrepStep = new BehaviorSubject<number>(-1);
    public editInstructionStep = new BehaviorSubject<number>(-1);

    constructor() {}
}
