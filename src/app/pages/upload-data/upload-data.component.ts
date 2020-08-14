import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, empty, combineLatest } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { GridOptions } from 'ag-grid-community';
import { ExcelService } from './../../service/excel.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProgressbarConfig } from 'ngx-bootstrap/progressbar';
import { map, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';
import Swal from 'sweetalert2';
import { param } from 'jquery';
import { DatePipe } from '@angular/common';

export function getProgressbarConfig(): ProgressbarConfig {
  return Object.assign(new ProgressbarConfig(), { animate: true, striped: true });
}

@Component({
  selector: 'dln-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss'],
  providers: [{ provide: ProgressbarConfig, useFactory: getProgressbarConfig }]
})
export class UploadDataComponent implements OnInit {
  done: boolean = false;
  routeData: any;
  urltemplate: any;

  pasesPorAtender: Observable<any>;
  subscription: Subscription;

  bandProspRam = false;
  estado: any;

  @ViewChild('modalLoadData') public modalLoadData: ElementRef;
  modalRef: BsModalRef;
  configModal = {
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-sm'
  };

  columnasFirstTable = [
    { width: 120, headerName: 'No Control', field: 'noControl', pinned: 'left', sortable: true, filter: true },
    { width: 250, headerName: 'Nombre(s)', field: 'nombres', pinned: 'left', sortable: true, filter: true },
    { width: 80, headerName: 'Apellido Paterno', field: 'apellido_1', sortable: true, filter: true },
    { width: 120, headerName: 'Apellido Materno', field: 'apellido_2', sortable: true, filter: true },
    { width: 150, headerName: 'sexo', field: 'sexo', sortable: true, filter: true },
    //  { width: 120, headerName: 'Monto', field: 'monto_credito', cellRenderer: this.CurrencyCellRenderer },
    { width: 80, headerName: 'Borrar', cellRenderer: this.borrarRender, sortable: true, filter: true },
    { width: 80, headerName: 'Detalles', cellRenderer: this.detallesRender, sortable: true, filter: true }
  ];

  prospLoad = 30;
  //counter: any;
  prospecto = null;
  prospecto2 = null;
  prospectosRam: any;
  duplicados = 0;
  nuevos = 0;

  firstTable: GridOptions;

  rForm: FormGroup;

  currentDate = new Date();

  public result: any;
  private xlsxToJsonService: ExcelService = new ExcelService();

  uid_user: any;

  constructor(private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public afs: AngularFirestore, private auth: AuthService, private modalService: BsModalService, public datepipe: DatePipe,) {
    this.rForm = this.fb.group({
      'archivo': [null, Validators.required],
    });

    this.firstTable = <GridOptions>{
      columnDefs: this.columnasFirstTable,
      rowData: null,
      getRowStyle: this.validarProspectos,
    };
  }

  validarProspectos(params) {
    if (params.data.estatus === 'duplicado') {
      return { background: '#ff7676' }
    }
    return null;
  }

  gridReady(params) {

    this.firstTable.headerHeight = 40;
    this.firstTable.api.setRowData(this.prospectosRam);
    const allColumnIds = [];
    this.firstTable.columnApi.getAllColumns().forEach(function (column) {
      // @ts-ignore
      allColumnIds.push(column['colId']);
    });
  }

  async ngOnInit() {
    await this.route.queryParams.subscribe(async params => {
      this.routeData = params.data;
      console.log(params.data)
      if (this.routeData == 'tutores') {
        this.urltemplate = 'https://firebasestorage.googleapis.com/v0/b/dln-covid-control.appspot.com/o/templete%2Ftemplate_tutores.xlsx?alt=media&token=db9e2b97-1a54-4d69-b3d4-b57f62e04cd5';
      } else {
        this.urltemplate = 'https://firebasestorage.googleapis.com/v0/b/dln-covid-control.appspot.com/o/templete%2Ftemplate_alumnos.xlsx?alt=media&token=c9235f8e-9e86-4888-b8ea-8466c2dd527c';
      }
      this.done = true;
    });
  }

  orQuery(noControl) {

    let queryString: Observable<any[]> = empty();
    let queryNumber: Observable<any[]> = empty();

    queryString = this.afs.collection('app-covid').doc('selacademy').collection('alumnos', ref =>
      ref.where('noControl', '==', noControl + "")
    ).valueChanges().take(1);

    queryNumber = this.afs.collection('app-covid').doc('selacademy').collection('alumnos', ref =>
      ref.where('noControl', '==', Number(noControl))
    ).valueChanges().take(1);

    return combineLatest(queryNumber, queryString).pipe(
      map(([queryNumber, queryString]) => [...queryNumber, ...queryString])
    )
  }

  handleFile(event) {
    Swal.fire({
      title: 'Subiendo datos del archivo...',
      text: 'Los datos de los ' + this.routeData + ' se estan validando en el sistma.',
      imageUrl: 'assets/images/loading.gif',
      showCancelButton: false,
      showConfirmButton: false
    });
    this.bandProspRam = false;
    this.prospectosRam = null;
    this.nuevos = 0;
    this.duplicados = 0;

    let file = event.target.files[0];
    this.xlsxToJsonService.processFileToJson({}, file).subscribe(async data => {
      this.result = JSON.stringify(data['sheets'].Prospectos);
      this.prospectosRam = JSON.parse(this.result);

      //console.log(this.bandProspRam);

      await Promise.all(this.prospectosRam.map(async p => {
        await new Promise(resolve => {
          //console.log(p);
          let checkNoInf = this.orQuery(p.noControl);
          checkNoInf.subscribe(x => {
            if (x.length > 0) {
              p['estatus'] = 'duplicado'
              this.duplicados++;
              resolve();
            } else {
              p['estatus'] = 'nuevo';
              this.nuevos++;
              resolve();
            }
          })
        });
      })).then(() => {
        this.bandProspRam = true;
        Swal.close();
      });
    })
  }

  private borrarRender(params: any) {
    if (params['data']['estatus'] === 'duplicado') {
      var button = document.createElement('button');
      button.innerHTML = '<i class="fa fa-trash"></i>';
      button.classList.add("btn");
      button.classList.add("btn-danger");
      button.classList.add("btn-xs");
      return button;
    }
  }

  private detallesRender(params: any) {
    if (params['data']['estatus'] === 'duplicado') {
      var button2 = document.createElement('button');
      button2.innerHTML = '<i class="fa fa-info"></i>';
      button2.classList.add("btn");
      button2.classList.add("btn-warning");
      button2.classList.add("btn-xs");
      return button2;
    }
  }

  onCellClicked(event: any) {
    if (event['colDef']['headerName'] == 'Borrar') {
      let i = 0;
      this.prospectosRam.forEach(prosp => {
        if (prosp === event['data']) {
          this.prospectosRam.splice(i, 1);
          this.duplicados--;
        }
        i++;
      });
      this.firstTable.api.setRowData(this.prospectosRam);
      const allColumnIds = [];
      this.firstTable.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column['colId']);
      });
      this.prospecto = null;
      this.prospecto2 = null;
    }

    if (event['colDef']['headerName'] == 'Detalles') {
      this.orQuery(event['data']['noControl']).subscribe(
        x => {
          this.prospecto = x[0];
          console.log(this.prospecto.f_nacimiento)
          this.prospecto.f_nacimiento = this.datepipe.transform(this.prospecto.f_nacimiento.seconds * 1000, 'yyyy-MM-dd') ;
          this.prospecto2 = event['data'];
        });
    }
  }

  cerrarModal() {
    this.modalRef.hide();
  }

  guargarProspectos() {
    const ref = this.afs.collection('app-covid').doc('selacademy').collection('alumnos');
    let cont = 0;
    let id;
    this.modalRef = this.modalService.show(this.modalLoadData, this.configModal);

    this.prospectosRam.forEach(async prosp => {
      prosp['user_reg'] = this.auth.currentUserId;
      prosp['f_creado'] = new Date();
      prosp['fullName'] = prosp['nombres'] + ' ' + prosp['apellido_1'] + ' ' + prosp['apellido_2'];
      prosp['f_nacimiento'] = new Date(prosp['f_nacimiento']+'T00:00:00');
      id = prosp['noControl'].toString();

      ref.doc('counter').valueChanges().pipe(take(1)).subscribe(async c => {
        const idNum = Number(c['counter']) + 1;
        prosp['idNumerico'] = idNum;

        await new Promise(resolve => {

          ref.doc(id).set(prosp).then(() => {
            cont++;
            this.prospLoad = cont;
            console.log('prospecto creado');
            if (this.prospLoad == this.prospectosRam.length) {
              this.cerrarModal();
              Swal.fire('¡Se han agregado los ' + cont + ' prospectos correctamente a la Base de Datos!', 'Prospectos almacenados', 'success');
              this.reiniciarComponente()
            }
            resolve();
          })
        });
        ref.doc('counter').set({ counter: idNum });
      });

    });
  }

  reiniciarComponente() {
    this.prospectosRam = [];
    this.rForm.reset();
    this.prospecto = null;
    this.prospecto2 = null;
    this.bandProspRam = false;
  }
}
