import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    isAdmin: boolean = false;
    userSub: Subscription;

    constructor(
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.userSub = this.userService.user.subscribe(user => {
            this.isAdmin = !!user;
        })
    }
}
