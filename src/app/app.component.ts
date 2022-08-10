import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(
        private userService: UserService,
    ){}

    ngOnInit(): void {
        // check to see whether user info is saved in local storage
        this.userService.autoLogin();
    }
}
