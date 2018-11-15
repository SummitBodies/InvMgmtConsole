import { DataAccessService } from './../data-access.service';
import { Component, OnInit } from '@angular/core';


import { ColumnApi, GridApi, GridOptions } from 'ag-grid-community';
import { MultiFieldSortPipe  } from '../multi-field-sort.pipe';

@Component({
  selector: 'physmancnsl-ag-locations',
  templateUrl: './ag-locations.component.html',
  styleUrls: ['./ag-locations.component.css']
})
export class AgLocationsComponent implements OnInit {

  public gridOptions: GridOptions;
  public icons: any;

  private api: GridApi;
  private columnApi: ColumnApi;
  public winHeight: string;

  constructor( public _partCountService: DataAccessService ) {}

  ngOnInit() {

//    this.winHeight = this._partCountService.winHeight - 400 + 'px';

    this.setGridOptions();

//    this._partCountService.getAllInvTags().subscribe(result => {
      this._partCountService.getTagData().subscribe(result => {
      new MultiFieldSortPipe().transform( result,  ['physCountId', 'warehouseId', 'locationId']);

    this.gridOptions.api.setRowData(
      new MultiFieldSortPipe().transform(
        this._partCountService.transformDataToLocations(result), ['complete']));
    });
  }

  private setGridOptions () {
      this.gridOptions = <GridOptions>{
      rowData: [],
      columnDefs: this.createColumnDefs(),
      onGridReady: () => {
          this.gridOptions.api.sizeColumnsToFit();
      },
      enableFilter: true,
      floatingFilter: true,
      enableColResize: true,
      enableSorting: true,
      suppressRowClickSelection: false,
    };
  }

  /* groupHeaders: true,
  toolPanelSuppressGroups: true,
  toolPanelSuppressValues: true
 */
  public onReady(params) {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }

  public createColumnDefs() {
    return [
      {
        headerName: 'Loc',
        field: 'location',
        width: 75,
        type: 'numericColumn',
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
        headerName: 'Tags',
        field: 'numTags',
        width: 65,
        type: 'numericColumn',
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
        headerName: 'Counted',
        field: 'counted',
        width: 95,
        type: 'numericColumn',
        filter: 'number',
        filterParams: {
          newRowAction: 'keep',
          clearButton: true,
          debounceMs: 250,
          defaultOption: 'equals',
          filterOptions: ['equals', 'contains']
        }
      },
      {
        headerName: 'Recounted',
        field: 'recounted',
        type: 'numericColumn',
        width: 95,
        filter: 'number',
        filterParams: {
          newRowAction: 'keep',
          clearButton: true,
          debounceMs: 250,
          defaultOption: 'equals',
          filterOptions: ['equals', 'contains']
        }
      },
      {
        headerName: 'Complete',
        field: 'complete',
        width: 95,
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
        headerName: 'Cnt Id',
        field: 'physCountId',
        width: 90,
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
        headerName: 'Whse',
        field: 'warehouse',
        width: 85,
        filter: 'text',
        filterParams: {
          newRowAction: 'keep',
          clearButton: true,
          debounceMs: 250,
          defaultOption: 'equals',
          filterOptions: ['equals', 'contains']
        }
      }
    ];
  }

}
