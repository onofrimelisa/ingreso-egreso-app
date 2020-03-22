import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  ingresosEgresosSubs: Subscription;

  constructor( private store: Store<AppState>,
              private _ies: IngresoEgresoService ) { }

  ngOnInit() {

    this.userSubs = this.store.select('user').pipe(
      filter( auth => auth.user != null )
    ).subscribe( ({user}) => {
      this.ingresosEgresosSubs = this._ies.initIngresosEgresosListener( user.uid )
        .subscribe( (ingresosEgresos) => {
          this.store.dispatch( ingresoEgresoActions.setItems( {items: ingresosEgresos} ) )
        })
    });
  }

  ngOnDestroy(){
    this.ingresosEgresosSubs.unsubscribe();
    this.userSubs.unsubscribe();
  }

}
