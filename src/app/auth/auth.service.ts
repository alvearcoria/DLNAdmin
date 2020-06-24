import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from  'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User=null;
  dataUser : any=null;

  constructor(public  afAuth:  AngularFireAuth, public  router:  Router, private afs: AngularFirestore,) {
    this.afAuth.authState.subscribe(async user => {
      if (user!=null) {
        await this.getUserAccount(user.uid);
        this.user = user;
        //this.router.navigate(['/pages']);
      } else {

      }
    })
   }

  login(email:  string, password:  string) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email,password)

      .then(async res => {
        await this.getUserAccount(res.user.uid);
        resolve(res);
      }, err => reject(err))
    })

  }

  logout(){
    return this.afAuth.signOut().then(() => {
      this.dataUser=null;
      this.router.navigate(['login']);
    })
  }

  get isLoggedIn(): boolean {
    return this.user !== null;
  }

  get currentUserId(): string {
    return this.isLoggedIn ? this.user.uid : '';
  }

  async getUserAccount(idUser: string){
    await new Promise(resolve => {
      this.afs.collection('app-covid').doc('selacademy').collection('usuarios').doc(idUser).valueChanges().subscribe(
        x=>{
          this.dataUser=x;
          resolve();
        })
    }).then(()=>{

    });
  }
}
