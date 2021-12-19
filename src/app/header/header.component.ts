import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShoppingListService } from '../services/shopping-list.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    userSub: Subscription;
    listSub: Subscription;
    
    isAdmin: boolean = false;
    listQuantity: number = 0;

    constructor(
        private userService: UserService,
        private shoppingListService: ShoppingListService,
    ) {}

    ngOnInit(): void {
        this.userSub = this.userService.user.subscribe(user => {
            this.isAdmin = !!user;
        })

        this.listSub = this.shoppingListService.shoppingListChanged.subscribe(list => {
            this.listQuantity = list.length;
        })
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
        this.listSub.unsubscribe();
    }

    handleLogout() {
        this.userService.logout();
    }
}
