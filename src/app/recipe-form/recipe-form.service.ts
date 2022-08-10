import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RecipeFormService {
    // used to signal when specific steps are open and ready to edit
    public editPrepStep = new BehaviorSubject<number>(-1);
    public editInstructionStep = new BehaviorSubject<number>(-1);

    constructor() {}
}
