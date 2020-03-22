import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubs: Subscription;

  constructor( private store: Store<AppState>,
                private _ies: IngresoEgresoService ) { }

  ngOnInit() {
    this.ingresosSubs = this.store.select('ingresosEgresos')
      .subscribe( ({items})=>{
        this.ingresosEgresos = items;        
      })
  }

  borrar( uid: string ){

    Swal.fire({
       title: '¿Estas seguro?',
       text: 'Eliminarás el ítem',
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Si, estoy seguro.',
       cancelButtonText: 'Cancelar'
    })
    .then( (result) => {
       if (result.value) {
         this._ies.borrarIngresoEgreso( uid )
         .then(
           () => {
             Swal.fire({
                title: 'Operación realizada con éxito',
                text: 'Se eliminó el ítem.',
                icon: 'success',
                confirmButtonText: 'Ok'
             });
     
           }
         ).catch( (err) => {
           Swal.fire({
              title: 'Error al realizar la operación.',
              text: err.message,
              icon: 'error',
              confirmButtonText: 'Ok'
           });
         })
           
       }
    });

  }

  ngOnDestroy(){
    this.ingresosSubs.unsubscribe();
  }

}
