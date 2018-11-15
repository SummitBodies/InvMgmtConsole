import { DataAccessService } from './../data-access.service';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef  } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MultiFieldSortPipe } from '../multi-field-sort.pipe';
import { Observable, from } from 'rxjs';
import { distinct, filter, debounceTime } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'physmancnsl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('userName') userName: ElementRef;
  @ViewChild('location') location: ElementRef;
  @ViewChild('physCountId') physCountId: ElementRef;
  @ViewChild('login') login: ElementRef;

  public logInForm;
  private _logInFormSubsription: any;
  public physLocIds: string[] = [];
  public locationErrorMessage: string;
  public _recount;
  private physCountIdAndWarehouse: any[] = [];

  constructor(
    public fb: FormBuilder,
    private router: Router,
    public dataAccess: DataAccessService
  ) {}

  ngOnInit() {
    this.getPhysicalCountIds();

    (this.dataAccess.location && this.dataAccess.location.recount) ?
    this._recount = true : this._recount = false;

    this.logInForm = this.fb.group({
      /* userId: ['RonM', Validators.required],
      warehouseId: ['PARTS', Validators.required],
      locationId: [100, Validators.required],
      physCountId: ['TEST', Validators.required ],
      recount: [ false ], */
      // userId:  [ this.dataAccess.location.countBy || "", Validators.required],
      userId: [
        this.dataAccess.location
          ? this.dataAccess.location.countBy
          : '',
        Validators.required
      ],
      warehouseId: [
        this.dataAccess.location
          ? this.dataAccess.location.warehouse
          : '',
        Validators.required
      ],
      locationId: [
        this.dataAccess.location
          ? this.dataAccess.location.location
          : '',
        Validators.required
      ],
      physCountId: [
        this.dataAccess.location
          ? this.dataAccess.location.physCountId
          : '',
        Validators.required
      ],
      recount: [
        this.dataAccess.location
          ? this.dataAccess.location.recount
          : false
      ]
    });
   //  this.updateLocation(this.logInForm);
    this.logInFormSubscription();
    this.canRecount();
  }

  private logInFormSubscription(): void {
    this._logInFormSubsription = this.logInForm.valueChanges
      .pipe (
        debounceTime(250)
      )
      .subscribe(value => {
        if (this.dataAccess.location.physCountId !== value.physCountId) {
           this.getPhysCountIdsAndWarehouse();
          // this.getPhysicalCountIds();
          this.canRecount();
          this.setWarehouse();
       //   this.physCountId.nativeElement.focus();
      }
        if (this.dataAccess.location.countBy !== value.userId ) {
          value.userId.toUpperCase() === 'RONM' || value.userId.toUpperCase() === 'LARRYH' ?
          this.dataAccess.adminView = true : this.dataAccess.adminView = false;
        }
      });
  }

  public exitUserId(e) {
  }

  public exitLocationId(e) {
  }

public setWarehouse() {
  if (this.physCountIdAndWarehouse.length) {
    const warehousesThisCountId = this.physCountIdAndWarehouse.filter( element => element.physCountId ===
    this.logInForm.controls.physCountId.value );

    this.dataAccess.warehouseIds = [];
    warehousesThisCountId.forEach(element => {
      this.dataAccess.warehouseIds.push(element.warehouseId);
    });

    if ( this.dataAccess.warehouseIds.length === 1) {
      this.logInForm.patchValue({warehouseId: this.dataAccess.warehouseIds[0]});
    //  this.location.nativeElement.focus();
    }
  }
}

 public canRecount() {
   this.updateLocation(this.logInForm);

   if ( !this.logInForm.controls.physCountId.value ||
    !this.logInForm.controls.warehouseId.value ||
    !this.logInForm.controls.locationId.value) {
    this._recount = false;
    this.logInForm.patchValue({ recount: false });
    return;
   }
  this._recount = true;
  this.logInForm.patchValue({ recount: true });
  this.dataAccess.location.recount = true;

  this.dataAccess.getInvTags(this.dataAccess.location.physCountId,
  this.dataAccess.location.warehouse, this.dataAccess.location.location)
   .subscribe(element => {

     /* if ( !element.length) {
      this._recount = false;
      this.logInForm.patchValue({recount: false });
      this.dataAccess.location.recount = false;
      return;
     }
     element.forEach(item => {
      if ( item.warehouseId === this.dataAccess.location.warehouse &&
      item.physCountId === this.dataAccess.location.physCountId &&
      item.countQty === null ) {
        this._recount = false;
        this.logInForm.patchValue({recount: false });
        this.dataAccess.location.recount = false;
        return;
      }
    });*/
   });
 }

  private getPhysicalCountIds() {
      if (this.dataAccess.tagProgress.length) {
        this.getPhysCountIdsAndWarehouse();
      } else {
        this.dataAccess.tagProgress = [];
        this.dataAccess.getAllInvTags().subscribe(result => {
          this.dataAccess.modifyData(result);
          new MultiFieldSortPipe().transform(this.dataAccess.tagProgress,
            ['locationId', 'absoluteValue']);
            this.getPhysCountIdsAndWarehouse();
        });
      }
  }

  private getPhysCountIdsAndWarehouse() {
    const a = from(this.dataAccess.tagProgress).pipe (distinct(
      x => x.physCountId
    )
    );

    this.physLocIds = [];
      a.subscribe(element => {
      this.physLocIds.push(element.physCountId);

      this.physCountIdAndWarehouse = [];

      this.physLocIds.forEach(item => {
        from(this.dataAccess.tagProgress)
        .pipe (
          filter( ite => ite.physCountId === item ) )
          .pipe (
            distinct( y => y.warehouseId )
          )
        .subscribe( itm => {
          if (itm.warehouseId !== 'shop' && itm.warehouseId !== 'parts') {
          this.physCountIdAndWarehouse.push
            ({physCountId: itm.physCountId, warehouseId: itm.warehouseId});
          }
        });
      });
    });
  }

  private updateLocation(form) {
      this.dataAccess.location = {
      location: form.controls.locationId.value,
      warehouse: form.controls.warehouseId.value,
      countBy: form.controls.userId.value,
      physCountId: form.controls.physCountId.value,
      recount: form.controls.recount.value
    };
  }

  public logIn(form): void {
    this.dataAccess.location = {
      location: form.locationId,
      warehouse: form.warehouseId,
      countBy: form.userId,
      physCountId: form.physCountId,
      recount: form.recount
    };
    this.router.navigate(['recount']);
  }

  public validateLocation() {
    if ( this.logInForm.controls.physCountId && this.logInForm.controls.warehouseId &&
       this.dataAccess.tagProgress.filter( x =>
      x.physCountId === this.logInForm.controls.physCountId.value &&
      x.warehouseId === this.logInForm.controls.warehouseId.value &&
      x.locationId === this.logInForm.controls.locationId.value ).length ) {
        this.canRecount();
        return;
      } else {
        this.locationErrorMessage = `"${this.location.nativeElement.value}"
          is Not a valid location for Physical Count ID of
          "${this.logInForm.controls.physCountId.value}"
          and  Warehouse ID of
          "${this.logInForm.controls.warehouseId.value}"`;
        this.logInForm.patchValue({locationId: ''});
        this.location.nativeElement.focus();
      }
  }

  ngOnDestroy() {
    if (this._logInFormSubsription) {
      this._logInFormSubsription.unsubscribe();
    }
  }
}
