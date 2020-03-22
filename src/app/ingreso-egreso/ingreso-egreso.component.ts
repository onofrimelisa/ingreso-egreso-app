import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from "../services/ingreso-egreso.service";
import Swal from "sweetalert2";
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubs: Subscription;

  constructor( private fb: FormBuilder,
                private _ies: IngresoEgresoService,
                  private store: Store<AppState>) { }

  ngOnInit() {

    this.loadingSubs = this.store.select('ui')
      .subscribe( (ui) => this.cargando = ui.isLoading );

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required ],
      monto: ['', Validators.required ],
    })
  }

  guardar(){

    this.store.dispatch( ui.isLoading() );

    if (this.ingresoForm.valid) {
      const { descripcion, monto } = this.ingresoForm.value;
      const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo );  
      delete ingresoEgreso.uid;
      
      this._ies.crearIngresoEgreso( ingresoEgreso )
      .then((resp)=> {
        this.ingresoForm.reset();
        Swal.fire({
           title: 'Registro creado',
           text: descripcion,
           icon: 'success',
           confirmButtonText: 'Ok'
        });
        this.store.dispatch( ui.stopLoading() );
        
      })
      .catch( (err)=>{
        Swal.fire({
           title: 'Error',
           text: err.message,
           icon: 'error',
           confirmButtonText: 'Ok'
        });
        this.store.dispatch( ui.stopLoading() );
      });
    }
    
  }

  ngOnDestroy(){
    this.loadingSubs.unsubscribe();
  }


}
