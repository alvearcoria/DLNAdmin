import { Component } from '@angular/core';
import { AuthService } from './../auth.service';

@Component({
  selector: 'ngx-logout',
  template: '<p>hola</p>',
})
export class LogoutComponent {

  constructor(public auth: AuthService) {
    this.auth.logout()
  }
}
