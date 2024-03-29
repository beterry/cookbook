import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../login/User';

// data structure of response from Firebase
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
    // components can subscribe to this subject to recieve info about the user status
    user = new BehaviorSubject<User>(null);

    private loginUrl: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
    private autoLogoutTimer: any;

    constructor(
        private http: HttpClient,
    ) {}

    // gets user from Firebase
    login(email: string, password: string){
        return this.http.post<LoginRes>(this.loginUrl + environment.firebaseAPIKey, {
            email: email,
            password: password,
            returnSecureToken: true,
        })
        .pipe(
            tap(res => {
                // make a Date detailing when the token will expire
                const expirationDate = new Date(new Date().getTime() + parseInt(res.expiresIn) * 1000);

                // create a new user with the date from Firebase
                const user = new User(res.email, res.localId, res.idToken, expirationDate);

                // emit the new user data to other components
                this.user.next(user);

                // set timer to log user out
                this.autoLogout(parseInt(res.expiresIn) * 1000);

                // save user data to local storage for use in autoLogin
                localStorage.setItem('user', JSON.stringify(user));
            }),
            catchError(this.handleError)
        )
    }

    // attempts to read user data from local storage
    // if successful, logs the user in
    autoLogin(){
        console.log('Attempting auto-login...')
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('user'));

        if (!userData){
            console.log('Auto-login failed.');
            return;
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        console.log(loadedUser)
        if (loadedUser.token){
            console.log('Auto-login success.')
            
            // the auto login was successful, emit user data to subscribed components
            this.user.next(loadedUser);

            // set a timer for when the user session expires
            const expirationDur = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDur);
        } else {
            localStorage.removeItem('user');
            console.log('Auto-login failed.');
        }
    }

    logout() {
        // emit to other components that there is no user
        this.user.next(null);

        // remove the user's date from local storage
        localStorage.removeItem('user');

        // clear timer created in autoLogout
        if(this.autoLogoutTimer){
            clearTimeout(this.autoLogoutTimer);
        }
    }

    // set a timer to log the user out
    autoLogout(expirationDuration: number) {
        this.autoLogoutTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    // translates Firebase error codes to human readable messages
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
