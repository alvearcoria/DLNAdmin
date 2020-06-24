import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AngularFireAuth } from "@angular/fire/auth";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public auth: AuthService,
    public router: Router,
    private firebaseAuth: AngularFireAuth
  ) { }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.firebaseAuth.authState
      .take(1)
      .map(authState => !!authState)
      .do(authenticated => {
        if (authenticated) {
          console.log('sesion iniciada');
          return true;
        }
        if (!authenticated) {
          console.log('sin secion iniciada');
          this.router.navigate(['/login']);
          return false;
        }
      });
  }

}


