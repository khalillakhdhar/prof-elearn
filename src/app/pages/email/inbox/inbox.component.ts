import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Email } from './inbox.model';
import { emailData } from './data';
import Swal from 'sweetalert2';
import { ReclamationsService } from '../../../core/services/reclamation.service';
import { Reclamation } from '../../../core/models/reclamation';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})

/**
 * Email Inbox component
 */
export class InboxComponent implements OnInit {
reclamations: Reclamation[];
types=['Probléme de connexion','Probléme de paiement','Probléme de téléchargement','Autre'];
  public Editor = ClassicEditor;
  // bread crumb items
  breadCrumbItems: Array<{}>;
//reclamation:Reclamation;
  // paginated email data
  emailData: Array<Email>;
  emailIds: number[] = [];
  // page number
  page = 1;
  // default page size
  pageSize = 15;
  // total number of records
  totalRecords = 0;

  // start and end index
  startIndex = 1;
  endIndex = 15;
  user=JSON.parse(localStorage.getItem('user'));
reclamation=new Reclamation();
  constructor(private modalService: NgbModal,private reclamationService:ReclamationsService) {
  }

  ngOnInit() {

    this.breadCrumbItems = [{ label: 'Reclamation' }, { label: 'Message', active: true }];
    this.emailData = emailData;
    this.totalRecords = emailData.length;
    this.readReclamations();
  }

  open(content) {
    this.modalService.open(content, { centered: true });
  }
// add reclamation to firebase reclamationService
  addReclamation(){
    this.reclamation.email=this.user.email;
    this.reclamation.dateheure=Date.now();
    let rec=Object.assign({}, this.reclamation);
    this.reclamationService.create_NewReclamation(rec).then(resp=>{
      this.reclamation=new Reclamation();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Reclamation envoyée avec succés',
        showConfirmButton: false,
        timer: 1500
      })
    })
  }



  markUnread() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.emailIds.length; i++) {
      const obj = this.emailData.find(o => o.id === this.emailIds[i]);
      const index = this.emailData.indexOf(obj);
      this.emailData[index].unread = true;
    }
    this.emailIds = [];
  }

  selectMail(event, id) {
    if (event.target.checked) {
      this.emailIds.push(id);
    } else {
      this.emailIds.splice(this.emailIds.indexOf(id), 1);
    }
  }

  deleteMail() {
    const found = this.emailData.some(r => this.emailIds.indexOf(r.id) >= 0);
    if (found) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.emailIds.length; i++) {
        const obj = this.emailData.find(o => o.id === this.emailIds[i]);
        this.emailData.splice(this.emailData.indexOf(obj), 1);
      }
    }
    this.emailIds = [];
  }
//read reclamations from firebase reclamationService
  readReclamations(){
    this.reclamationService.read_Reclamations().subscribe(data => {
      this.reclamations = data.map(e => {
        return {
          id: e.payload.doc.id,
          email: e.payload.doc.data()['email'],
          type: e.payload.doc.data()['type'],
          message: e.payload.doc.data()['message'],
          dateheure: e.payload.doc.data()['dateheure'],
        };
      })
      console.log("reclamations",this.reclamations);
    });
  }



  confirm() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.deleteMail();
        Swal.fire('Deleted!', 'Mail has been deleted.', 'success');
      }
    });
  }

  /**
   * Handle on page click event
   */
  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize + 1;
    this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    this.emailData = emailData.slice(this.startIndex - 1, this.endIndex - 1);
  }
}
