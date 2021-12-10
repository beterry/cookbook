import { Component, OnInit } from '@angular/core';
import { DialogService } from '../services/dialog.service';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
    isOpen: boolean = false;
    action: string = '';
    data: object | undefined = {};
    title: string;

    constructor(
        private dialogService: DialogService,
    ) {}

    ngOnInit(): void {
        this.dialogService.dialog.subscribe(dialog => {
            this.isOpen = dialog.open;
            this.action = dialog.action;
            this.data = dialog?.data;
            this.title = dialog?.title || 'Are you sure?';
        })
    }

    closeDialog() {
        this.isOpen = false;
    }

    confirmDialog() {
        this.dialogService.dispatch.next({
            action: this.action,
            data: this.data,
        })

        this.isOpen = false;
    }
}
