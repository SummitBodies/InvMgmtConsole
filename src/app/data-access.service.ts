import { IAllTags, IPhyCountTagFromDb, ITagForPatch, ILocation, ITagProgress } from './interfaces';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Http, Headers, Response } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  private _location: ILocation;
  // private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private headers = {headers: new  HttpHeaders({ 'Content-Type': 'application/json'})};
  private _tags: IPhyCountTagFromDb[] = [];
  private itemsCounted = 0;
  private _adminView = true;
  private _totalVariance: number;
  private _itemsCounted: number;
  private _totalNumberTags: number;
  private _warehouseIds: string[] = [];
  private _tagProgress: ITagProgress[] = [];

  constructor(private http: HttpClient) { }

  public set tags(value: IPhyCountTagFromDb[]) { this._tags = value; }
  public get tags(): IPhyCountTagFromDb[] {return this._tags; }

  public set location(value: ILocation) { this._location = value; }
  public get location(): ILocation {return this._location; }

  public get adminView(): boolean {
    return this._adminView;
  }

  public set adminView(v: boolean) {
    this._adminView = v;
  }

  public get warehouseIds(): string[] {    return this._warehouseIds;  }
  public set warehouseIds(v: string[]) { this._warehouseIds = v;  }

  public set tagProgress(value: ITagProgress[]) { this._tagProgress = value; }
  public get tagProgress(): ITagProgress[] {return this._tagProgress; }


  public getInvTags ( phsyInvId: string, warehouseId: string, locationId: string) {
    return this.http.get(
      `http://10.0.9.29:8010/ReceivingAPI/api/PhysCountTags/${phsyInvId}/${warehouseId}/${locationId}`);
  }

  getTagData () {
    return this.http.get(`http://10.0.9.29:8010/ReceivingAPI/api/PhysCountTags/`)
    .pipe(
      map((data: IAllTags[]) => {
        this.itemsCounted = 0;
        data.forEach(element => {
          if ( element.countQty !== null ) { this.itemsCounted ++; }
          element.countQty !== null ?
            element.countValue = Math.round(element.countQty * element.unitPrice * 100) / 100  :
            element.countValue = null;
          element.qtyOnHand !== null ?
            element.onHandValue = Math.round(element.qtyOnHand * element.unitPrice * 100) / 100 :
            element.onHandValue = null;

            element.recountQty !== null ?
              element.recountValue = Math.round(element.recountQty * element.unitPrice * 100) / 100 :
              element.recountValue = null;

          element.recountQty !== null ?
            element.useCountQty = element.recountQty : element.useCountQty = element.countQty;
          element.recountQty !== null ?
            element.useCountValue = element.recountValue : element.useCountValue = element.countValue;

          element.useCountValue !== null ? element.valueVariance =
            Math.round((element.useCountValue - element.onHandValue) * 100) / 100 :
            element.valueVariance = 0;

          element.useCountQty !== null ? element.countVariance = element.useCountQty - element.qtyOnHand :
            element.countVariance = 0;

          element.countVariance !== 0 ?
            element.absValue = Math.round(Math.abs(element.valueVariance) * 100) / 100 :
             element.absValue = 0;

         // Math.abs(element.qtyOnHand - element.useCountValue) / element.qtyOnHand

        });
        return data;
      }), catchError( error => throwError (error))
    );
  }

  public transformDataToLocations(result): any[] {
    const locations = [];
    let counted = 0;
    let recounted = 0;
    let numTags = 0;
    let location = null;
    let totalVariance = 0;
    let warehouse = null;
    let physCountId = null;

    result.forEach(element => {
      if (element.physCountId !== physCountId || element.warehouseId !== warehouse || element.locationId !== location) {
        if (location !== null) {
          // let completed;
          counted === numTags ? completed = true : completed = false;
          locations.push({
            location: location,
            numTags: numTags, counted: counted, recounted: recounted,
            complete: completed, totalVariance: totalVariance,
            warehouse: warehouse, physCountId: physCountId
          });
          totalVariance = numTags = recounted = counted = 0;
        }
      }

      numTags++;
      element.countQty !== null ? ++counted : counted = counted;
      element.recountQty !== null ? ++recounted : recounted = recounted;
      if (element.recount !== null) {
        totalVariance += element.recountQty * element.unitPrice;
      } else if (element.count !== null) {
        totalVariance += element.countQty * element.unitPrice;
      }
      location = element.locationId;
      warehouse = element.warehouseId;
      physCountId = element.physCountId;
    });

    let completed;
    counted === numTags ? completed = true : completed = false;  // Changed
    locations.push({
      location: location,
      numTags: numTags, counted: counted, recounted: recounted, complete: completed,
      totalVariance: totalVariance, warehouse: warehouse, physCountId: physCountId
    });

    return locations;
  }


// Note 8010 is the test Database SILLCTEST and 2000 is production SILLC
public getAllInvTags() {
 // this._tagProgress = []; // Is this the right place
  return this.http.get(`http://10.0.9.29:8010/ReceivingAPI/api/PhysCountTags/`);

  //  .map(response => this.modifyData(response))
    // .catchError((error: any) => Observable.throw(error.json().error || 'Server error'));
}

public patchInvTag(tag: ITagForPatch) {
  /* return this.http.patch(
    `http://10.0.9.29:8010/ReceivingAPI/api/PhysCountTags/${tag.physCountId}/${tag.tagNo}`,
      JSON.stringify(tag))
      .pipe (
        map((res: Response) => res.json())
      ); */
    //  .catchError((error: any) => Observable.throw(error.json().error || 'Server error'));

    return this.http.patch(
      `http://10.0.9.29:8010/ReceivingAPI/api/PhysCountTags/${tag.physCountId}/${tag.tagNo}`,
        tag);
}

public modifyData(result): void {
  this._totalVariance = 0;
  this._totalNumberTags = 0;
  this._itemsCounted = 0;
  result.forEach(element => {
  let countValue: number;
  let recountValue: number;
  let inventoryValue: number;
  let dollarVariance: number;
  let countVariance: number;
  let absoluteValue: number;
  let useCountValue: number;
  let useCountQty: number;

  element.countQty !== null ?
    countValue = element.countQty * element.unitPrice : countValue = null;

  element.recountqTY !== null ?
    recountValue = element.recountQty * element.unitPrice : recountValue = null;

  element.qtyOnHand !== null ?
    inventoryValue = element.qtyOnHand * element.unitPrice : inventoryValue = null;

  element.recountQty !== null ? useCountValue = recountValue :
    useCountValue = countValue;

  element.recountQty !== null ? useCountQty = element.recountQty :
    useCountQty = element.countQty;

  useCountValue !== null ?
    dollarVariance = Math.round(((useCountQty * element.unitPrice) - inventoryValue) * 100) / 100 :
    dollarVariance = 0;

  useCountQty !== null ?
    countVariance = useCountQty - element.qtyOnHand  :
    countVariance = null;

  countVariance !== null ? absoluteValue =
  Math.round(Math.abs(dollarVariance) * 100) / 100 : absoluteValue = 0;

  if (dollarVariance !== null) {
    this._totalVariance += dollarVariance;
  }

  this._totalNumberTags++;

  if (element.countQty !== null) {
    this._itemsCounted++;
  }

  this._tagProgress.push({
    physCountId: element.physCountId,
    tagNo: element.tagNo,
    warehouseId: element.warehouseId,
    locationId: element.locationId,
    partId: element.partId,
    countQty: element.countQty,
    recountQty: element.recountQty,
    qtyOnHand: element.qtyOnHand,
    description: element.description,
    unitPrice: element.unitPrice,
    countValue: countValue,
    recountValue: recountValue,
    inventoryValue: inventoryValue,
    dollarVariance: dollarVariance,
    countVariance: countVariance,
    absoluteValue: absoluteValue,
    useCountQty: useCountQty,
    primaryLocId: element.primaryLocId
  });
});
}

}
