import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

interface DialogInit {
    open: boolean;
    action: string;
    title?: string;
    data?: {};
};

interface Dispatch {
    action: string;
    data?: {};
};

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    dialog = new BehaviorSubject<DialogInit>({
        open: false,
        action: '',
        title: 'Are you sure you want to do that?'
    });
    dispatch = new Subject<Dispatch>();

    constructor() {}
}
