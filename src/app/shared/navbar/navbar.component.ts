import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit {

  userLogged: Usuario;
  userSubs: Subscription;

  constructor( private store: Store<AppState> ) { }

  ngOnInit() {
    this.userSubs = this.store.select('user').subscribe( ({user})=>{
      this.userLogged = user;
      console.log(this.userLogged);
      
    })
  }

  ngOnDestroy(){
    this.userSubs.unsubscribe();
  }

}
