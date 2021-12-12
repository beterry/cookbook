import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, pipe } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable()
export class UserInterceptorService implements HttpInterceptor {
    constructor(
        private userService: UserService,
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.userService.user.pipe(
            take(1),
            exhaustMap(user => {
                //-- no token required for GET requests
                if (req.method === 'GET'){
                    console.log('Sending GET request. Not editing the request...');
                    console.log(req.urlWithParams);
                    return next.handle(req);
                }

                //-- don't edit the request when signing in
                if (req.url.includes('signInWithPassword')){
                    console.log('Signing in. Not editing the request...');
                    console.log(req.urlWithParams);
                    return next.handle(req);
                }

                //-- if not a GET request and there is no user, don't even try
                if (!user){
                    console.log('No user. Not sending the request...');
                    return EMPTY;
                }

                console.log('Adding token to request...');
                console.log(req.urlWithParams);

                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth', user.token)
                })
                return next.handle(modifiedReq);
            })
        )
    }
}
