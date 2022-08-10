import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    isLoading: boolean = false;
    error: string = null;

    constructor(
        private userService: UserService,
        private router: Router,
    ) {}

    ngOnInit(): void { }

    // log in button
    handleSubmit(form: {email: string, password: string}){
        this.isLoading = true;
        this.error = null;

        // subscribe to the result of user service authenticating the user information
        this.userService.login(form.email, form.password)
            .subscribe(
                // success
                res => {
                    console.log(res);
                    this.isLoading = false;
                    this.router.navigate(['/recipes']);
                },
                // error
                errorMessage => {
                    console.log(errorMessage);
                    this.error = errorMessage;
                    this.isLoading = false;
                }
            )
    }
}
