import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-groups',
  templateUrl: './new-groups.component.html',
  styleUrls: ['./new-groups.component.scss']
})
export class NewGroupsComponent implements OnInit {

  constructor(public Router: Router) { }

  ngOnInit() {
  }

  redirect() {
    // if (this.userEdit == true) {
    // }
    this.Router.navigate(['/groups']);
  }

}
