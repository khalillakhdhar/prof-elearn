import { Component, OnInit, Input, EventEmitter, ViewChild, Output } from '@angular/core';

import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Matiere } from '../../../core/models/matiere';
import { MatiereService } from '../../../core/services/matiere.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

/**
 * Projects-create component
 */
export class CreateComponent implements OnInit {

  constructor(private calendar: NgbCalendar,private matiereService:MatiereService) { }
  // bread crumb items
  matiere=new Matiere();
  breadCrumbItems: Array<{}>;

  hoveredDate: NgbDate;
  fromNGDate: NgbDate;
  toNGDate: NgbDate;
  selected: any;
  hidden: boolean;

  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

  @ViewChild('dp', { static: true }) datePicker: any;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Projects' }, { label: 'Create New', active: true }];

    this.selected = '';
    this.hidden = true;
  }
  addMatiere()
  {
    let mat=Object.assign({}, this.matiere);
    this.matiereService.create_NewMatiere(mat).then(res=>{
      this.matiere=new Matiere();
      console.log("ajouté avec succés");
    }).catch(error=>{
      console.log(error);
    }
    );

  }

}
