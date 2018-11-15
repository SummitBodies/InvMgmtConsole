export interface IAllTags {
  countQty?: number;
  description: string;
  locationId: string;
  partId: string;
  physCountId: string;
  primaryLocId?: string;
  qtyOnHand: number;
  recountQty: number;
  tagNo: string;
  unitPrice: number;
  warehouseId:  string;
  countValue?: number;
  recountValue?: number;
  onHandValue?: number;
  useCountQty?: number;
  useCountValue?: number;
  valueVariance?: number;
  countVariance?: number;
  absValue?: number;
  prcntCntVar?: number;
  prcntValVar?: number;

}

export interface IPhyCountTagFromDb {
  rowId?: number;
  physCountId: string;
  tagNo: number;
  partId: string;
  locationId: string;
  countQty: number;
  countUserId: string;
  recountQty: number;
  recountUserId: string;
  warehouseId: string;
  qtyOnHand: number;
  description: string;
  stockUM: string;
  primaryLocId?: string;
  primaryWarehouseId?: string;
}

export interface ITagForPatch {
  physCountId: string;
  tagNo: number;
  countQty?: number;
  countUserId: string;
  recountQty?: number;
  recountUserId: string;
}


export interface IUncounted  {
  partId: string;
  description: string;
}

export interface ILocation {
    countBy?: string;
    recountBy?: string;
    warehouse: string;
    location: string;
    recount?: boolean;
    physCountId?: string;
}

export interface ITagProgress {
  absoluteValue: number;
  countQty: number;
  countValue: number;
  countVariance: number;
  description: string;
  dollarVariance: number;
  inventoryValue: number;
  locationId: string;
  partId: string;
  physCountId: string;
  qtyOnHand: number;
  recountQty: number;
  recountValue: number;
  tagNo: string;
  unitPrice: number;
  useCountQty: number;
  warehouseId: string;
  primaryLocId?: string;
}
