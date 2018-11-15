import { IAllTags } from './../interfaces';
import { DataAccessService } from './../data-access.service';
import { Component, OnInit } from '@angular/core';
import { map, filter } from 'rxjs/operators';
import { MultiFieldSortPipe } from '../multi-field-sort.pipe';

@Component({
  selector: 'physmancnsl-recount',
  templateUrl: './recount.component.html',
  styleUrls: ['./recount.component.css']
})
export class RecountComponent implements OnInit {

  public recountValue = 1000;
  constructor( public dataAccess: DataAccessService) { }

  ngOnInit() {
    this.dataAccess.getTagData()
    .pipe (
      map(element => {

        const locations = this.dataAccess.transformDataToLocations(new MultiFieldSortPipe()
        .transform( element,  ['physCountId', 'warehouseId', 'locationId']));

        const locationsArray = this.arrayOfCompletedLocations(locations);

        const filtered = element.filter( it =>
          it.absValue >= this.recountValue
          && it.recountQty === null                  //  Has not been recounted
          && locationsArray.includes(it.locationId)  //  Count for location is complete
        );
        return  new MultiFieldSortPipe().transform(filtered,  ['physCountId', 'warehouseId', 'locationId']);
      })
    )
    .subscribe ( item => console.log('40 ', item)
    );
  }

  arrayOfCompletedLocations( locationObject ) {
    const objects = locationObject.filter ( element => element.complete === true );

    const locations = [];
    objects.forEach(item => {
      locations.push(item.location);
    });

    return locations;

  }
}


