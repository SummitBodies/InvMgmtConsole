import { Observable } from 'rxjs';
import { DataAccessService } from './../data-access.service';
import { Component, OnInit } from '@angular/core';

import { GridApi } from 'ag-grid-community';
import { map, distinct, reduce } from 'rxjs/operators';


@Component({
  selector: 'physmancnsl-all-tags',
  templateUrl: './all-tags.component.html',
  styleUrls: ['./all-tags.component.css']
})
export class AllTagsComponent implements OnInit {

  public columnDefs = [
    {headerName: 'Tag', field: 'tagNo', width: 90, type: 'numericColumn'},
    {headerName: 'Loc', field: 'locationId', width: 90,  filter: 'text',
      filterParams: {
        newRowAction: 'keep',
        clearButton: true,
        debounceMs: 250,
        defaultOption: 'equals',
        filterOptions: ['equals', 'contains']
      }
    },
    {
      headerName: 'ABS Var',
      field: 'absValue',
      width: 105,
      type: 'numericColumn'
    },
    {
      headerName: '$ Var.',
      field: 'valueVariance',
      width: 105,
      type: 'numericColumn'
    },
    {
      headerName: 'Cnt Var.',
      field: 'countVariance',
      width: 105,
      type: 'numericColumn'
    },
    {headerName: 'Sys Qty', field: 'qtyOnHand', width: 85,  type: 'numericColumn'},
    {headerName: 'Cnt Qty', field: 'countQty', width: 85,  type: 'numericColumn' },
    {headerName: 'ReCnt Qty', field: 'recountQty', width: 85,  type: 'numericColumn'},
    {headerName: 'Part', field: 'partId', width: 85},
    {headerName: 'Description', field: 'description', width: 300 },
    {headerName: 'Prime Loc', field: 'primaryLocId', width: 85,  filter: 'text',
      filterParams: {
        newRowAction: 'keep',
        clearButton: true,
        debounceMs: 200,
        defaultOption: 'equals',
        filterOptions: ['equals', 'contains']
      }
    },
    {headerName: 'PhyCnt Id', field: 'physCountId',  width: 75,   filter: 'text',
      filterParams: {
        newRowAction: 'keep',
        clearButton: true,
        debounceMs: 200,
        defaultOption: 'equals',
        filterOptions: ['equals', 'contains']
      }
    },
    {headerName: 'Whse', field: 'warehouseId', width: 75, filter: 'text',
      filterParams: {
        newRowAction: 'keep',
        clearButton: true,
        debounceMs: 200,
        defaultOption: 'contains',
        filterOptions: ['equals', 'contains']
      }
    },
    {headerName: 'Price', field: 'unitPrice', width: 100,  type: 'numericColumn'},
  ];

  public rowData;
  private gridApi: GridApi;
  public totalTagsToCount: number;
  public percentTagsCounted: number;
  private lockedTags: number;
  public itemsCounted: number;
  public percentLocationsCompleted: number;
  public locationsCompleted: number;
  public numLocations: number;
  public totalVariance: number;

  constructor(public dataService: DataAccessService) { }

  ngOnInit() {
  }

  onGridReady(params) {  // note: This is called from the HTML
    this.gridApi = params.api;
    this.rowData = this.getData();
  }

  refreshData() {
    this.rowData = this.getData();
  }

  getData() {
  const rowData = this.dataService.getTagData()
    .pipe(
      map( element => {
        this.totalTagsToCount = element.filter( item => item.primaryLocId === item.locationId ).length;
        this.lockedTags = element.length - this.totalTagsToCount;
        this.itemsCounted = element.filter( item => item.countQty !== null &&
                                                    item.primaryLocId === item.locationId).length;
        this.percentTagsCounted = Math.round( this.itemsCounted /
          this.totalTagsToCount * 10000) / 100 || 0;

       const warehouses = Array.from(new Set(element.map((item: any) => item.warehouseId)));

       let locationsByWarehouse = element.filter( x => x.warehouseId === warehouses[0]);
       const warehouses1 = Array.from(new Set(locationsByWarehouse.map((item: any) => item.locationId)));

       locationsByWarehouse = element.filter( x => x.warehouseId === warehouses[1]);
       const warehouses2 = Array.from(new Set(locationsByWarehouse.map((item: any) => item.locationId)));

       this.numLocations = warehouses1.length + warehouses2.length;

       this.locationsCompleted = 0;
       warehouses1.forEach(data => {
         element.filter(  item => item.countQty === null &&
                          item.warehouseId === warehouses[0] &&
                          item.locationId === data ).length ?
                            this.locationsCompleted = this.locationsCompleted :
                            this.locationsCompleted++;
       });
       warehouses2.forEach(data => {
        element.filter(  item => item.countQty === null &&
                         item.warehouseId === warehouses[1] &&
                         item.locationId === data ).length ?
                           this.locationsCompleted = this.locationsCompleted :
                           this.locationsCompleted++;
      });

        this.percentLocationsCompleted = Math.round(this.locationsCompleted / this.numLocations * 10000) / 100 || 0;
        this.totalVariance = element.reduce((sum, value) =>  sum + value.valueVariance, 0 );
        return element;
      })
    );
    return rowData;
    }
}
