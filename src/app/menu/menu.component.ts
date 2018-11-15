import { DataAccessService } from './../data-access.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'physmancnsl-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private router: Router, public dataAccess: DataAccessService) { }

  ngOnInit() {
  }

  public login() {
    this.router.navigate(['login']);
  }

  public countInput() {
    this.router.navigate(['partCount']);
  }

  public recount() {
    this.router.navigate(['recount']);
  }

  public agTags() {
    this.router.navigate(['agTags']);
  }

  public agUncounted() {
    this.router.navigate(['agUncounted']);
  }

  public agLocationProgress() {
    this.router.navigate(['agLocationProgress']);
  }
}

