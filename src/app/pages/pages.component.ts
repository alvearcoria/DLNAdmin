import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS } from './pages-menu';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout *ngIf="done">
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {

  menu = [];
  done: boolean = false;

  constructor( private auth: AuthService) {
    console.log(MENU_ITEMS);
  }

  ngOnInit(): void {
    this.auth.afAuth.authState.subscribe(
      async x => {
        if (x != null) {
          await this.auth.getUserAccount(x.uid);
          let menu_prueba = [];
          MENU_ITEMS.forEach(m => {
            if (this.auth.dataUser.permisos[m.title]) {
              let menu = m;
              if (m.children) {
                let submenu = []
                m.children.forEach(sub => {
                  if (this.auth.dataUser.permisos[m.title][sub.title]) {
                    submenu.push(sub);
                  }
                })
                delete menu.children;
                menu.children = submenu;
              }
              menu_prueba.push(menu);
            }
          });
          this.menu = menu_prueba;
          this.done = true;
        } else {
        }
      });
  }
}
