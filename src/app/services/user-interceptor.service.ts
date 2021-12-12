import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
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

                //-- no token required for GET requests or when there is no user
                if (!user || req.method === 'GET'){
                    return next.handle(req);
                }

                console.log('Adding token to request...');

                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth', user.token)
                })
                return next.handle(modifiedReq);
            })
        )
    }
}
