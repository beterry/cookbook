import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../login/User';

interface LoginRes {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    user = new BehaviorSubject<User>(null);
    private loginUrl: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';

    constructor(
        private http: HttpClient,
    ) {}

    login(email: string, password: string){
        return this.http.post<LoginRes>(this.loginUrl + environment.firebaseAPIKey, {
            email: email,
            password: password,
            returnSecureToken: true,
        }).pipe(
            tap(res => {
                //-- make a Date detailing when the token will expire
                const expirationDate = new Date(new Date().getTime() + parseInt(res.expiresIn) * 1000);

                const user = new User(res.email, res.localId, res.idToken, expirationDate);
                this.user.next(user);
            }),
            catchError(this.handleError)
        )
    }

    logout() {
        this.user.next(null);
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage = 'There was an error logging in.'

        if (!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage);
        }

        switch(errorRes.error.error.message){
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'There is no user record corresponding to this identifier.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'The password or username is incorrect.';
                break;
            default:
                errorMessage = 'There was an error logging in.';
        };

        return throwError(errorMessage);
    }
}
