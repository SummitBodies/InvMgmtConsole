import { IPhyCountTagFromDb } from './../interfaces';
import { DataAccessService } from './../data-access.service';
import {  Component,  OnInit,  OnDestroy,  ViewChild,  ElementRef} from '@angular/core';

import { ITagForPatch } from '../interfaces';

import { ColumnApi, GridApi, GridOptions } from 'ag-grid-community';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';


@Component({
  selector: 'physmancnsl-ag-uncounted',
  templateUrl: './ag-uncounted.component.html',
  styleUrls: ['./ag-uncounted.component.css']
})
export class AgUncountedComponent implements OnInit, OnDestroy {
  @ViewChild('countQty') countQty: ElementRef;

  public gridOptions: GridOptions;
  public icons: any;

  private api: GridApi;
  private columnApi: ColumnApi;
  public winHeight: string;

  partCountForm: FormGroup;
  private _partCountFormSubscription;
  public selectedPartId;

  public rowData;
  private gridApi: GridApi;
  public columnDefs = this.createColumnDefs();

  constructor(
    public dataAccess: DataAccessService,
    public fb: FormBuilder
  ) {}

  ngOnInit() {
  //  this.winHeight = this.dataAccess.winHeight - 210 + 'px';

      this.partCountForm = this.fb.group({
      partNumber: [this.selectedPartId],
      countQty: [null]
    });

    this.partCountFormSubscription();

    /* this.dataAccess.getInvTags(this.dataAccess.location.physCountId,
      this.dataAccess.location.warehouse, this.dataAccess.location.location)
      .pipe (
        map((data: IPhyCountTagFromDb[]) =>
        data.filter( element => element.countQty === null)
        )
      ); */
      /* .subscribe(el => {


       this.dataAccess.tags = el;
      }); */

    /*   this.gridOptions = <GridOptions>{
      rowData: this.dataAccess.tags
      // .filter(        element => element.countQty === null)
      ,
      columnDefs: this.createColumnDefs(),
      onGridReady: () => {
        //  this.gridOptions.api.sizeColumnsToFit();
      },
      // rowSelection: 'single',
      onSelectionChanged: this.onSelectionChanged,
      enableFilter: true,
      floatingFilter: true,
      enableColResize: true,
      enableSorting: true,
      suppressRowClickSelection: false,
    };
   */
  this.gridOptions = <GridOptions> {
    onSelectionChanged: this.onSelectionChanged
  };

  }
  // groupHeaders: true,
  // toolPanelSuppressGroups: true,
  // toolPanelSuppressValues: true

  onGridReady(params) {  // note: This is called from the HTML
    this.gridApi = params.api;
    this.rowData =  this.dataAccess.getInvTags(this.dataAccess.location.physCountId,
      this.dataAccess.location.warehouse, this.dataAccess.location.location)
      .pipe (
        map((data: IPhyCountTagFromDb[]) => {
          this.dataAccess.tags = data.filter( element => element.countQty === null );
          return this.dataAccess.tags;
        })
      );
  }

  public exit(e) {
    if (e.keyCode === 32 || e.keyCode ===  13) {
    this.countQty.nativeElement.focus();
    }
  }

  EnterCount() {
    if (this.gridOptions.api.getSelectedRows().length) {
      this.partCountForm.patchValue({
        partNumber: this.gridOptions.api.getSelectedRows()[0].partId
      });
      this.countQty.nativeElement.focus();
    }
  }
  partCountFormSubscription() {}

  enterZeroInAllRemaining() {
    this.dataAccess.tags.forEach(element => {
      console.log('119', element);

      this.updateDatabase(element.tagNo, 0);
    });

    this.gridOptions.api.setRowData(
      this.dataAccess.tags.filter(element => element.countQty === null)
    );
  }

  countBlur() {
    if (
      this.partCountForm.controls.partNumber.value &&
      this.partCountForm.controls.countQty.value
    ) {
      // this.updateDatabase();
      this.updateDatabase(this.gridOptions.api.getSelectedRows()[0].tagNo,
       this.partCountForm.controls.countQty.value);

      this.dataAccess.tags.filter(
        element =>
          element.tagNo === this.gridOptions.api.getSelectedRows()[0].tagNo
      )[0].countQty = this.partCountForm.controls.countQty.value;

      this.gridOptions.api.setRowData(
        this.dataAccess.tags.filter(element => element.countQty === null)
      );
      this.partCountForm.patchValue({ partNumber: null, countQty: null });
    }
  }

  public updateDatabase(tagNo: number, countQty: number) {
    const tagForPatch: ITagForPatch = {
      physCountId: this.dataAccess.location.physCountId,
      /* tagNo: this.gridOptions.api.getSelectedRows()[0].tagNo,
      countQty: this.partCountForm.controls.countQty.value, */
      tagNo: tagNo,
      countQty: countQty,
      countUserId: this.dataAccess.location.countBy,
      recountQty: null,
      recountUserId: null
    };
    this.dataAccess.patchInvTag(tagForPatch).subscribe(
      res => {},
      error => {
        console.log('Error', error);
      }
    );
  }

  private onSelectionChanged() {
    this.selectedPartId = this.api.getSelectedRows()[0].partId;
  }

  public onReady(params) {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }

  public createColumnDefs() {
    return [
      {
        headerName: 'Part Id',
        field: 'partId',
        width: 100,
        filter: 'text',
        filterParams: {
          newRowAction: 'keep',
          clearButton: true,
          debounceMs: 200,
          defaultOption: 'equals',
          filterOptions: ['equals', 'contains']
        }
      },
      {
        headerName: 'Whse',
        field: 'warehouseId',
        width: 75,
        filter: 'text',
        filterParams: {
          newRowAction: 'keep',
          clearButton: true,
          debounceMs: 250,
          defaultOption: 'equals',
          filterOptions: ['equals', 'contains']
        }
      },
      {
        headerName: 'Loc',
        field: 'locationId',
        width: 65,
        type: 'numericColumn'
      },
      {
        headerName: 'Description',
        field: 'description',
        width: 360
      },
      {
        headerName: 'Sys Count',
        field: 'qtyOnHand',
        width: 90
      },
      {
        headerName: 'Count',
        field: 'countQty',
        width: 90
      }
    ];
  }

  ngOnDestroy() {
    if (this._partCountFormSubscription) {
      this._partCountFormSubscription.unsubscribe();
    }
  }
}
