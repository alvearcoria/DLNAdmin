import { Component, OnInit } from '@angular/core';
import { AuthService } from  './../auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, Params } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  emailError = false;
  passError = false;
  errorMessage: string = '';
  done:boolean=false;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router,) {
    this.auth.afAuth.authState.subscribe(async user => {
      console.log(user);
      if (user!=null) {
        console.log('redirect');
        this.router.navigate(['/pages/dashboard']);
        console.log('redirect 2');
      }else{
        console.log('sin sesion iniciada')
        setTimeout(() => {
          this.done=true;
      }, 2000);
      }
    })
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.onChanges();
   }

   get f() { return this.loginForm.controls; }

   onChanges(): void {
    this.loginForm.get('email').valueChanges.subscribe(val => {
      this.emailError=false;
      if (!this.loginForm.controls['email'].valid)this.emailError=true;
    });

    this.loginForm.get('password').valueChanges.subscribe(val => {
      this.passError=false;
      if (!this.loginForm.controls['password'].valid)this.passError=true;
    });
  }

  ngOnInit() {

  }


  login(){

    this.auth.login(this.loginForm.controls['email'].value,this.loginForm.controls['password'].value)
    .then(res => {
      this.router.navigate(['/pages']);
    }, err => {
      if(err.code == 'auth/user-not-found') this.errorMessage = "El usuario no esta registrado o pudo haber sido eliminado";
      if(err.code == 'auth/wrong-password') this.errorMessage = "La contraseña es incorrecta";
    })
  }
}
