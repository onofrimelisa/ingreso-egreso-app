import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  loading: boolean = false;
  uiSubs: Subscription;


  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router,
               private store: Store<AppState> ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required ],
    });

    this.uiSubs = this.store.select('ui').subscribe( ui => {
      this.loading = ui.isLoading;
    })
  }

  login() {

    if ( this.loginForm.invalid ) { return; }

    this.store.dispatch( ui.isLoading() )

    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    const { email, password } = this.loginForm.value;

    this.authService.loginUsuario( email, password )
      .then( credenciales => {
        console.log(credenciales);
        // Swal.close();
        this.store.dispatch( ui.stopLoading( ) );
        this.router.navigate(['/']);
      })
      .catch( err => {
        this.store.dispatch( ui.stopLoading( ) );

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        })
      });

  }
  
  ngOnDestroy(){
    this.uiSubs.unsubscribe();
  }

}
