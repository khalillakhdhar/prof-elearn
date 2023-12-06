import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Email } from '../inbox/inbox.model';
import { emailData } from '../inbox/data';
import { ReclamationsService } from 'src/app/core/services/reclamation.service';

@Component({
  selector: 'app-emailread',
  templateUrl: './emailread.component.html',
  styleUrls: ['./emailread.component.scss']
})

/**
 * Email read Component
 */
export class EmailreadComponent implements OnInit {

  public index: number;
  public Editor = ClassicEditor;
  // bread crumb items
  breadCrumbItems: Array<{}>;
  emailRead:any;

  constructor(private reclamationService:ReclamationsService,private route: ActivatedRoute, private modalService: NgbModal) {
    this.route.params.subscribe(params => {
// read reclamations by id from params.id
      this.reclamationService.read_Reclamation(params.id).subscribe(data => {
        this.emailRead = data.payload.data();
        console.log(this.emailRead);

  });
})
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Email' }, { label: 'Read Email', active: true }];
  }

  open(content) {
    this.modalService.open(content, { centered: true });
  }
}
