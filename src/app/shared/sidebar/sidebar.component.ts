import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from '../../models/usuario.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  userLogged: Usuario;
  userSubs: Subscription;

  constructor( private authService: AuthService,
               private router: Router,
               private store: Store<AppState>) { }

  ngOnInit() {
    this.userSubs = this.store.select('user').subscribe( ({user})=>{
      this.userLogged = user;
      console.log(this.userLogged);
      
    })
  }

  logout() {
    this.authService.logout().then( () => {
      this.router.navigate(['/login']);
    })

  }

  ngOnDestroy(){
    this.userSubs.unsubscribe();
  }

}
