import { Component, OnInit } from '@angular/core';

import { revenueBarChart, statData } from './data';

import { ChartType } from './profile.model';
import { UsersService } from '../../../core/services/user.service';
import { User } from 'src/app/core/models/user';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

/**
 * Contacts-profile component
 */
export class ProfileComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  current:User;
  user:User;
  id: string;
  revenueBarChart: ChartType;
  statData;
  constructor(private usersService:UsersService) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'Profile', active: true }];
this.current=JSON.parse(localStorage.getItem('user'));
console.log("actuelle",this.current);
this.readme(this.current.email);

    // fetches the data
    this._fetchData();
  }

  readme(email): void {
    this.usersService.read_current(email).pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id,
            ...c.payload.doc.data() as {} })
        )
      )
    ).subscribe(data => {
      this.user = data[0];
     // this.user=this.actual;
     // localStorage.setItem("myid",this.actual.id);

     // console.clear();
      console.log("myuser",this.user);


    }
    );
  }
  update()
  {
    let us=Object.assign(this.user,{});
    this.usersService.update_User(this.user.id,us );

  }
  /**
   * Fetches the data
   */
  private _fetchData() {
    this.revenueBarChart = revenueBarChart;
    this.statData = statData;
  }
}
